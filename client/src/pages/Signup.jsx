import { useState } from "react";

export default function Signup() {
  const [role, setRole] = useState("Student");

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

          {/* TABS */}
          <div style={{ display: "flex", border: "1px solid #E8E4DD", borderRadius: "9px", overflow: "hidden", width: "fit-content", marginBottom: "24px" }}>
            {["Student", "Tutor"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ padding: "9px 24px", fontSize: "13px", fontWeight: 500, cursor: "pointer", border: "none", background: role === r ? "#1A2E44" : "transparent", color: role === r ? "#fff" : "#888" }}>{r}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div><label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>First name</label><input placeholder="Ali" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px" }} /></div>
            <div><label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>Last name</label><input placeholder="Hassan" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px" }} /></div>
          </div>

          <div style={{ marginTop: "14px" }}><label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>Email address</label><input type="email" placeholder="ali@example.com" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px" }} /></div>
          <div style={{ marginTop: "14px" }}><label style={{ fontSize: "12px", fontWeight: 500, color: "#555", display: "block", marginBottom: "7px" }}>Password</label><input type="password" placeholder="Minimum 8 characters" style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E0DBD4", borderRadius: "9px", fontSize: "13px" }} /></div>

          <button style={{ width: "100%", padding: "13px", background: "#1A2E44", color: "#fff", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: 500, cursor: "pointer", marginTop: "20px" }}>
            Create account →
          </button>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "16px" }}>
            Already have an account? <a href="/login" style={{ color: "#1A2E44", fontWeight: 500 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}