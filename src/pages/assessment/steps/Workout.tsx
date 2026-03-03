import AssessmentLayout from "../layout"

type Props = {
  onNext: () => void
}

const workouts = [
  {
    key: "never",
    title: "Rarely",
    desc: "I don't work out regularly",
  },
  {
    key: "sometimes",
    title: "1-2 days / week",
    desc: "Light or occasional workouts",
  },
  {
    key: "often",
    title: "3-5 days / week",
    desc: "Regular workouts",
  },
  {
    key: "daily",
    title: "Daily",
    desc: "Almost every day",
  },
]

export default function Workout({ onNext }: Props) {
  return (
    <AssessmentLayout step={6} totalSteps={7} showNext={false}>
      <div className="step-container animate-in">
        <h1>How often do you work out?</h1>
        <p>Even light movement counts</p>

        <div className="option-list">
          {workouts.map((item) => (
            <div key={item.key} className="option-card" onClick={onNext}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AssessmentLayout>
  )
}
