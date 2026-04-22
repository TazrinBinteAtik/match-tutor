import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [role, setRole] = useState("Student");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: role.toLowerCase() })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F7F4EF", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: "960px", display: "flex", borderRadius: "16px", overflow: "hidden", boxShadow: "0 24px 64px rgba(26,46,68,0.16)" }}>

        {/* LEFT PANEL */}
        <div style={{ width: "42%", background: "#1A2E44", padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#fff", fontWeight: 600 }}>
              Match<span style={{ color: "#7DC9A8", fontStyle: "italic", fontWeight: 400 }}>Tutor</span>
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "5px" }}>Find your perfect tutor</div>
          </div>
          <div>
            <h2 style={{ fontFamily: "Fraunces, serif", fontSize: "30px", color: "#fff", fontWeight: 600, lineHeight: 1.3 }}>
              Learn from the <em style={{ color: "#7DC9A8", fontStyle: "italic" }}>best tutors</em>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "14px", lineHeight: 1.65 }}>
              Browse verified tutors by subject, book sessions, and track your progress.
            </p>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <div><div style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#7DC9A8" }}>50+</div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Active tutors</div></div>
            <div><div style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#7DC9A8" }}>4.8★</div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>Avg. rating</div></div>
            <div><div style={{ fontFamily: "Fraunces, serif", fontSize: "24px", color: "#7DC9A8" }}>Free</div><div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>To join</div></div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, background: "#fff", padding: "48px 44px" }}>
          <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "26px", color: "#1A2E44", fontWeight: 600 }}>Create your account</h1>
          <p style={{ fontSize: "13px", color: "#888", marginTop: "5px", marginBottom: "24px" }}>Join as a student or tutor — completely free</p>

          <div style={{ display: "flex", border: "1px solid #E8E4DD", borderRadius: "9px", overflow: "hidden", width: "fit-content", marginBottom: "24px" }}>
            {["Student", "Tutor"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ padding: "9px 24px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: "none", background: role === r ? "#1A2E44" : "transparent", color: role === r ? "#fff" : "#888" }}>{r}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>First name</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ali" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>Last name</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Hassan" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>Email address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="ali@example.com" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginTop: "14px" }}>
            <label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimum 8 characters" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "13px", background: "#1A2E44", color: "#fff", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 500, cursor: "pointer", marginTop: "20px" }}
          >
            {loading ? "Creating account..." : "Create account →"}
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "16px" }}>
            Already have an account? <span onClick={() => navigate("/login")} style={{ color: "#1A2E44", fontWeight: 500, cursor: "pointer" }}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}