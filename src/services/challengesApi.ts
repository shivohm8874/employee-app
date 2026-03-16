import { apiGet, apiPost } from "./api"

export type WeekendChallenge = {
  id: string
  slug: string
  title: string
  description: string
  points: number
  category: "Physical" | "Mental" | "Health" | "Lifestyle"
  difficulty: "Easy" | "Medium" | "Hard"
  duration: string
  completed: boolean
}

export async function fetchWeekendChallenges(employeeId: string) {
  return apiGet<{ weekStart: string; challenges: WeekendChallenge[] }>(
    `/challenges/weekend?employeeId=${encodeURIComponent(employeeId)}`
  )
}

export async function completeWeekendChallenge(employeeId: string, challengeId: string) {
  return apiPost<{ weekStart: string; challengeId: string }, { employeeId: string; challengeId: string }>(
    "/challenges/weekend/complete",
    { employeeId, challengeId }
  )
}
