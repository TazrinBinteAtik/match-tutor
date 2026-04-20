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
  const count = await Tutor.countDocuments();
  if (count > 0) return;
  await Tutor.insertMany([
    { name: 'Ali Hassan', subject: 'Mathematics', level: 'O-Level / A-Level', rate: '$20/hr', rating: 4.8, experience: '3 years', available: true },
    { name: 'Sara Khan', subject: 'Physics', level: 'A-Level / University', rate: '$25/hr', rating: 4.9, experience: '5 years', available: true },
    { name: 'Usman Ahmed', subject: 'Computer Science', level: 'All Levels', rate: '$22/hr', rating: 4.7, experience: '2 years', available: false }
  ]);
  console.log('Tutors seeded to MongoDB');
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