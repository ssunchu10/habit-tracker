// src/routes/auth.route.ts
import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from './middleware/protected.route';

const router = express.Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getCurrentUser);

export default router;