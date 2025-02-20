import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/config.js';

export const register = async (req, res) => {
    try {
        console.log('Datos recibidos en el servidor:', req.body);
        
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                mensaje: 'Email y contraseña son requeridos'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        
        // Buscar usuario existente
        const existingUser = await User.findOne({ 
            email: normalizedEmail 
        }).exec();
        
        if (existingUser) {
            return res.status(400).json({
                mensaje: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const user = new User({ 
            email: normalizedEmail, 
            password 
        });
        
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            config.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).json({
            mensaje: 'Error en el servidor durante el registro',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.json({
            mensaje: 'Login exitoso',
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: 'Error en login',
            error: error.message 
        });
    }
};

export const verify = async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ mensaje: 'No autenticado' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ mensaje: 'Token inválido' });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ mensaje: 'Logout exitoso' });
};