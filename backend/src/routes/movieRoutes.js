import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

router.get('/sync', movieController.syncPopularMovies);
router.get('/popular', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

export default router;