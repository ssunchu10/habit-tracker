import { Request, Response } from "express";
import { HabitService } from "../services/habitService";
import { Habit } from "@prisma/client";

export class HabitController {
  private habitService: HabitService;

  constructor() {
    this.habitService = new HabitService();
  }

  createHabit = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const habit = await this.habitService.createHabit({
        ...req.body,
        user: { connect: { id: userId } },
      });
      res.status(201).json({
        habit,
        message: "Habit created successfully",
      });
    } catch (error) {
      console.error("Create habit error:", error);
      res.status(500).json({
        message: "Failed to create habit",
      });
    }
  };

  getHabitsByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const habits = await this.habitService.getHabitsByUser(userId);
      res.status(200).json({ habits });
    } catch (error) {
      console.error("Get habits error:", error);
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  };

  findHabitByID = async (req: Request, res: Response): Promise<void> => {
    try {
      const habitId = parseInt(req.params.id);
      const habit = await this.habitService.findHabitByID(habitId);
      res.status(200).json({ habit });
    } catch (error) {
      console.error("Find habit error:", error);
      res.status(404).json({ message: "Habit not found" });
    }
  };

  updateHabit = async (req: Request, res: Response): Promise<void> => {
    try {
      const habitId = parseInt(req.params.id);
      const updatedHabit = await this.habitService.updateHabit(
        habitId,
        req.body
      );
      res
        .status(200)
        .json({ updatedHabit, message: "Habit updated successfully" });
    } catch (error) {
      console.error("Update habit error:", error);
      res.status(500).json({
        message: "Failed to update habit",
      });
    }
  };

  deleteHabit = async (req: Request, res: Response): Promise<void> => {
    try {
      const habitId = parseInt(req.params.id);
      await this.habitService.deleteHabit(habitId);
      res.status(200).json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("Delete habit error:", error);
      res.status(500).json({
        message: "Failed to delete habit",
      });
    }
  };

  toggleHabitActive = async (req: Request, res: Response): Promise<void> => {
    try {
      const habitId = parseInt(req.params.id);
      const { is_active } = req.body;
      const updatedHabit = await this.habitService.ToggleHabitActive(
        habitId,
        is_active
      );
      res
        .status(200)
        .json({
          habit: updatedHabit,
          message: `Habit ${
            is_active ? "activated" : "deactivated"
          } successfully`,
        });
    } catch (error) {
      console.error("Toggle active error:", error);
      res.status(500).json({ message: "Failed to toggle habit status" });
    }
  };

  getHabitsForToday = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const day = req.query.day as string; 
      const habits = await this.habitService.getHabitsForToday(userId, day);
      res.status(200).json({ habits });
    } catch (error) {
      console.error("Get today's habits error:", error);
      res.status(500).json({ message: "Failed to fetch today's habits" });
    }
  };
}
