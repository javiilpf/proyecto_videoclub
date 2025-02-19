import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  estrellas: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Review', reviewSchema); 