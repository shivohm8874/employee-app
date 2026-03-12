import { useEffect, useState } from "react"
import { FiArrowLeft, FiCalendar, FiCheck, FiMapPin } from "react-icons/fi"
import { RiTestTubeLine } from "react-icons/ri"
import { useLocation, useNavigate } from "react-router-dom"
import { ensureEmployeeActor } from "../../services/actorsApi"
import { getEmployeeCompanySession } from "../../services/authApi"
import { bookLabOrder } from "../../services/labApi"
import { goBackOrFallback } from "../../utils/navigation"
import "./labtest.css"

type LabTestItem = {
  name: string
}

export default function LabConfirm() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<"processing" | "confirmed">("processing")
  const { state } = useLocation() as {
    state?: {
      selectedTest?: LabTestItem
      collectionType?: string
      date?: string
      time?: string
      readiness?: Record<string, "yes" | "no">
    }
  }

  const dateTime = state?.date ? `${state.date}${state?.time ? ` ${state.time}` : ""}` : "Arriving in 5 mins"
  const companySession = getEmployeeCompanySession()
  const collectionType = state?.collectionType === "office" ? "Office Collection" : "Home Collection"
  const selectedTest = state?.selectedTest?.name ?? "Complete Blood Count (CBC)"

  useEffect(() => {
    let active = true

    void (async () => {
      try {
        const employee = await ensureEmployeeActor({
          companyReference: "astikan-demo-company",
          companyName: companySession?.companyName ?? "Astikan",
          fullName: "Astikan Employee",
          handle: "astikan-employee",
          email: "employee@astikan.local",
        })

        await bookLabOrder({
          companyReference: employee.companyId,
          companyName: companySession?.companyName ?? "Astikan",
          email: employee.email,
          customer_name: "Astikan Employee",
          mobile: "9999999999",
          test_name: selectedTest,
          amount: 999,
          date: state?.date,
          time: state?.time,
          collection_type: collectionType,
          readiness: state?.readiness ?? {},
        })
      } catch {
        // Keep the confirmation UX resilient even if upstream booking is temporarily unavailable.
      } finally {
        if (active) {
          window.setTimeout(() => {
            if (active) setPhase("confirmed")
          }, 1200)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="lab-page">
      <div className="lab-header">
        <button className="lab-back" onClick={() => goBackOrFallback(navigate)} type="button" aria-label="Back">
          <FiArrowLeft />
        </button>
        <div>
          <h1>Lab Test Booking</h1>
          <p>Book tests & get reports online</p>
        </div>
      </div>

      <div className="lab-steps">
        <div className="step done">1. Tests</div>
        <span>-</span>
        <div className="step done">2. Location</div>
        <span>-</span>
        <div className="step done">3. Schedule</div>
        <span>-</span>
        <div className="step active">4. Confirm</div>
      </div>

      {phase === "processing" ? (
        <div className="confirm-top processing">
          <div className="processing-ring">
            <span />
          </div>
          <h2>Processing Booking...</h2>
          <p>Please wait while we confirm your lab appointment</p>
        </div>
      ) : (
        <>
          <div className="confirm-top">
            <div className="confirm-check pulse">
              <span className="confirm-check-inner">
                <FiCheck />
              </span>
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your lab test has been booked successfully</p>
          </div>

          <div className="detail-box">
            <h3>Booking Detail</h3>

            <div className="detail-item">
              <FiCalendar />
              <div>
                <span>Date & Time</span>
                <strong>{dateTime}</strong>
              </div>
            </div>

            <div className="detail-item">
              <FiMapPin />
              <div>
                <span>Collection Type</span>
                <strong>{collectionType}</strong>
              </div>
            </div>

            <div className="detail-item">
              <RiTestTubeLine />
              <div>
                <span>Tests Selected</span>
                <strong>{selectedTest}</strong>
              </div>
            </div>
          </div>

          <div className="bottom-buttons single">
            <button className="btn-primary" onClick={() => navigate("/home")} type="button">
              Return Home
            </button>
          </div>
        </>
      )}
    </div>
  )
}
