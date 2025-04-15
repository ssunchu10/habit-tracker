// src/routes/auth.route.ts
import express from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = express.Router();
const authController = new AuthController();

router.post('/register', (req, res, next) => {
  authController.register(req, res)
    .catch(next);
});

router.post('/login', (req, res, next) => {
  authController.login(req, res)
    .catch(next);
});

export default router;