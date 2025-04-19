import express from "express";
import { HabitLogController } from "../controllers/habitLog.controller";
import { authMiddleware } from "./middleware/protected.route";

const router = express.Router();
const habitLogController = new HabitLogController();

router.post("/", authMiddleware, habitLogController.createHabitLog);
router.get("/habit/:habitId", authMiddleware, habitLogController.getLogsForHabit);
router.get("/habit/:habitId/by-date", authMiddleware, habitLogController.getLogByDate);
router.put("/:logId", authMiddleware, habitLogController.updateHabitLog);
router.delete("/:logId", authMiddleware, habitLogController.deleteHabitLog);
router.post("/quick-log", authMiddleware, habitLogController.logHabit);

export default router;
