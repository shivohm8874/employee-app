import { FiChevronRight, FiCreditCard, FiInfo, FiLogOut, FiSettings, FiUser, FiUsers } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import "./settings.css"

const primaryItems = [
  { title: "Settings", to: "/account-settings", icon: <FiSettings /> },
  { title: "Billing Details", to: "/wallet", icon: <FiCreditCard /> },
  { title: "User Management", to: "/profile-info", icon: <FiUsers /> },
]

const secondaryItems = [
  { title: "Information", to: "/reports", icon: <FiInfo /> },
  { title: "Log out", to: "/login", icon: <FiLogOut /> },
]

export default function Settings() {
  const navigate = useNavigate()

  return (
    <main className="account-page app-page-enter">
      <header className="account-header app-fade-stagger">
        <button className="account-back app-pressable" onClick={() => navigate(-1)} type="button" aria-label="Back">&lt;</button>
        <h1>Profile</h1>
      </header>

      <section className="account-shell profile-shell app-content-slide">
        <article className="profile-hero app-fade-stagger">
          <div className="profile-avatar-wrap">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80"
              alt="Profile"
            />
          </div>
          <h2>Shamim Hossain</h2>
          <p>@ShamimGraphics</p>
          <button className="profile-cta app-pressable" type="button" onClick={() => navigate("/profile-info")}>
            <FiUser /> Edit Profile
          </button>
        </article>

        <section className="profile-section app-fade-stagger">
          {primaryItems.map((item) => (
            <button key={item.title} className="profile-item app-pressable" onClick={() => navigate(item.to)} type="button">
              <span className="profile-item-left">
                <span className="profile-item-icon">{item.icon}</span>
                <span>{item.title}</span>
              </span>
              <FiChevronRight />
            </button>
          ))}
        </section>

        <section className="profile-section app-fade-stagger">
          {secondaryItems.map((item) => (
            <button key={item.title} className="profile-item app-pressable" onClick={() => navigate(item.to)} type="button">
              <span className="profile-item-left">
                <span className="profile-item-icon">{item.icon}</span>
                <span>{item.title}</span>
              </span>
              <FiChevronRight />
            </button>
          ))}
        </section>
      </section>
    </main>
  )
}
