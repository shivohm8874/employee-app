import { useMemo, useRef, useState } from "react"
import "./home.css"

type Tip = {
  title: string
  body: string
  tags: string[]
}

type QuickAccessItem = {
  title: string
  subtitle: string
  tone: "purple" | "blue" | "indigo" | "orange" | "green" | "gold"
  badge?: string
  icon: string
}

const tabs = ["Home", "Health", "AI Chat", "Stress Relief", "Wallet"] as const

const quickAccess: QuickAccessItem[] = [
  { title: "Stress Relief", subtitle: "Chat for emotional support", tone: "purple", badge: "New", icon: "brain" },
  { title: "Lab Tests", subtitle: "Free Slots", tone: "blue", icon: "test" },
  { title: "OPD / Tele...", subtitle: "Unlimited Co...", tone: "indigo", icon: "pin" },
  { title: "Weekend Tasks", subtitle: "Earn coins", tone: "orange", icon: "trophy" },
  { title: "Pharmacy", subtitle: "Order medicines", tone: "green", icon: "pill" },
  { title: "Badges", subtitle: "View your ranking", tone: "gold", badge: "#42", icon: "award" },
]

const feelings = [
  { id: "dizzy", title: "Feeling Dizzy", priority: "medium priority", tone: "light-blue", icon: "brain", level: "medium" },
  { id: "mental", title: "Mentally Disturbed", priority: "high priority", tone: "light-red", icon: "heart", level: "high" },
  { id: "sleep", title: "Last Night Is...", priority: "low priority", tone: "light-purple", icon: "moon", level: "low" },
  { id: "tension", title: "Physical Tension", priority: "medium priority", tone: "light-orange", icon: "bolt", level: "medium" },
  { id: "fever", title: "Running Feve", priority: "high priority", tone: "light-rose", icon: "thermo", level: "high" },
  { id: "fatigue", title: "Chronic Fatigue", priority: "medium priority", tone: "light-gray", icon: "pulse", level: "medium" },
] as const

const tips: Tip[] = [
  {
    title: "Stay Hydrated",
    body: "Drink at least 8 glasses of water daily to maintain optimal health",
    tags: ["Hydration", "All Day"],
  },
  {
    title: "Mindful Breathing",
    body: "Take 5 deep breaths every hour to reduce stress and improve focus",
    tags: ["Stress", "Breathing"],
  },
  {
    title: "Quick Stretch",
    body: "Stand and stretch your shoulders for 2 minutes to ease muscle tension",
    tags: ["Mobility", "Desk Work"],
  },
  {
    title: "Healthy Snacks",
    body: "Choose protein-rich snacks to sustain energy through the afternoon",
    tags: ["Nutrition", "Workday"],
  },
  {
    title: "Sleep Routine",
    body: "Keep a fixed bedtime to improve recovery and next-day concentration",
    tags: ["Recovery", "Night"],
  },
]

const metrics = [
  { title: "Heart Rate", value: "72", unit: "bpm", status: "normal", age: "2 hours ago", tone: "red", icon: "heart" },
  { title: "Blood Pressure", value: "120/80", unit: "mmHg", status: "normal", age: "4 hours ago", tone: "blue", icon: "pulse" },
  { title: "Body Temperatu", value: "98.6", unit: "F", status: "normal", age: "6 hours ago", tone: "orange", icon: "thermo" },
  { title: "Weight", value: "165", unit: "lbs", status: "normal", age: "1 day ago", tone: "green", icon: "scale" },
] as const

function Icon({ name }: { name: string }) {
  switch (name) {
    case "heart":
      return <span className="ico">o</span>
    case "brain":
      return <span className="ico">*</span>
    case "test":
      return <span className="ico">T</span>
    case "pin":
      return <span className="ico">P</span>
    case "trophy":
      return <span className="ico">W</span>
    case "pill":
      return <span className="ico">M</span>
    case "award":
      return <span className="ico">A</span>
    case "moon":
      return <span className="ico">N</span>
    case "bolt":
      return <span className="ico">Z</span>
    case "thermo":
      return <span className="ico">D</span>
    case "pulse":
      return <span className="ico">V</span>
    case "scale":
      return <span className="ico">S</span>
    default:
      return <span className="ico">.</span>
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Home")
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([])
  const [tipIndex, setTipIndex] = useState(0)
  const [message, setMessage] = useState("")
  const [lastAction, setLastAction] = useState("Ready")
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const [fileAccept, setFileAccept] = useState("image/*,.pdf")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentTip = tips[tipIndex]
  const score = useMemo(() => 92 + Math.min(selectedFeelings.length, 6), [selectedFeelings.length])

  function toggleFeeling(id: string) {
    setSelectedFeelings((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  function nextTip() {
    setTipIndex((prev) => (prev + 1) % tips.length)
  }

  function prevTip() {
    setTipIndex((prev) => (prev - 1 + tips.length) % tips.length)
  }

  function sendMessage() {
    if (!message.trim()) {
      setLastAction("Type something to send")
      return
    }
    setLastAction(`Sent: ${message.trim()}`)
    setMessage("")
  }

  function chooseAttachment(kind: "image" | "pdf") {
    const accept = kind === "image" ? "image/*" : ".pdf,application/pdf"
    setFileAccept(accept)
    setShowAttachMenu(false)
    fileInputRef.current?.click()
  }

  function onAttachmentSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }
    const picked = Array.from(files).map((file) => file.name).join(", ")
    setLastAction(`Attached: ${picked}`)
    e.target.value = ""
  }

  return (
    <main className="home-page">
      <section className="home-shell">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <Icon name="heart" />
            </div>
            <div>
              <h1>HCLTech</h1>
              <p>Health Companion</p>
            </div>
          </div>
          <button className="icon-btn" aria-label="menu">Menu</button>
          <button className="sos-btn">SOS</button>
          <button className="icon-btn" aria-label="notifications">Bell</button>
          <button className="icon-btn" aria-label="profile">You</button>
        </header>

        <nav className="tabbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        <section className="doctor-card">
          <div className="avatar">DR</div>
          <div className="doctor-copy">
            <h2>Dr. Riza Yuji</h2>
            <p>Internal Medicine</p>
            <div className="doctor-meta">
              <span className="online-dot" />
              <span>4.9</span>
              <span className="pill">Available now</span>
            </div>
          </div>
          <div className="doctor-actions">
            <button aria-label="call">Call</button>
            <button aria-label="video">Video</button>
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">Quick Access</h3>
          <div className="quick-grid">
            {quickAccess.map((item) => (
              <button
                key={item.title}
                className={`quick-card ${item.tone}`}
                onClick={() => setLastAction(`${item.title} opened`)}
              >
                {item.badge && <span className="badge">{item.badge}</span>}
                <span className="quick-icon">
                  <Icon name={item.icon} />
                </span>
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">How are you feeling today?</h3>
          <p className="section-sub">Select your symptoms for AI analysis</p>
          <div className="feeling-grid">
            {feelings.map((item) => (
              <button
                key={item.id}
                className={`feeling-card ${item.tone} ${selectedFeelings.includes(item.id) ? "selected" : ""}`}
                onClick={() => toggleFeeling(item.id)}
              >
                <span className="feeling-icon">
                  <Icon name={item.icon} />
                </span>
                <h4>{item.title}</h4>
                <span className={`priority ${item.level}`}>{item.priority}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="section">
          <h3 className="section-title">Daily Health Tips</h3>
          <article className="tip-card">
            <button className="tip-arrow left" onClick={prevTip} aria-label="previous tip">&lt;</button>
            <button className="tip-arrow right" onClick={nextTip} aria-label="next tip">&gt;</button>
            <div className="tip-header">
              <div className="tip-title-icon">
                <span className="tip-big-icon">
                  <Icon name="pin" />
                </span>
                <div>
                  <h4>{currentTip.title}</h4>
                  <div className="tip-tags">
                    {currentTip.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <span className="tip-step">
                {tipIndex + 1} of {tips.length}
              </span>
            </div>
            <p>{currentTip.body}</p>
            <div className="slider-dots">
              {tips.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${tipIndex === index ? "active" : ""}`}
                  onClick={() => setTipIndex(index)}
                  aria-label={`tip ${index + 1}`}
                />
              ))}
            </div>
          </article>
        </section>

        <section className="section">
          <h3 className="section-title">Health Metrics</h3>
          <p className="section-sub">Track your vital signs and health data</p>
          <div className="metric-grid">
            {metrics.map((item) => (
              <button
                key={item.title}
                className={`metric-card ${item.tone}`}
                onClick={() => setLastAction(`${item.title} details viewed`)}
              >
                <div className="metric-top">
                  <span className="metric-icon">
                    <Icon name={item.icon} />
                  </span>
                  <span className="status">{item.status}</span>
                </div>
                <p className="metric-value">
                  {item.value} <span>{item.unit}</span>
                </p>
                <h4>{item.title}</h4>
                <p className="metric-age">{item.age}</p>
                <div className="metric-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="score-card">
          <div>
            <h3>Health Score</h3>
            <p className="score">{score}/100</p>
            <p>Excellent health indicators. Keep up the good work!</p>
            <small>{lastAction}</small>
          </div>
          <div className="score-icon">
            <Icon name="heart" />
          </div>
        </section>
      </section>

      <footer className="composer">
        <button
          className="round-btn"
          aria-label="attach files"
          onClick={() => setShowAttachMenu(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16.5 6.5v9a4.5 4.5 0 1 1-9 0v-10a3 3 0 1 1 6 0v9a1.5 1.5 0 1 1-3 0V7.5" />
          </svg>
        </button>

        <input
          type="text"
          placeholder="write something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage()
            }
          }}
        />

        <button className="send-btn" aria-label="send message" onClick={sendMessage}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 11.5L21 3l-8.5 18-2.3-6.7L3 11.5z" />
          </svg>
        </button>
      </footer>

      <input
        ref={fileInputRef}
        className="hidden-file-input"
        type="file"
        accept={fileAccept}
        onChange={onAttachmentSelected}
      />

      {showAttachMenu && (
        <div className="attach-overlay" onClick={() => setShowAttachMenu(false)}>
          <div className="attach-sheet" onClick={(e) => e.stopPropagation()}>
            <h4>Add attachment</h4>
            <button onClick={() => chooseAttachment("image")}>Image</button>
            <button onClick={() => chooseAttachment("pdf")}>PDF</button>
            <button className="cancel" onClick={() => setShowAttachMenu(false)}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  )
}
