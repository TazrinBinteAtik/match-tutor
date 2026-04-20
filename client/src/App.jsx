import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    studentName: "", email: "", subject: "", message: ""
  });

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
      setFormData({ studentName: "", email: "", subject: "", message: "" });
    }
  };

  const filtered = tutors.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <nav className="navbar">
        <h2>Match Tutor</h2>
        <div>
          <a href="#about">About</a>
          <a href="#tutors">Tutors</a>
          <a href="#book">Book</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Find Your Perfect Tutor</h1>
        <p>Browse qualified tutors by subject and book a session today.</p>
      </section>

      <section id="about">
        <h2>About Match Tutor</h2>
        <p>Match Tutor connects students with experienced tutors across a wide range of subjects.</p>
      </section>

      <section id="tutors">
        <h2>Our Tutors</h2>
        <input
          className="search-box"
          type="text"
          placeholder="Search by subject or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      <section id="book">
        <h2>Book a Tutor</h2>
        <form className="book-form" onSubmit={handleSubmit}>
          <input type="text" name="studentName" placeholder="Your name" value={formData.studentName} onChange={handleChange} />
          <input type="email" name="email" placeholder="Your email" value={formData.email} onChange={handleChange} />
          <input type="text" name="subject" placeholder="Subject you need help with" value={formData.subject} onChange={handleChange} />
          <textarea name="message" placeholder="Your message" rows="5" value={formData.message} onChange={handleChange} />
          <button type="submit">Send Booking Request</button>
        </form>
      </section>
    </div>
  );
}

export default App;