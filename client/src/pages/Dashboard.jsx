import { useEffect, useState } from "react";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/bookings`)
      .then(r => r.json())
      .then(data => { setBookings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    const res = await fetch(`${API_URL}/bookings/${id}/${action}`, { method: "PATCH" });
    const data = await res.json();
    if (res.ok) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: action === "accept" ? "accepted" : "rejected" } : b));
      alert(data.message);
    }
  };

  const pending = bookings.filter(b => b.status === "pending");
  const accepted = bookings.filter(b => b.status === "accepted");
  const rejected = bookings.filter(b => b.status === "rejected");

  return (
    <div style={{ fontFamily: "DM Sans, sans-serif", background: "#F7F4EF", minHeight: "100vh", display: "flex" }}>

      <div style={{ width: "220px", background: "#1A2E44", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#fff", padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          MatchTutor
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>Find your perfect tutor</div>
        </div>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "rgba(125,201,168,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#7DC9A8", fontWeight: 600 }}>T</div>
          <div>
            <div style={{ fontSize: "13px", color: "#fff", fontWeight: 500 }}>Tutor Panel</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Admin View</div>
          </div>
        </div>
        <div style={{ padding: "10px 24px", fontSize: "13px", color: "#fff", borderLeft: "2px solid #7DC9A8", background: "rgba(255,255,255,0.07)", cursor: "pointer" }}>Dashboard</div>
        <div style={{ padding: "10px 24px", fontSize: "13px", color: "rgba(255,255,255,0.5)", borderLeft: "2px solid transparent", cursor: "pointer" }}>Bookings</div>
        <div style={{ padding: "10px 24px", fontSize: "13px", color: "rgba(255,255,255,0.5)", borderLeft: "2px solid transparent", cursor: "pointer" }}>Tutors</div>
        <div style={{ marginTop: "auto", padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Back to website</a>
        </div>
      </div>

      <div style={{ marginLeft: "220px", flex: 1, padding: "36px 40px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#1A2E44", fontWeight: 600 }}>Tutor Dashboard</h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Manage student booking requests</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>📬</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Pending Bookings</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#EF9F27", fontWeight: 600 }}>{pending.length}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>✅</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Accepted Bookings</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#1D9E75", fontWeight: 600 }}>{accepted.length}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #EDE9E2", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "20px", marginBottom: "8px" }}>❌</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Rejected Bookings</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#E24B4A", fontWeight: 600 }}>{rejected.length}</div>
          </div>
        </div>

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
                <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{b.email} · {b.subject} {b.tutorName ? "· " + b.tutorName : ""}</div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "4px", fontStyle: "italic" }}>"{b.message}"</div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleAction(b._id, "accept")} style={{ padding: "8px 16px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Accept</button>
                <button onClick={() => handleAction(b._id, "reject")} style={{ padding: "8px 16px", background: "#E24B4A", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Reject</button>
              </div>
            </div>
          ))}
        </div>

        {accepted.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ marginBottom: "16px", fontFamily: "Georgia, serif", fontSize: "18px", color: "#1A2E44" }}>Accepted Bookings</div>
            {accepted.map(b => (
              <div key={b._id} style={{ background: "#fff", border: "1px solid #A8E6CF", borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px" }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{b.email} · {b.subject}</div>
                </div>
                <span style={{ background: "#E1F5EE", color: "#0F6E56", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: 500 }}>Accepted</span>
              </div>
            ))}
          </div>
        )}

        {rejected.length > 0 && (
          <div>
            <div style={{ marginBottom: "16px", fontFamily: "Georgia, serif", fontSize: "18px", color: "#1A2E44" }}>Rejected Bookings</div>
            {rejected.map(b => (
              <div key={b._id} style={{ background: "#fff", border: "1px solid #F5C6C6", borderRadius: "12px", padding: "16px 20px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "16px" }}>
                <span style={{ fontSize: "20px" }}>❌</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#1A2E44", fontSize: "14px" }}>{b.studentName}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{b.email} · {b.subject}</div>
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