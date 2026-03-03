import { useEffect, useMemo, useState } from "react"
import { FiAlertTriangle, FiArrowLeft, FiClock, FiHeart, FiLoader, FiMessageCircle, FiNavigation } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { goBackOrFallback } from "../../utils/navigation"
import "./ai-symptom-analyser.css"

type Specialty = "Internal Medicine" | "Cardiology" | "Dermatology" | "Pulmonology"
type StepKey = "symptom" | "duration" | "severity" | "history" | "routing"

type SeverityOption = {
  label: "Low" | "Moderate" | "High"
  score: number
  hint: string
}

const symptomOptions = [
  "Fever",
  "Headache",
  "Dizziness",
  "Nausea",
  "Chest Pain",
  "Breathing Issue",
  "Cough",
  "Fatigue",
  "Skin Rash",
]

const durationOptions = ["Since today", "2-3 days", "1 week+", "Recurring"] as const
const historyOptions = ["None", "Diabetes", "Hypertension", "Asthma", "Heart Condition", "Thyroid"] as const
const severityOptions: SeverityOption[] = [
  { label: "Low", score: 30, hint: "Mild discomfort" },
  { label: "Moderate", score: 58, hint: "Affecting routine" },
  { label: "High", score: 82, hint: "Needs urgent attention" },
]

const stepOrder: StepKey[] = ["symptom", "duration", "severity", "history", "routing"]

function inferSpecialty(symptoms: string[]): Specialty {
  const text = symptoms.join(" ").toLowerCase()
  if (text.includes("chest") || text.includes("heart")) return "Cardiology"
  if (text.includes("skin") || text.includes("rash")) return "Dermatology"
  if (text.includes("breathing") || text.includes("cough") || text.includes("asthma")) return "Pulmonology"
  return "Internal Medicine"
}

export default function AISymptomAnalyser() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedSymptom, setSelectedSymptom] = useState("")
  const [duration, setDuration] = useState<(typeof durationOptions)[number] | "">("")
  const [severity, setSeverity] = useState<SeverityOption | null>(null)
  const [history, setHistory] = useState<(typeof historyOptions)[number] | "">("")

  const step = stepOrder[stepIndex]
  const selectedSymptoms = selectedSymptom ? [selectedSymptom] : []
  const specialty = useMemo(() => inferSpecialty(selectedSymptoms), [selectedSymptoms])
  const triageLevel = severity?.label ?? "Moderate"
  const recommendedMode = (severity?.score ?? 58) >= 70 ? "OPD Visit" : "Teleconsultation"

  function routeToDoctors() {
    navigate("/teleconsultation", {
      state: {
        fromAiAnalyser: true,
        preselectedSpecialty: specialty,
        selectedSymptoms,
        analysisQuery: `${selectedSymptom} ${duration} ${history}`.trim(),
        recommendedMode: recommendedMode === "OPD Visit" ? "opd" : "tele",
        triageLevel,
      },
    })
  }

  useEffect(() => {
    if (step !== "routing") return
    const timer = window.setTimeout(() => {
      routeToDoctors()
    }, 900)
    return () => window.clearTimeout(timer)
  }, [step, specialty, selectedSymptom, duration, history, recommendedMode, triageLevel])

  function handleBack() {
    if (stepIndex === 0) {
      goBackOrFallback(navigate)
      return
    }
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <main className="symptom-analyser-page app-page-enter">
      <header className="symptom-analyser-header app-fade-stagger">
        <button className="analyser-back app-pressable" onClick={handleBack} type="button" aria-label="Back">
          <FiArrowLeft />
        </button>
        <div>
          <h1>AI Symptom Analyser</h1>
          <p>Step-by-step triage</p>
        </div>
      </header>

      <section className="symptom-analyser-content app-content-slide">
        <section className="analyser-step-card app-fade-stagger">
          {step !== "routing" && (
            <div className="step-indicator" aria-label="Progress">
              {stepOrder.slice(0, 4).map((_, index) => (
                <span key={index} className={index <= stepIndex ? "active" : ""} />
              ))}
            </div>
          )}

          {step === "symptom" && (
            <>
              <h2>What is your main symptom?</h2>
              <p>Tap one symptom to continue.</p>
              <div className="step-grid">
                {symptomOptions.map((item) => (
                  <button
                    key={item}
                    className="step-chip app-pressable"
                    type="button"
                    onClick={() => {
                      setSelectedSymptom(item)
                      setStepIndex(1)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "duration" && (
            <>
              <h2>How long have you had this?</h2>
              <p>Choose one option.</p>
              <div className="step-grid two-col">
                {durationOptions.map((item) => (
                  <button
                    key={item}
                    className="step-chip app-pressable"
                    type="button"
                    onClick={() => {
                      setDuration(item)
                      setStepIndex(2)
                    }}
                  >
                    <FiClock /> {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "severity" && (
            <>
              <h2>How severe is it now?</h2>
              <p>Select severity to continue.</p>
              <div className="severity-grid">
                {severityOptions.map((item) => (
                  <button
                    key={item.label}
                    className={`severity-card app-pressable ${item.label.toLowerCase()}`}
                    type="button"
                    onClick={() => {
                      setSeverity(item)
                      setStepIndex(3)
                    }}
                  >
                    <strong>{item.label}</strong>
                    <span>{item.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "history" && (
            <>
              <h2>Any medical history?</h2>
              <p>Tap one to finish assessment.</p>
              <div className="step-grid">
                {historyOptions.map((item) => (
                  <button
                    key={item}
                    className="step-chip app-pressable"
                    type="button"
                    onClick={() => {
                      setHistory(item)
                      setStepIndex(4)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "routing" && (
            <>
              <h2>Matching doctors for you</h2>
              <p>Preparing recommendations based on your selections.</p>
              <div className="routing-stack">
                <article>
                  <span><FiHeart /></span>
                  <div>
                    <h3>Symptom</h3>
                    <p>{selectedSymptom}</p>
                  </div>
                </article>
                <article>
                  <span><FiAlertTriangle /></span>
                  <div>
                    <h3>Triage</h3>
                    <p>{triageLevel}</p>
                  </div>
                </article>
                <article>
                  <span><FiNavigation /></span>
                  <div>
                    <h3>Recommended visit</h3>
                    <p>{recommendedMode}</p>
                  </div>
                </article>
              </div>
              <div className="routing-loader">
                <FiLoader /> Opening doctor options...
              </div>
            </>
          )}
        </section>
      </section>

      {step !== "routing" && (
        <footer className="symptom-analyser-footer app-fade-stagger">
          <button className="analyser-secondary app-pressable" type="button" onClick={() => navigate("/ai-chat")}>
            <FiMessageCircle />
            Ask AI Chat Instead
          </button>
        </footer>
      )}
    </main>
  )
}
