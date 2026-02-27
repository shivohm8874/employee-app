import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./login.css"

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ui-icon">
      <path d="M3 6h18v12H3V6zm1 1 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ui-icon">
      <path d="M7 10V7a5 5 0 0 1 10 0v3M6 10h12v10H6V10z" />
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ui-icon eye-icon">
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2" />
      {!open && <path d="M4 20 20 4" />}
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit() {
    if (!email || !password) {
      setError("Please enter email and password")
      return
    }

    setError("")
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate("/home")
    }, 1500)
  }

  return (
    <div className="login-screen app-page-enter">
      <div className="brand app-fade-stagger">
        <h1>HCLTech</h1>
        <p>Your Health Companion</p>
      </div>

      <div className="login-card animate-in app-fade-stagger">
        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Sign in to continue your health journey</p>

        <label>Email Address</label>
        <div className="input-wrapper">
          <span className="icon"><MailIcon /></span>
          <input
            type="email"
            placeholder="Enter your work email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <label>Password</label>
        <div className="input-wrapper">
          <span className="icon"><LockIcon /></span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button className="eye app-pressable" onClick={() => setShowPassword(!showPassword)} aria-label="toggle password">
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          className={`signin-btn app-pressable ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="loader"></span> : "Sign In ->"}
        </button>

        <p
          className="forgot"
          onClick={() => navigate("/forgot")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              navigate("/forgot")
            }
          }}
          role="button"
          tabIndex={0}
        >
          Forgot password?
        </p>
      </div>

      <p className="terms">
        By signing in, you agree to our <span>Terms</span> and <span>Privacy Policy</span>
      </p>
    </div>
  )
}
