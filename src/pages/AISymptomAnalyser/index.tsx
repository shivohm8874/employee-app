import { useEffect, useMemo, useState } from "react"
import { FiArrowLeft, FiClock, FiHeart, FiLoader, FiSearch, FiShield, FiZap } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { goBackOrFallback } from "../../utils/navigation"
import "./ai-symptom-analyser.css"

type Specialty = "Internal Medicine" | "Cardiology" | "Dermatology" | "Pulmonology"

type OptionItem = {
  label: string
  value: string
  severityImpact: number
}

type SymptomQuestion = {
  id: string
  title: string
  subtitle: string
  icon: "pulse" | "clock" | "shield" | "heart"
  options: OptionItem[]
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

function inferSpecialty(symptom: string): Specialty {
  const text = symptom.toLowerCase()
  if (text.includes("chest") || text.includes("heart")) return "Cardiology"
  if (text.includes("skin") || text.includes("rash")) return "Dermatology"
  if (text.includes("breathing") || text.includes("cough") || text.includes("asthma")) return "Pulmonology"
  return "Internal Medicine"
}

function buildSymptomQuestions(symptom: string): SymptomQuestion[] {
  const lower = symptom.toLowerCase()

  const symptomSpecific: SymptomQuestion = lower.includes("chest")
    ? {
        id: "pattern",
        title: "When does chest discomfort feel stronger?",
        subtitle: "This helps us prioritize urgent pathways.",
        icon: "heart",
        options: [
          { label: "During activity/walking", value: "activity-triggered", severityImpact: 25 },
          { label: "At rest too", value: "rest-and-activity", severityImpact: 28 },
          { label: "Only while coughing/moving", value: "movement-triggered", severityImpact: 10 },
          { label: "Not sure yet", value: "uncertain-pattern", severityImpact: 14 },
        ],
      }
    : lower.includes("breathing")
      ? {
          id: "breath-pattern",
          title: "How does the breathing issue feel right now?",
          subtitle: "A quick check for urgency markers.",
          icon: "pulse",
          options: [
            { label: "Mild but noticeable", value: "mild-breathless", severityImpact: 10 },
            { label: "Hard to speak full sentence", value: "sentence-limited", severityImpact: 30 },
            { label: "Worse while lying down", value: "worse-lying", severityImpact: 22 },
            { label: "Comes and goes", value: "intermittent", severityImpact: 14 },
          ],
        }
      : {
          id: "intensity",
          title: `How intense is your ${symptom.toLowerCase()} right now?`,
          subtitle: "Choose what feels closest.",
          icon: "pulse",
          options: [
            { label: "Mild, manageable", value: "mild", severityImpact: 8 },
            { label: "Moderate, affecting routine", value: "moderate", severityImpact: 16 },
            { label: "Severe, hard to focus", value: "severe", severityImpact: 26 },
            { label: "Very severe, need help now", value: "critical", severityImpact: 34 },
          ],
        }

  return [
    symptomSpecific,
    {
      id: "duration",
      title: "How long has this been happening?",
      subtitle: "Duration helps us match right doctor type.",
      icon: "clock",
      options: [
        { label: "Started today", value: "today", severityImpact: 6 },
        { label: "2 to 3 days", value: "2-3-days", severityImpact: 12 },
        { label: "About a week", value: "one-week", severityImpact: 18 },
        { label: "Recurring over weeks", value: "recurring", severityImpact: 24 },
      ],
    },
    {
      id: "history",
      title: "Any existing health condition connected to this?",
      subtitle: "Pick the closest context.",
      icon: "shield",
      options: [
        { label: "Diabetes / BP / Thyroid", value: "chronic-condition", severityImpact: 14 },
        { label: "Respiratory or heart history", value: "heart-lung-history", severityImpact: 18 },
        { label: "On current medication", value: "on-medication", severityImpact: 10 },
        { label: "No known history", value: "no-history", severityImpact: 4 },
      ],
    },
    {
      id: "extra",
      title: "Anything else you want doctor to know first?",
      subtitle: "We will pass this with your request.",
      icon: "heart",
      options: [
        { label: "Sleep / appetite disturbed", value: "sleep-appetite-affected", severityImpact: 8 },
        { label: "Work stress may be a trigger", value: "stress-trigger", severityImpact: 7 },
        { label: "Had similar episode before", value: "similar-episode", severityImpact: 11 },
        { label: "No additional notes", value: "no-extra-notes", severityImpact: 2 },
      ],
    },
  ]
}

function iconForQuestion(icon: SymptomQuestion["icon"]) {
  if (icon === "clock") return <FiClock />
  if (icon === "shield") return <FiShield />
  if (icon === "heart") return <FiHeart />
  return <FiZap />
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function AISymptomAnalyser() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [questions, setQuestions] = useState<SymptomQuestion[]>([])
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, OptionItem>>({})
  const [phase, setPhase] = useState<"pick" | "ask" | "analyzing">("pick")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const filteredSymptoms = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return symptomOptions
    return symptomOptions.filter((item) => item.toLowerCase().includes(q))
  }, [query])

  const currentQuestion = questions[stepIndex]

  function selectSymptom(symptom: string) {
    const nextQuestions = buildSymptomQuestions(symptom)
    setSelectedSymptom(symptom)
    setQuestions(nextQuestions)
    setAnswers({})
    setStepIndex(0)
    setPhase("ask")
  }

  function chooseOption(option: OptionItem) {
    if (!currentQuestion || isTransitioning) return
    setIsTransitioning(true)
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))

    window.setTimeout(() => {
      if (stepIndex >= questions.length - 1) {
        setPhase("analyzing")
      } else {
        setStepIndex((prev) => prev + 1)
      }
      setIsTransitioning(false)
    }, 280)
  }

  useEffect(() => {
    if (phase !== "analyzing" || !selectedSymptom) return

    const selected = Object.values(answers)
    const severityScore = clamp(30 + selected.reduce((sum, item) => sum + item.severityImpact, 0), 0, 100)
    const triageLevel = severityScore >= 75 ? "High" : severityScore >= 45 ? "Moderate" : "Low"
    const recommendedMode = severityScore >= 70 ? "opd" : "tele"
    const specialty = inferSpecialty(selectedSymptom)
    const analysisQuery = [selectedSymptom, ...selected.map((item) => item.label)].join(" | ")

    const timer = window.setTimeout(() => {
      navigate("/teleconsultation", {
        state: {
          fromAiAnalyser: true,
          preselectedSpecialty: specialty,
          selectedSymptoms: [selectedSymptom],
          analysisQuery,
          recommendedMode,
          triageLevel,
        },
      })
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [phase, selectedSymptom, answers, navigate])

  return (
    <main className="symptom-analyser-page app-page-enter">
      <header className="symptom-analyser-header app-fade-stagger">
        <button className="analyser-back app-pressable" onClick={() => goBackOrFallback(navigate)} type="button" aria-label="Back">
          <FiArrowLeft />
        </button>
        <div>
          <h1>AI Symptom Flow</h1>
          <p>Quick guided triage without scrolling forms</p>
        </div>
      </header>

      <section className="symptom-flow-body app-content-slide">
        {phase === "pick" && (
          <section className="flow-card app-fade-stagger">
            <div className="flow-card-head">
              <span className="flow-badge">Step 1</span>
              <h2>What are you feeling right now?</h2>
              <p>Select one symptom. AI will ask friendly follow-up questions automatically.</p>
            </div>

            <div className="analyser-search">
              <FiSearch />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search symptom" />
            </div>

            <div className="flow-option-grid symptom-grid">
              {filteredSymptoms.map((item) => (
                <button key={item} type="button" className="flow-option app-pressable" onClick={() => selectSymptom(item)}>
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "ask" && currentQuestion && (
          <section className="flow-card app-fade-stagger">
            <div className="flow-progress-row">
              <span>Question {stepIndex + 1} / {questions.length}</span>
              <i style={{ width: `${((stepIndex + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="ai-question">
              <span className="ai-question-icon">{iconForQuestion(currentQuestion.icon)}</span>
              <div>
                <h2>{currentQuestion.title}</h2>
                <p>{currentQuestion.subtitle}</p>
              </div>
            </div>

            <div className="flow-option-grid">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="flow-option app-pressable"
                  disabled={isTransitioning}
                  onClick={() => chooseOption(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {phase === "analyzing" && (
          <section className="flow-card app-fade-stagger analyzing-card" aria-live="polite">
            <span className="analyzing-spinner"><FiLoader /></span>
            <h2>Finding best available doctor...</h2>
            <p>Matching your answers with specialty, urgency and consultation mode.</p>
          </section>
        )}
      </section>
    </main>
  )
}
