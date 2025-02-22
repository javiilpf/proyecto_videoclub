import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import reviewRoutes from './routes/reviews.js';
// ... otros imports ...

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://frontend:5173',
    'http://localhost:3000'
];

// Middlewares (orden importante)
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middleware para debugging
app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        path: req.path,
        body: req.body,
        cookies: req.cookies
    });
    next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

export default app; 