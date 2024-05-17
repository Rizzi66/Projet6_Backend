const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  book: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number },
  userId: { type: String, required: true }
});

module.exports = mongoose.model('Book', bookSchema);