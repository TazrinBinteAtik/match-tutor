require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const Tutor    = require('./models/Tutor');
const Booking  = require('./models/Booking');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('Attempting to connect to MongoDB...');
console.log('URI starts with:', process.env.MONGO_URI?.substring(0, 30));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
})
.then(async () => {
  console.log('Connected to MongoDB');
  await seedTutors();
})
.catch(err => {
  console.log('MongoDB connection FAILED');
  console.log('Error name:', err.name);
  console.log('Error message:', err.message);
});

async function seedTutors() {
  await Tutor.deleteMany(); // clears old tutors and re-seeds fresh
  await Tutor.insertMany([
    // Mathematics
    { name: "Ali Hassan", subject: "Mathematics", level: "O-Level / A-Level", rate: "$20/hr", rating: 4.8, experience: "3 years", available: true },
    { name: "Fatima Malik", subject: "Mathematics", level: "Primary / O-Level", rate: "$15/hr", rating: 4.6, experience: "2 years", available: true },
    { name: "Tariq Mahmood", subject: "Mathematics", level: "A-Level / University", rate: "$30/hr", rating: 4.9, experience: "7 years", available: true },

    // Physics
    { name: "Sara Khan", subject: "Physics", level: "A-Level / University", rate: "$25/hr", rating: 4.9, experience: "5 years", available: true },
    { name: "Hamid Raza", subject: "Physics", level: "O-Level", rate: "$18/hr", rating: 4.5, experience: "2 years", available: true },
    { name: "Nadia Hussain", subject: "Physics", level: "A-Level", rate: "$22/hr", rating: 4.7, experience: "4 years", available: false },

    // Chemistry
    { name: "Zara Ahmed", subject: "Chemistry", level: "O-Level / A-Level", rate: "$22/hr", rating: 4.8, experience: "4 years", available: true },
    { name: "Bilal Iqbal", subject: "Chemistry", level: "A-Level / University", rate: "$28/hr", rating: 4.7, experience: "6 years", available: true },
    { name: "Sana Mirza", subject: "Chemistry", level: "O-Level", rate: "$16/hr", rating: 4.4, experience: "1 year", available: true },

    // Biology
    { name: "Ayesha Siddiqui", subject: "Biology", level: "O-Level / A-Level", rate: "$20/hr", rating: 4.7, experience: "3 years", available: true },
    { name: "Usman Farooq", subject: "Biology", level: "A-Level / Medical Entry", rate: "$25/hr", rating: 4.9, experience: "5 years", available: true },
    { name: "Hina Baig", subject: "Biology", level: "Primary / O-Level", rate: "$14/hr", rating: 4.3, experience: "2 years", available: false },

    // Computer Science
    { name: "Usman Ahmed", subject: "Computer Science", level: "All Levels", rate: "$22/hr", rating: 4.7, experience: "2 years", available: false },
    { name: "Raza Ali", subject: "Computer Science", level: "O-Level / A-Level", rate: "$20/hr", rating: 4.6, experience: "3 years", available: true },
    { name: "Mariam Shah", subject: "Computer Science", level: "University / Professional", rate: "$35/hr", rating: 4.9, experience: "6 years", available: true },

    // English
    { name: "Amna Khalid", subject: "English", level: "Primary / O-Level", rate: "$12/hr", rating: 4.5, experience: "3 years", available: true },
    { name: "Danyal Baig", subject: "English", level: "O-Level / A-Level", rate: "$18/hr", rating: 4.7, experience: "4 years", available: true },
    { name: "Lubna Qureshi", subject: "English Literature", level: "A-Level", rate: "$22/hr", rating: 4.8, experience: "5 years", available: true },

    // Urdu
    { name: "Shahid Nawaz", subject: "Urdu", level: "Primary / O-Level", rate: "$10/hr", rating: 4.4, experience: "2 years", available: true },
    { name: "Rabia Anwar", subject: "Urdu", level: "O-Level / A-Level", rate: "$14/hr", rating: 4.6, experience: "3 years", available: true },

    // Economics
    { name: "Kamran Sheikh", subject: "Economics", level: "O-Level / A-Level", rate: "$22/hr", rating: 4.7, experience: "4 years", available: true },
    { name: "Noor Fatima", subject: "Economics", level: "A-Level / University", rate: "$28/hr", rating: 4.8, experience: "5 years", available: true },
    { name: "Asad Mehmood", subject: "Economics", level: "O-Level", rate: "$18/hr", rating: 4.5, experience: "2 years", available: false },

    // Accounting
    { name: "Imran Chaudhry", subject: "Accounting", level: "O-Level / A-Level", rate: "$22/hr", rating: 4.6, experience: "3 years", available: true },
    { name: "Saima Akhtar", subject: "Accounting", level: "A-Level / University", rate: "$26/hr", rating: 4.8, experience: "5 years", available: true },
    { name: "Faisal Rehman", subject: "Accounting", level: "Professional / ACCA", rate: "$35/hr", rating: 4.9, experience: "8 years", available: true },

    // History
    { name: "Mehwish Tariq", subject: "History", level: "O-Level / A-Level", rate: "$16/hr", rating: 4.5, experience: "3 years", available: true },
    { name: "Junaid Karim", subject: "History", level: "A-Level", rate: "$20/hr", rating: 4.6, experience: "4 years", available: false },

    // Geography
    { name: "Sobia Nasir", subject: "Geography", level: "O-Level / A-Level", rate: "$16/hr", rating: 4.4, experience: "2 years", available: true },
    { name: "Adnan Malik", subject: "Geography", level: "O-Level", rate: "$14/hr", rating: 4.3, experience: "1 year", available: true },

    // Islamic Studies
    { name: "Hafiz Abdul Rahman", subject: "Islamic Studies", level: "All Levels", rate: "$12/hr", rating: 4.8, experience: "6 years", available: true },
    { name: "Maryam Zaidi", subject: "Islamic Studies", level: "Primary / O-Level", rate: "$10/hr", rating: 4.7, experience: "3 years", available: true },

    // Pakistan Studies
    { name: "Tariq Javed", subject: "Pakistan Studies", level: "O-Level", rate: "$14/hr", rating: 4.5, experience: "3 years", available: true },
    { name: "Uzma Riaz", subject: "Pakistan Studies", level: "O-Level / A-Level", rate: "$16/hr", rating: 4.6, experience: "4 years", available: true },

    // Statistics
    { name: "Dr. Nauman Ashraf", subject: "Statistics", level: "A-Level / University", rate: "$32/hr", rating: 4.9, experience: "9 years", available: true },
    { name: "Hira Yousaf", subject: "Statistics", level: "O-Level / A-Level", rate: "$22/hr", rating: 4.7, experience: "4 years", available: true },

    // Business Studies
    { name: "Waheed Alam", subject: "Business Studies", level: "O-Level / A-Level", rate: "$20/hr", rating: 4.6, experience: "3 years", available: true },
    { name: "Shazia Parveen", subject: "Business Studies", level: "A-Level / University", rate: "$25/hr", rating: 4.7, experience: "5 years", available: false },

    // Psychology
    { name: "Dr. Aisha Rana", subject: "Psychology", level: "A-Level / University", rate: "$30/hr", rating: 4.9, experience: "7 years", available: true },
    { name: "Fahad Zaman", subject: "Psychology", level: "A-Level", rate: "$24/hr", rating: 4.6, experience: "3 years", available: true },

    // Sociology
    { name: "Nasreen Butt", subject: "Sociology", level: "A-Level / University", rate: "$22/hr", rating: 4.5, experience: "4 years", available: true },

    // Art & Design
    { name: "Zainab Lodhi", subject: "Art & Design", level: "O-Level / A-Level", rate: "$18/hr", rating: 4.7, experience: "4 years", available: true },
    { name: "Ahsan Rauf", subject: "Art & Design", level: "All Levels", rate: "$15/hr", rating: 4.5, experience: "2 years", available: true },

    // French
    { name: "Camille Dupont", subject: "French", level: "O-Level / A-Level", rate: "$25/hr", rating: 4.8, experience: "5 years", available: true },
    { name: "Aroha Zia", subject: "French", level: "Beginner / Intermediate", rate: "$20/hr", rating: 4.6, experience: "3 years", available: true },

    // Arabic
    { name: "Sheikh Omar Farooq", subject: "Arabic", level: "All Levels", rate: "$18/hr", rating: 4.8, experience: "6 years", available: true },
    { name: "Fatima Al-Rashid", subject: "Arabic", level: "Beginner / O-Level", rate: "$15/hr", rating: 4.6, experience: "3 years", available: true },

    // General Science
    { name: "Rukhsana Hayat", subject: "General Science", level: "Primary / Middle", rate: "$12/hr", rating: 4.5, experience: "3 years", available: true },
    { name: "Mohsin Abbasi", subject: "General Science", level: "Primary / O-Level", rate: "$14/hr", rating: 4.4, experience: "2 years", available: true },

    // Further Mathematics
    { name: "Prof. Arif Hussain", subject: "Further Mathematics", level: "A-Level / University", rate: "$40/hr", rating: 5.0, experience: "12 years", available: true },
    { name: "Waqas Naeem", subject: "Further Mathematics", level: "A-Level", rate: "$32/hr", rating: 4.8, experience: "6 years", available: false },
  ]);
  console.log('50+ Tutors seeded to MongoDB');
}


app.get('/', (req, res) => res.send('Match Tutor API is running'));

app.get('/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json(tutors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tutors' });
  }
});

app.post('/book', async (req, res) => {
  const { studentName, email, subject, message } = req.body;
  if (!studentName || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const booking = new Booking({ studentName, email, subject, message });
    await booking.save();
    res.json({ message: 'Booking request sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});