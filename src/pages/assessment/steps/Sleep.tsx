import AssessmentLayout from "../layout"

type Props = {
  onNext: () => void
}

const sleepOptions = [
  {
    key: "<6",
    title: "Less than 6 hours",
    desc: "Short or disrupted sleep",
  },
  {
    key: "6-7",
    title: "6-7 hours",
    desc: "Fairly rested",
  },
  {
    key: "7-8",
    title: "7-8 hours",
    desc: "Well rested",
  },
  {
    key: ">8",
    title: "More than 8 hours",
    desc: "Long sleep duration",
  },
]

export default function Sleep({ onNext }: Props) {
  return (
    <AssessmentLayout step={7} totalSteps={7} showNext={false}>
      <div className="step-container animate-in">
        <h1>How long do you usually sleep?</h1>
        <p>Sleep affects focus, mood, and recovery</p>

        <div className="option-list">
          {sleepOptions.map((item) => (
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
