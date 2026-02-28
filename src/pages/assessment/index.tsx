import { useState } from "react"
import Welcome from "./steps/Welcome"
import Height from "./steps/Height"
import Weight from "./steps/Weight"

const TOTAL_STEPS = 7

export default function HealthAssessment() {
  const [step, setStep] = useState(0)

  function nextStep() {
    setStep((s) => s + 1)
  }

  switch (step) {
    case 0:
      return <Welcome onNext={nextStep} />
    case 1:
      return <Height onNext={nextStep} />
    case 2:
      return <Weight onNext={nextStep} />
    default:
      return <div>Next steps coming…</div>
  }
}