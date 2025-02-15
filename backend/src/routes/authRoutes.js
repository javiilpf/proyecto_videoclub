import express from 'express';
import { login, register, logout } from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
// /login  /register  /logout

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
// aquí tendréis que añadir las rutas que faltan (google)

export default router;