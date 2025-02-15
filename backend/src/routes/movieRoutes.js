import express from 'express';
import { syncPopularMovies, getMovies, getMovieById } from '../controllers/movieController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sync', authMiddleware, syncPopularMovies);
router.get('/popular', getMovies);
router.get('/:id', getMovieById);

export default router;