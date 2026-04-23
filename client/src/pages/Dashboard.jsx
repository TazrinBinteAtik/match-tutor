import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);
    fetch(`${API_URL}/bookings`)
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setBookings([]); setLoading(false); });
  }, []);

  const handleAction = async (id, action) => {
    const res = await fetch(`${API_URL}/bookings/${id}/${action}`, { method: "PATCH" });
    const data = await res.json();
    if (res.ok) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: action === "accept" ? "accepted" : "rejected" } : b));
    }
  };

  if (!user) return null;

  const isTutor = user.role === "tutor";
  const myBookings = isTutor ? bookings : bookings.filter(b => b.email === user.email);
  const pending  = myBookings.filter(b => b.status === "pending");
  const accepted = myBookings.filter(b => b.status === "accepted");
  const rejected = myBookings.filter(b => b.status === "rejected");

  const avatar = (name) => (
    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#E1F0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "#1A2E44", fontWeight: 700, flexShrink: 0 }}>
      {name ? name[0].toUpperCase() : "?"}
    </div>
  );

  return (
    <div style={{ display: "flex", fontFamily: "DM Sans, sans-serif", minHeight: "100vh" }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: "200px", background: "#1A2E44", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh" }}>
        <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#fff", fontWeight: 600 }}>Match<span style={{ color: "#7DC9A8", fontStyle: "italic", fontWeight: 400 }}>Tutor</span></div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "3px" }}>Find your perfect tutor</div>
        </div>

        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#2E4A66", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#fff", fontWeight: 700 }}>
            {user.firstName ? user.firstName[0].toUpperCase() : "?"}
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{isTutor ? "Tutor Panel" : `${user.firstName}`}</div>
            <div style={{ fontSize: "10px", color: "#7DC9A8" }}>{isTutor ? "Admin View" : "Student View"}</div>
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <div style={{ padding: "11px 20px", fontSize: "13px", color: "#fff", background: "rgba(255,255,255,0.1)", borderLeft: "3px solid #7DC9A8", cursor: "pointer" }}>📊 Dashboard</div>
          <div style={{ padding: "11px 20px", fontSize: "13px", color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>📋 Bookings</div>
          {isTutor && <div style={{ padding: "11px 20px", fontSize: "13px", color: "rgba(255,255,255,0.55)", cursor: "pointer" }}>👥 Tutors</div>}
        </div>

        <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div onClick={() => navigate("/")} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", cursor: "pointer", marginBottom: "10px" }}>🏠 Back to website</div>
          <div onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>🚪 Logout</div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: "200px", flex: 1, padding: "36px 40px", background: "#F7F4EF" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: "#1A2E44", fontWeight: 700, margin: 0 }}>
            {isTutor ? "Tutor Dashboard" : "My Bookings"}
          </h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "5px" }}>
            {isTutor ? "Manage student booking requests" : `Welcome, ${user.firstName}! Track your booking requests below.`}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "36px" }}>
          {[
            { label: "Pending Bookings",  count: pending.length,  color: "#EF9F27", icon: "📬" },
            { label: "Accepted Bookings", count: accepted.length, color: "#1D9E75", icon: "✅" },
            { label: "Rejected Bookings", count: rejected.length, color: "#E24B4A", icon: "❌" },
          ].map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "14px", padding: "22px 24px" }}>
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: "12px", color: "#999", marginBottom: "6px" }}>{s.label}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: s.color, fontWeight: 700, lineHeight: 1 }}>{s.count}</div>
            </div>
          ))}
        </div>

        {/* Pending */}
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1A2E44", fontWeight: 600 }}>Pending Requests</span>
          {pending.length > 0 && (
            <span style={{ background: "#EF9F27", color: "#fff", fontSize: "11px", padding: "2px 9px", borderRadius: "20px", fontWeight: 600 }}>{pending.length}</span>
          )}
        </div>
        <div style={{ marginBottom: "36px" }}>
          {loading ? (
            <p style={{ color: "#aaa" }}>Loading...</p>
          ) : pending.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "28px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>No pending bookings</div>
          ) : pending.map(b => (
            <div key={b._id} style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "16px 20px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "14px" }}>
              {avatar(b.studentName)}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                  {b.email}{b.subject ? ` · ${b.subject}` : ""}{b.tutorName ? ` · ${b.tutorName}` : ""}
                </div>
                {b.message && <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontStyle: "italic" }}>"{b.message}"</div>}
              </div>
              {/* ✅ ONLY TUTORS see Accept/Reject */}
              {isTutor ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleAction(b._id, "accept")} style={{ padding: "9px 20px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Accept</button>
                  <button onClick={() => handleAction(b._id, "reject")} style={{ padding: "9px 20px", background: "#E24B4A", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Reject</button>
                </div>
              ) : (
                <span style={{ background: "#FFF8E7", color: "#EF9F27", fontSize: "11px", padding: "4px 12px", borderRadius: "20px", fontWeight: 500 }}>Pending</span>
              )}
            </div>
          ))}
        </div>

        {/* Accepted */}
        {accepted.length > 0 && (
          <div style={{ marginBottom: "36px" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1A2E44", fontWeight: 600, marginBottom: "14px" }}>Accepted Bookings</div>
            {accepted.map(b => (
              <div key={b._id} style={{ background: "#fff", border: "1px solid #A8E6CF", borderRadius: "12px", padding: "14px 20px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{b.email}{b.subject ? ` · ${b.subject}` : ""}</div>
                </div>
                <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: "11px", padding: "4px 12px", borderRadius: "20px", fontWeight: 500 }}>Accepted</span>
              </div>
            ))}
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#1A2E44", fontWeight: 600, marginBottom: "14px" }}>Rejected Bookings</div>
            {rejected.map(b => (
              <div key={b._id} style={{ background: "#fff", border: "1px solid #F5C6C6", borderRadius: "12px", padding: "14px 20px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FDECEA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>❌</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{b.email}{b.subject ? ` · ${b.subject}` : ""}</div>
                </div>
                <span style={{ background: "#FDECEA", color: "#C0392B", fontSize: "11px", padding: "4px 12px", borderRadius: "20px", fontWeight: 500 }}>Rejected</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}