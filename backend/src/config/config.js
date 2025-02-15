import dotenv from 'dotenv';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    TMDB_API_KEY: process.env.VITE_API_TOKEN,
    TMDB_BASE_URL: process.env.VITE_BASE_URL
}; 