import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

type CreateHabitInput = Prisma.HabitCreateInput;

export class HabitService {
  async createHabit(newHabitData: CreateHabitInput) {
    try {
      const data = {
        ...newHabitData,
        daysOfWeek: newHabitData.daysOfWeek || "Everyday",
        is_active: newHabitData.is_active ?? true,
      };
      const newHabit = await prisma.habit.create({
        data: data,
      });
      return newHabit;
    } catch (error) {
      console.error("Habit creation error:", error);
      throw new Error("Failed to create habit");
    }
  }

  async updateHabit(id: number, habitData: Partial<CreateHabitInput>) {
    try {
      const updatedHabit = await prisma.habit.update({
        where: { id },
        data: habitData,
      });
      return updatedHabit;
    } catch (error: unknown) {
      console.error("Habit update error:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new Error("Habit not found");
      }
      throw new Error("Failed to update habit");
    }
  }

  async deleteHabit(id: number): Promise<boolean> {
    try {
      await prisma.habit.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Habit update error:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
        throw new Error("Habit not found");
      }
      throw new Error("Failed to update habit");
    }
  }

  async findHabitByID(id: number) {
    try {
      const habit = await prisma.habit.findUnique({
        where: { id },
      });

      if (!habit) {
        throw new Error("Habit not found");
      }
      return habit;
    } catch (error) {
      console.error("Habit lookup error:", error);
      throw new Error("Failed to find habit");
    }
  }

  async getHabitsByUser(userId: number) {
    try {
      const userHabits = await prisma.habit.findMany({
        where: { userId: userId },
        orderBy: {createdAt: "desc"},
      });

      return userHabits;
    } catch (error) {
      console.error("Habits lookup error:", error);
      throw new Error("Failed to find habits");
    }
  }

  async ToggleHabitActive(id: number, is_active: boolean) {
    try {
      return await prisma.habit.update({
        where: { id },
        data: {
          is_active: is_active,
        },
      });
    } catch (error) {
      console.error("Toggle habit error:", error);
      throw new Error("Failed to toggle habit status");
    }
  }

  async getHabitsForToday(userId: number, today: string) {
    try {
      const normalizedDay = today.charAt(0).toUpperCase() + today.slice(1).toLowerCase();
  
      return await prisma.habit.findMany({
        where: {
          userId,
          is_active: true,
          daysOfWeek: {
            contains: normalizedDay,
          },
        },
      });
    } catch (error) {
      console.error("Get today's habits error:", error);
      throw new Error("Failed to fetch today's habits");
    }
  }
}
