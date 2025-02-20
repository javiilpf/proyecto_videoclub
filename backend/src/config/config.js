import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: 'mongodb://127.0.0.1:27017/videoclubdb',
    JWT_SECRET: process.env.JWT_SECRET || 'tu_secreto',
    NODE_ENV: process.env.NODE_ENV || 'development',
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    TMDB_BASE_URL: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
}; 