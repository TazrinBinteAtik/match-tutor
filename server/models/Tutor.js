const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  subject:    { type: String, required: true },
  level:      { type: String, required: true },
  rate:       { type: String, required: true },
  rating:     { type: Number, required: true },
  experience: { type: String, required: true },
  available:  { type: Boolean, default: true }
});

module.exports = mongoose.model('Tutor', tutorSchema);