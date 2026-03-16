import { useEffect, useMemo, useState } from "react"
import { FiArrowLeft, FiClock, FiLink, FiTarget } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { goBackOrFallback } from "../../utils/navigation"
import { getEmployeeAuthSession } from "../../services/authApi"
import { completeWeekendChallenge, fetchWeekendChallenges, type WeekendChallenge } from "../../services/challengesApi"
import "./weekendtasks.css"

type Task = {
  id: string
  title: string
  desc: string
  coins: number
  level: "Easy" | "Medium" | "Hard"
  type: "Physical" | "Mental" | "Health" | "Lifestyle"
  duration: string
  done?: boolean
}

export default function WeekendTasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [weekStart, setWeekStart] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const session = getEmployeeAuthSession()

  const completed = useMemo(() => tasks.filter((task) => task.done).length, [tasks])
  const earned = useMemo(() => tasks.filter((task) => task.done).reduce((sum, task) => sum + task.coins, 0), [tasks])
  const remaining = useMemo(() => tasks.filter((task) => !task.done).reduce((sum, task) => sum + task.coins, 0), [tasks])

  useEffect(() => {
    let active = true
    if (!session?.userId) {
      setLoading(false)
      setError("Employee session missing. Please login again.")
      return
    }

    async function loadChallenges() {
      setLoading(true)
      setError("")
      try {
        const data = await fetchWeekendChallenges(session.userId)
        if (!active) return
        setWeekStart(data.weekStart)
        const mapped = data.challenges.map((item: WeekendChallenge) => ({
          id: item.id,
          title: item.title,
          desc: item.description,
          coins: item.points,
          level: item.difficulty,
          type: item.category,
          duration: item.duration,
          done: item.completed,
        }))
        setTasks(mapped)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : "Unable to load challenges")
      } finally {
        if (active) setLoading(false)
      }
    }

    loadChallenges()
    const interval = window.setInterval(loadChallenges, 30000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [session?.userId])

  async function toggleTask(id: string) {
    if (!session?.userId) return
    const target = tasks.find((task) => task.id === id)
    if (!target || target.done) return
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: true } : task)))
    try {
      await completeWeekendChallenge(session.userId, id)
    } catch {
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: false } : task)))
    }
  }

  return (
    <main className="weekend-page app-page-enter">
      <header className="weekend-header app-fade-stagger">
        <button className="weekend-back app-pressable" type="button" onClick={() => goBackOrFallback(navigate)} aria-label="Back">
          <FiArrowLeft />
        </button>
        <div className="weekend-title">
          <h1>Weekend Challenges</h1>
          <p>Complete tasks, earn coins, stay healthy</p>
        </div>
      </header>

      <section className="weekend-content app-content-slide">
        <article className="progress-card app-fade-stagger">
          <div className="progress-head">
            <div className="progress-icon"><FiTarget /></div>
            <div>
              <p>Weekend Progress</p>
              <h2>{completed} / {tasks.length} Tasks</h2>
            </div>
            <span className="trophy">Trophy</span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%` }} />
          </div>

          <div className="progress-metrics">
            <article><span>Earned</span><strong>{earned}</strong></article>
            <article><span>Remaining</span><strong>{remaining}</strong></article>
            <article><span>Week</span><strong>{weekStart || "This week"}</strong></article>
          </div>
        </article>

        <section className="tasks-list app-fade-stagger">
          <h3>Your Tasks</h3>
          {loading && <p>Loading weekend challenges...</p>}
          {error && !loading && <p>{error}</p>}
          {tasks.map((task) => (
            <button
              key={task.id}
              className={`task-card app-pressable ${task.done ? "done" : ""}`}
              type="button"
              onClick={() => toggleTask(task.id)}
            >
              <span className={`task-check ${task.done ? "active" : ""}`}>{task.done ? "Done" : ""}</span>
              <div className="task-main">
                <div className="task-title">
                  <h4>{task.title}</h4>
                  <strong><FiLink /> +{task.coins}</strong>
                </div>
                <p>{task.desc}</p>
                <div className="task-tags">
                  <span className={`lvl ${task.level.toLowerCase()}`}>{task.level}</span>
                  <span className={`kind ${task.type.toLowerCase()}`}>{task.type}</span>
                  <span className="time"><FiClock /> {task.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </section>

        <article className="bonus-card app-fade-stagger">
          <h4>Weekend Bonus Challenge</h4>
          <p>Complete all {tasks.length} tasks this weekend to earn a special bonus.</p>
          <div className="bonus-tags">
            <span>+1000 Bonus Coins</span>
            <span>Limited Time</span>
          </div>
          <i>Trophy</i>
        </article>
      </section>
    </main>
  )
}
