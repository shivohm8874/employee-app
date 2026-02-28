import AssessmentLayout from "../layout"

type Props = {
  onNext: () => void
}

const activityOptions = [
  {
    key: "desk",
    title: "Mostly desk work",
    desc: "Sitting for most of the day",
  },
  {
    key: "mixed",
    title: "Mixed activity",
    desc: "Some walking and some desk work",
  },
  {
    key: "active",
    title: "Physically active",
    desc: "Standing, walking, or moving often",
  },
]

export default function Activity({ onNext }: Props) {
  return (
    <AssessmentLayout step={5} totalSteps={7} showNext={false}>
      <div className="step-container animate-in">
        <h1>How active is your day?</h1>
        <p>This helps us estimate your daily energy and recovery needs</p>

        <div className="option-list">
          {activityOptions.map((item) => (
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
