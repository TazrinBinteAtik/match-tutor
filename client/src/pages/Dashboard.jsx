import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    setUser(JSON.parse(stored));
    fetch(`${API_URL}/bookings`)
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, []);

  const handleAction = async (id, action) => {
    await fetch(`${API_URL}/bookings/${id}/${action}`, { method: "PATCH" });
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: action === "accept" ? "accepted" : "rejected" } : b));
  };

  if (!user) return <div style={{padding:"40px",textAlign:"center"}}>Loading...</div>;

  const isTutor = user.role === "tutor";
  const pending = bookings.filter(b => b.status === "pending");
  const accepted = bookings.filter(b => b.status === "accepted");
  const rejected = bookings.filter(b => b.status === "rejected");

  const sidebarStyle = { width:"220px", minHeight:"100vh", background:"#1A2E44", color:"#fff", padding:"30px 20px", display:"flex", flexDirection:"column", gap:"8px" };
  const mainStyle = { flex:1, padding:"40px", background:"#F8F5F0", minHeight:"100vh" };
  const cardStyle = { background:"#fff", borderRadius:"12px", padding:"20px", marginBottom:"12px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" };
  const statBoxStyle = { background:"#fff", borderRadius:"12px", padding:"24px", textAlign:"center", flex:1, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" };

  return (
    <div style={{ display:"flex" }}>
      <div style={sidebarStyle}>
        <div style={{ fontSize:"22px", fontWeight:700, marginBottom:"20px" }}>MatchTutor</div>
        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginBottom:"20px" }}>
          {isTutor ? "Tutor Panel" : "Student Panel"}
        </div>
        <div style={{ padding:"10px", background:"rgba(125,201,168,0.2)", borderRadius:"8px", cursor:"pointer" }}>Dashboard</div>
        <div style={{ padding:"10px", cursor:"pointer", color:"rgba(255,255,255,0.7)" }} onClick={() => navigate("/")}>Back to website</div>
        <div style={{ marginTop:"auto", padding:"10px", cursor:"pointer", color:"rgba(255,255,255,0.5)" }} 
          onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("token"); navigate("/login"); }}>
          Logout
        </div>
      </div>

      <div style={mainStyle}>
        <h1 style={{ marginBottom:"8px" }}>{isTutor ? "Tutor Dashboard" : "Student Dashboard"}</h1>
        <p style={{ color:"#666", marginBottom:"30px" }}>
          {isTutor ? "Manage student booking requests" : "Track your booking requests"}
        </p>

        {/* Stats */}
        <div style={{ display:"flex", gap:"16px", marginBottom:"32px" }}>
          <div style={statBoxStyle}>
            <div style={{ fontSize:"32px", fontWeight:700, color:"#F59E0B" }}>{pending.length}</div>
            <div style={{ color:"#666", marginTop:"4px" }}>Pending</div>
          </div>
          <div style={statBoxStyle}>
            <div style={{ fontSize:"32px", fontWeight:700, color:"#10B981" }}>{accepted.length}</div>
            <div style={{ color:"#666", marginTop:"4px" }}>Accepted</div>
          </div>
          <div style={statBoxStyle}>
            <div style={{ fontSize:"32px", fontWeight:700, color:"#EF4444" }}>{rejected.length}</div>
            <div style={{ color:"#666", marginTop:"4px" }}>Rejected</div>
          </div>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <>
            <h2 style={{ marginBottom:"16px" }}>Pending Requests <span style={{ background:"#F59E0B", color:"#fff", borderRadius:"20px", padding:"2px 10px", fontSize:"14px" }}>{pending.length}</span></h2>
            {pending.map(b => (
              <div key={b._id} style={{ ...cardStyle, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:"16px" }}>{b.studentName}</div>
                  <div style={{ color:"#666", fontSize:"14px" }}>{b.email} · {b.subject} · {b.tutorName}</div>
                  <div style={{ color:"#888", fontSize:"13px", fontStyle:"italic" }}>"{b.message}"</div>
                </div>
                {isTutor && (
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button onClick={() => handleAction(b._id, "accept")} style={{ padding:"8px 20px", background:"#10B981", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:600 }}>Accept</button>
                    <button onClick={() => handleAction(b._id, "reject")} style={{ padding:"8px 20px", background:"#EF4444", color:"#fff", border:"none", borderRadius:"8px", cursor:"pointer", fontWeight:600 }}>Reject</button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Accepted */}
        {accepted.length > 0 && (
          <>
            <h2 style={{ margin:"24px 0 16px" }}>Accepted Bookings</h2>
            {accepted.map(b => (
              <div key={b._id} style={{ ...cardStyle, borderLeft:"4px solid #10B981" }}>
                <div style={{ fontWeight:600 }}>{b.studentName}</div>
                <div style={{ color:"#666", fontSize:"14px" }}>{b.email} · {b.subject} · {b.tutorName}</div>
                <span style={{ background:"#D1FAE5", color:"#065F46", padding:"2px 10px", borderRadius:"20px", fontSize:"12px" }}>Accepted</span>
              </div>
            ))}
          </>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <>
            <h2 style={{ margin:"24px 0 16px" }}>Rejected Bookings</h2>
            {rejected.map(b => (
              <div key={b._id} style={{ ...cardStyle, borderLeft:"4px solid #EF4444" }}>
                <div style={{ fontWeight:600 }}>{b.studentName}</div>
                <div style={{ color:"#666", fontSize:"14px" }}>{b.email} · {b.subject} · {b.tutorName}</div>
                <span style={{ background:"#FEE2E2", color:"#991B1B", padding:"2px 10px", borderRadius:"20px", fontSize:"12px" }}>Rejected</span>
              </div>
            ))}
          </>
        )}

        {bookings.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px", color:"#999" }}>No bookings yet.</div>
        )}
      </div>
    </div>
  );
}