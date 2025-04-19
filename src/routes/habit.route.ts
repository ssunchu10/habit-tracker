import express from "express";
import { HabitController } from "../controllers/habit.controller";
import { authMiddleware } from "./middleware/protected.route";

const router = express.Router();
const habitController = new HabitController();

router.post("/", authMiddleware, habitController.createHabit);
router.get("/user/:userId", authMiddleware, habitController.getHabitsByUser);
router.get("/:id", authMiddleware, habitController.findHabitByID);
router.put('/:id', authMiddleware, habitController.updateHabit);
router.delete('/:id', authMiddleware, habitController.deleteHabit);
router.patch('/:id/toggle', authMiddleware, habitController.toggleHabitActive);
router.get("/user/:userId/today", authMiddleware, habitController.getHabitsForToday);


export default router;