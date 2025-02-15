import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
// ... otros imports ...

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

export default app; 