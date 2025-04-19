import { Request, Response } from "express";
import { HabitLogService } from "../services/habitLog.service";

export class HabitLogController {
  private habitLogService: HabitLogService;

  constructor() {
    this.habitLogService = new HabitLogService();
  }

  createHabitLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const log = await this.habitLogService.createHabitLog(req.body);
      res.status(201).json({ log, message: "Habit log created successfully" });
    } catch (error) {
      console.error("Create habit log error:", error);
      res.status(500).json({ message: "Failed to create habit log" });
    }
  };

  getLogsForHabit = async (req: Request, res: Response): Promise<void> => {
    try {
      const habitId = parseInt(req.params.habitId);
      const logs = await this.habitLogService.getLogsForHabit(habitId);
      res.status(200).json({ logs });
    } catch (error) {
      console.error("Get habit logs error:", error);
      res.status(500).json({ message: "Failed to fetch habit logs" });
    }
  };

  getLogByDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const habitId = parseInt(req.params.habitId);
      const date = req.query.date as string;
      const log = await this.habitLogService.getLogsByDate(habitId, date);
      res.status(200).json({ log });
    } catch (error) {
      console.error("Get log by date error:", error);
      res.status(500).json({ message: "Failed to fetch habit log" });
    }
  };

  updateHabitLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const logId = parseInt(req.params.logId);
      const updatedLog = await this.habitLogService.updateHabitLog(
        logId,
        req.body
      );
      res
        .status(200)
        .json({ updatedLog, message: "Habit log updated successfully" });
    } catch (error) {
      console.error("Update habit log error:", error);
      res.status(500).json({ message: "Failed to update habit log" });
    }
  };

  deleteHabitLog = async (req: Request, res: Response): Promise<void> => {
    try {
      const logId = parseInt(req.params.logId);
      await this.habitLogService.deleteHabitLog(logId);
      res.status(200).json({ message: "Habit log deleted successfully" });
    } catch (error) {
      console.error("Delete habit log error:", error);
      res.status(500).json({ message: "Failed to delete habit log" });
    }
  };

  logHabit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { habitId, date, completed } = req.body;
      const result = await this.habitLogService.logHabit(
        habitId,
        date,
        completed
      );
      res.status(200).json({
        log: result,
        message: "Habit log updated/created successfully",
      });
    } catch (error) {
      console.error("Log habit error:", error);
      res.status(500).json({ message: "Failed to log habit" });
    }
  };
}
