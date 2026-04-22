import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const stored = localStorage.getItem("matchtutor_user");
    if (!stored) { navigate("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    fetch(`${API_URL}/bookings`)
      .then(r => r.json())
      .then(data => {
        const mine = data.filter(b => b.email === parsed.email);
        setBookings(mine);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("matchtutor_user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: "220px", background: "#1A2E44", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#fff", padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          Match<span style={{ color: "#7DC9A8", fontStyle: "italic", fontWeight: 400 }}>Tutor</span>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.8px", marginTop: "2px" }}>Find your perfect tutor</div>
        </div>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(125,201,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#7DC9A8", fontWeight: 600 }}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
            <div style={{ fontSize: "11px", color: "#7DC9A8" }}>Student</div>
          </div>
        </div>
        {[["▦", "My Bookings", true], ["◎", "Find Tutors", false]].map(([ic, label, active]) => (
          <div key={label} onClick={() => label === "Find Tutors" && navigate("/")} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 24px", fontSize: "13px", color: active ? "#fff" : "rgba(255,255,255,0.5)", borderLeft: active ? "2px solid #7DC9A8" : "2px solid transparent", background: active ? "rgba(255,255,255,0.07)" : "transparent", cursor: "pointer" }}>
            <span>{ic}</span>{label}
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <a href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>← Back to website</a>
          <button onClick={handleLogout} style={{ fontSize: "12px", color: "#E24B4A", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>Logout</button>
        </div>
      </div>

      <div style={{ marginLeft: "220px", flex: 1, padding: "36px 40px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#1A2E44", fontWeight: 600 }}>Welcome, {user.firstName}! 👋</h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>View your booking requests and their status</p>
        </div>

        <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: "#1A2E44", marginBottom: "16px" }}>My Booking Requests</div>

        {bookings.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📚</div>
            <div style={{ color: "#888", marginBottom: "16px" }}>You haven't made any bookings yet</div>
            <button onClick={() => navigate("/#book")} style={{ padding: "10px 24px", background: "#1A2E44", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}>Book a Tutor →</button>
          </div>
        ) : bookings.map(b => (
          <div key={b._id} style={{ background: "#fff", border: `1px solid ${b.status === 'accepted' ? '#A8E6CF' : b.status === 'rejected' ? '#F5C6C6' : '#EDE9E2'}`, borderRadius: "12px", padding: "18px 20px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: b.status === 'accepted' ? '#E1F5EE' : b.status === 'rejected' ? '#FDECEA' : '#F7F4EF', display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              {b.status === 'accepted' ? '✅' : b.status === 'rejected' ? '❌' : '⏳'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>Booking for {b.subject}</div>
              {b.tutorName && <div style={{ fontSize: "12px", color: "#7DC9A8", marginTop: "2px" }}>Tutor: {b.tutorName}</div>}
              <div style={{ fontSize: "12px", color: "#888", marginTop: "2px", fontStyle: "italic" }}>"{b.message}"</div>
            </div>
            <span style={{
              padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
              background: b.status === 'accepted' ? '#E1F5EE' : b.status === 'rejected' ? '#FDECEA' : '#FEF3E2',
              color: b.status === 'accepted' ? '#0F6E56' : b.status === 'rejected' ? '#C0392B' : '#854F0B'
            }}>
              {b.status === 'accepted' ? 'Accepted' : b.status === 'rejected' ? 'Rejected' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}