import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from './middleware/protected.route';

const router = express.Router();
const userController = new UserController();

router.get("/:id", authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;