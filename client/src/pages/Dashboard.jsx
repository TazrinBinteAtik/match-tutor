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
      alert(data.message);
    }
  };

  if (!user) return null;

  const isTutor = user.role === "tutor";
  const myBookings = isTutor ? bookings : bookings.filter(b => b.email === user.email);
  const pending = myBookings.filter(b => b.status === "pending");
  const accepted = myBookings.filter(b => b.status === "accepted");
  const rejected = myBookings.filter(b => b.status === "rejected");

  return (
    <div style={{ display: "flex", fontFamily: "DM Sans, sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{ width: "220px", background: "#1A2E44", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#fff", padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          Match<span style={{ color: "#7DC9A8", fontStyle: "italic", fontWeight: 400 }}>Tutor</span>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>Find your perfect tutor</div>
        </div>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>{user.firstName} {user.lastName}</div>
          <div style={{ fontSize: "11px", color: "#7DC9A8", marginTop: "2px", textTransform: "capitalize" }}>{user.role}</div>
        </div>
        <div style={{ padding: "10px 24px", fontSize: "13px", color: "#fff", borderLeft: "2px solid #7DC9A8", background: "rgba(255,255,255,0.07)" }}>📊 Dashboard</div>
        <div style={{ padding: "10px 24px", fontSize: "13px", color: "rgba(255,255,255,0.5)", cursor: "pointer" }} onClick={() => navigate("/")}>🏠 Back to website</div>
        <div
          style={{ marginTop: "auto", padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)", fontSize: "12px", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
          onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}
        >
          🚪 Logout
        </div>
      </div>

      {/* MAIN */}
      <div style={{ marginLeft: "220px", flex: 1, padding: "36px 40px", background: "#F7F4EF", minHeight: "100vh" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#1A2E44", fontWeight: 600 }}>
            {isTutor ? "Tutor Dashboard" : "My Bookings"}
          </h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
            Welcome back, {user.firstName}! {isTutor ? "Manage student booking requests below." : "Track your booking requests below."}
          </p>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>📬</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Pending</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#EF9F27", fontWeight: 600 }}>{pending.length}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Accepted</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1D9E75", fontWeight: 600 }}>{accepted.length}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>❌</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Rejected</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#E24B4A", fontWeight: 600 }}>{rejected.length}</div>
          </div>
        </div>

        {/* PENDING */}
        <div style={{ marginBottom: "8px", fontFamily: "Georgia, serif", fontSize: "18px", color: "#1A2E44" }}>
          Pending Requests
          {pending.length > 0 && <span style={{ background: "#EF9F27", color: "#fff", fontSize: "12px", padding: "2px 8px", borderRadius: "20px", marginLeft: "8px" }}>{pending.length}</span>}
        </div>
        <div style={{ marginBottom: "32px" }}>
          {loading ? (
            <p style={{ color: "#888" }}>Loading...</p>
          ) : pending.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "30px", textAlign: "center", color: "#888" }}>No pending bookings yet</div>
          ) : pending.map(b => (
            <div key={b._id} style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "18px 20px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>👤</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{b.email} · {b.subject}{b.tutorName ? " · " + b.tutorName : ""}</div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontStyle: "italic" }}>"{b.message}"</div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>{new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              {isTutor && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => handleAction(b._id, "accept")} style={{ padding: "8px 16px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Accept</button>
                  <button onClick={() => handleAction(b._id, "reject")} style={{ padding: "8px 16px", background: "#E24B4A", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Reject</button>
                </div>
              )}
              {!isTutor && (
                <span style={{ background: "#FFF8E7", color: "#EF9F27", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>Pending</span>
              )}
            </div>
          ))}
        </div>

        {/* ACCEPTED */}
        {accepted.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ marginBottom: "16px", fontFamily: "Georgia, serif", fontSize: "18px", color: "#1A2E44" }}>Accepted Bookings</div>
            {accepted.map(b => (
              <div key={b._id} style={{ background: "#fff", border: "1px solid #A8E6CF", borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px" }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{b.email} · {b.subject}{b.tutorName ? " · " + b.tutorName : ""}</div>
                  <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>{new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>Accepted</span>
              </div>
            ))}
          </div>
        )}

        {/* REJECTED */}
        {rejected.length > 0 && (
          <div>
            <div style={{ marginBottom: "16px", fontFamily: "Georgia, serif", fontSize: "18px", color: "#1A2E44" }}>Rejected Bookings</div>
            {rejected.map(b => (
              <div key={b._id} style={{ background: "#fff", border: "1px solid #F5C6C6", borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px" }}>❌</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{b.email} · {b.subject}{b.tutorName ? " · " + b.tutorName : ""}</div>
                  <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>{new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <span style={{ background: "#FDECEA", color: "#C0392B", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>Rejected</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}