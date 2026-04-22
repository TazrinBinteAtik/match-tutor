import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function LogoC() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(125,201,168,0.15)", border: "1.5px solid #7DC9A8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#7DC9A8" strokeWidth="2" strokeLinecap="round"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="#7DC9A8" strokeWidth="2"/>
          <path d="M9 7h6M9 11h4" stroke="#7DC9A8" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: "19px", color: "#fff", fontWeight: 600, lineHeight: 1 }}>
          Match<em style={{ color: "#7DC9A8", fontStyle: "italic", fontWeight: 400 }}>Tutor</em>
        </div>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px", marginTop: "3px" }}>
          FIND YOUR PERFECT TUTOR
        </div>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ studentName: "", email: "", tutorName: "", subject: "", message: "" });
  const [aiForm, setAiForm] = useState({ subject: "", level: "", budget: "", message: "" });
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/tutors`)
      .then(res => res.json())
      .then(data => setTutors(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    alert(data.message || data.error);
    if (response.ok) {
      setFormData({ studentName: "", email: "", tutorName: "", subject: "", message: "" });
    }
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation("");
    try {
      const response = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiForm)
      });
      const data = await response.json();
      setRecommendation(data.recommendation || data.error);
    } catch (err) {
      setRecommendation("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const filtered = tutors.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <nav className="navbar">
        <LogoC />
        <div>
          <a href="#about">About</a>
          <a href="#tutors">Tutors</a>
          <a href="#ai-match">AI Match</a>
          <a href="#book">Book</a>
          <button onClick={() => navigate("/signup")} style={{ padding: "8px 18px", background: "#fff", color: "#1A2E44", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, marginLeft: "8px" }}>Sign Up</button>
          <button onClick={() => navigate("/login")} style={{ padding: "8px 18px", background: "#7DC9A8", color: "#0a2a1e", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, marginLeft: "6px" }}>Login</button>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 18px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: 600, marginLeft: "6px" }}>Dashboard</button>
        </div>
      </nav>

      <section className="hero">
        <h1>Find Your Perfect <em style={{ color: "#7DC9A8", fontStyle: "italic" }}>Tutor</em></h1>
        <p>Browse qualified tutors by subject and book a session today.</p>
        <button className="hero-btn" onClick={() => document.getElementById("tutors").scrollIntoView({ behavior: "smooth" })}>Browse Tutors</button>
      </section>

      <section id="about">
        <h2>About Match Tutor</h2>
        <p>Match Tutor connects students with experienced tutors across a wide range of subjects. Whether you need help with O-Level Mathematics, A-Level Physics, or university-level courses, we have the right tutor for you.</p>
      </section>

      <section id="tutors">
        <h2>Our Tutors</h2>
        <input className="search-box" type="text" placeholder="Search by subject or name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="tutors-grid">
          {filtered.map((tutor) => (
            <div className="tutor-card" key={tutor._id}>
              <h3>{tutor.name}</h3>
              <p><strong>Subject:</strong> {tutor.subject}</p>
              <p><strong>Level:</strong> {tutor.level}</p>
              <p><strong>Rate:</strong> {tutor.rate}</p>
              <p><strong>Rating:</strong> {tutor.rating} / 5</p>
              <p><strong>Experience:</strong> {tutor.experience}</p>
              <span className={tutor.available ? "badge available" : "badge unavailable"}>
                {tutor.available ? "Available" : "Unavailable"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="ai-match">
        <h2>AI Tutor Recommender</h2>
        <p>Answer a few questions and we will find your perfect tutor!</p>
        <form className="book-form" onSubmit={handleAiSubmit}>
          <input type="text" placeholder="What subject do you need help with?" value={aiForm.subject} onChange={(e) => setAiForm({ ...aiForm, subject: e.target.value })} />
          <input type="text" placeholder="What is your level? (e.g. O-Level, A-Level)" value={aiForm.level} onChange={(e) => setAiForm({ ...aiForm, level: e.target.value })} />
          <input type="text" placeholder="What is your budget? (e.g. $20/hr)" value={aiForm.budget} onChange={(e) => setAiForm({ ...aiForm, budget: e.target.value })} />
          <textarea placeholder="Any other details?" rows="3" value={aiForm.message} onChange={(e) => setAiForm({ ...aiForm, message: e.target.value })} />
          <button type="submit" disabled={loading}>{loading ? "Finding your tutor..." : "Find My Perfect Tutor"}</button>
        </form>
        {recommendation && (
          <div style={{ marginTop: "20px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", whiteSpace: "pre-wrap" }}>
            <h3>Your Recommended Tutors</h3>
            <p>{recommendation}</p>
          </div>
        )}
      </section>

      <section id="book">
        <h2>Book a Tutor</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          <input type="text" name="studentName" placeholder="Your name" value={formData.studentName} onChange={handleChange} />
          <input type="email" name="email" placeholder="Your email" value={formData.email} onChange={handleChange} />
          <select name="tutorName" value={formData.tutorName} onChange={handleChange} style={{ padding: "12px 16px", border: "1.5px solid #E0DBD4", borderRadius: "10px", fontSize: "14px", fontFamily: "DM Sans, sans-serif", color: formData.tutorName ? "#1A2E44" : "#999", background: "#fff", outline: "none" }}>
            <option value="" disabled>Select tutor you want to book</option>
            {tutors.filter(t => t.available).map(t => (
              <option key={t._id} value={t.name}>{t.name} - {t.subject} ({t.rate})</option>
            ))}
          </select>
          <input type="text" name="subject" placeholder="Subject you need help with" value={formData.subject} onChange={handleChange} />
          <textarea name="message" placeholder="Your message" rows="5" value={formData.message} onChange={handleChange} />
          <button type="submit">Send Booking Request</button>
        </form>
      </section>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;