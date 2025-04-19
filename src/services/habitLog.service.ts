import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

type CreateHabitLogInput = {
  habitId: number;
  date: Date | string;
  completed: boolean;
  note?: string;
  loggedAt?: Date | string;
};

type UpdateHabitLogInput = {
  completed?: boolean;
  note?: string;
};

export class HabitLogService {
  async createHabitLog(logData: CreateHabitLogInput) {
    try {
      return await prisma.habitlog.create({
        data: {
          habit: { connect: { id: logData.habitId } },
          date: new Date(logData.date),
          completed: logData.completed,
          note: logData.note,
          loggedAt: logData.loggedAt ? new Date(logData.loggedAt) : new Date(),
        },
      });
    } catch (error) {
      console.error("Create HabitLog error:", error);
      throw new Error("Failed to create habit log");
    }
  }

  async getLogsForHabit(habitId: number) {
    try {
      return await prisma.habitlog.findMany({
        where: { habitId },
        orderBy: { date: "desc" },
      });
    } catch (error) {
      console.error("Get HabitLogs error:", error);
      throw new Error("Failed to fetch habit logs");
    }
  }

  async getLogsByDate(habitId: number, date: Date | string) {
    try {
      const targetDate = new Date(date);
      return await prisma.habitlog.findFirst({
        where: {
          habitId,
          date: targetDate,
        },
      });
    } catch (error) {
      console.error("Get log by date error:", error);
      throw new Error("Failed to fetch habit log by date");
    }
  }

  async updateHabitLog(logId: number, data: UpdateHabitLogInput) {
    try {
      if (Object.keys(data).length === 0) {
        throw new Error("No update habit log fields provided.");
      }
      return await prisma.habitlog.update({
        where: { id: logId },
        data: {
          completed: data.completed,
          note: data.note,
        },
      });
    } catch (error) {
      console.error("Update HabitLog error:", error);
      throw new Error("Failed to update habit log");
    }
  }

  async deleteHabitLog(logId: number) {
    try {
      await prisma.habitlog.delete({
        where: { id: logId },
      });
      return true;
    } catch (error) {
      console.error("Delete HabitLog error:", error);
      throw new Error("Failed to delete habit log");
    }
  }

  async logHabit(habitId: number, date: Date | string, completed: boolean) {
    try {
      const existingLog = await prisma.habitlog.findFirst({
        where: {
          habitId,
          date: new Date(date),
        },
      });
  
      if (existingLog) {
        return await prisma.habitlog.update({
          where: { id: existingLog.id },
          data: { completed },
        });
      } else {
        return await prisma.habitlog.create({
          data: {
            habit: { connect: { id: habitId } },
            date: new Date(date),
            completed,
            loggedAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error("Log Habit error:", error);
      throw new Error("Failed to log habit");
    }
  }
  
}
