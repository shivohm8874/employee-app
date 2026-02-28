import { useState } from "react"
import AssessmentLayout from "../layout"

type Props = {
  onNext: () => void
}

export default function Height({ onNext }: Props) {
  const [height, setHeight] = useState(170)

  return (
    <AssessmentLayout
      step={2}
      totalSteps={7}
      onNext={onNext}
    >
      <div className="step-container animate-in">
        <h1>What’s your height?</h1>
        <p>This helps us understand your body composition</p>

        <div className="value-display">
          <span className="value">{height}</span>
          <span className="unit">cm</span>
        </div>

        <input
          type="range"
          min={120}
          max={220}
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="slider"
        />

        <p className="helper">
          You can adjust this anytime later
        </p>
      </div>
    </AssessmentLayout>
  )
}