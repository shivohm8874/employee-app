import { FiCamera } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import "../Settings/settings.css"

export default function ProfileInfo() {
  const navigate = useNavigate()

  return (
    <main className="account-page app-page-enter">
      <header className="account-header app-fade-stagger">
        <button className="account-back app-pressable" onClick={() => navigate(-1)} type="button" aria-label="Back">&lt;</button>
        <h1>Edit Profile</h1>
      </header>

      <section className="account-shell profile-edit-shell app-content-slide">
        <article className="edit-profile-card app-fade-stagger">
          <div className="profile-avatar-wrap editable">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=220&q=80"
              alt="Profile"
            />
            <button type="button" className="avatar-camera app-pressable" aria-label="Change profile photo">
              <FiCamera />
            </button>
          </div>

          <div className="profile-form-grid">
            <div>
              <label>Name</label>
              <input defaultValue="Shamim Hossain" />
            </div>
            <div>
              <label>Email Address</label>
              <input defaultValue="yourmail@gmail.com" />
            </div>
            <div>
              <label>Username</label>
              <input defaultValue="@ShamimGraphics" />
            </div>
            <div>
              <label>Password</label>
              <input defaultValue="*******" type="password" />
            </div>
            <div>
              <label>Birth Date</label>
              <input defaultValue="14.03.1999" />
            </div>
          </div>

          <p className="profile-joined">Joined 04 March 2022</p>
          <button type="button" className="logout-pill app-pressable" onClick={() => navigate("/login")}>Logout</button>
        </article>
      </section>
    </main>
  )
}
