import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ message: 'No hay token de autenticación' });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};