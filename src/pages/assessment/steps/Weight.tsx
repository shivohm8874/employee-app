import { useState } from "react"
import AssessmentLayout from "../layout"

type Props = {
  onNext: () => void
}

export default function Weight({ onNext }: Props) {
  const [weight, setWeight] = useState(70)

  return (
    <AssessmentLayout
      step={3}
      totalSteps={7}
      onNext={onNext}
    >
      <div className="step-container animate-in">
        <h1>What’s your weight?</h1>
        <p>This helps us calculate your health baseline</p>

        <div className="value-display">
          <span className="value">{weight}</span>
          <span className="unit">kg</span>
        </div>

        <input
          type="range"
          min={35}
          max={180}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="slider"
        />

        <p className="helper">
          This is only used for personalised insights
        </p>
      </div>
    </AssessmentLayout>
  )
}