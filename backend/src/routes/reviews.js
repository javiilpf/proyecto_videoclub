import express from 'express';
import { createReview, getMovieReviews, getAllReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/all', getAllReviews);
router.get('/:movieId', getMovieReviews);

export default router; 