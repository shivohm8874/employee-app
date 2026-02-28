import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Welcome from "./steps/Welcome"
import "./assessment.css"

const TOTAL_STEPS = 7

export default function HealthAssessment() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  function nextStep() {
    setStep((s) => s + 1)
  }

  switch (step) {
    case 0:
      return <Welcome onNext={nextStep} />

    default:
      return (
        <div className="assessment-screen">
          <div className="assessment-content">
            <h2>More assessment steps are in progress</h2>
            <p>You can continue to home for now.</p>
            <p>{`Step ${Math.min(step + 1, TOTAL_STEPS)} of ${TOTAL_STEPS}`}</p>
          </div>
          <div className="assessment-footer">
            <button className="next-btn" onClick={() => navigate("/home")} type="button">
              Go to Home
            </button>
          </div>
        </div>
      )
  }
}
