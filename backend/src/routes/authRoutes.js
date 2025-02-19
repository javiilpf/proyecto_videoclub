import express from 'express';
import { login, register, logout, verify } from '../controllers/authController.js';

const router = express.Router();

// Rutas de autenticación
// /login  /register  /logout

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verify);


// aquí tendréis que añadir las rutas que faltan (google)

export default router;