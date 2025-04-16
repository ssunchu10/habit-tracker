import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from './middleware/protected.route';

const router = express.Router();
const authController = new AuthController();
const userController = new UserController();

router.get('/me', authMiddleware, authController.getCurrentUser);

router.get('/:id', userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;