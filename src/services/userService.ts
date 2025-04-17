import prisma from "../lib/prisma";
import { comparePassword } from "../utils/password";
import { Prisma } from "@prisma/client";

type CreateUserInput = Prisma.UserCreateInput;

export class UserService {
  async createUser(newUserData: CreateUserInput) {
    try {
      const newUser = await prisma.user.create({
        data: newUserData,
      });
      return newUser;
    } catch (error) {
      console.error("User creation error:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: number, userData: Partial<CreateUserInput>) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: userData,
      });
      return updatedUser;
    } catch (error) {
      console.error("User update error:", error);
      throw new Error("Failed to update user");
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("User deletion error:", error);
      throw new Error("Failed to delete user");
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return user;
    } catch (error) {
      console.error("User lookup error:", error);
      throw new Error("Failed to find user");
    }
  }

  async findUserByCredentials(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error(`Invalid email or password`);
      }

      const isValid = await comparePassword(password, user.password_hash);

      if (!isValid) {
        throw new Error("Invalid email or password");
      }
      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication failed");
    }
  }

  async findUserByID(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("User lookup error:", error);
      throw new Error("Failed to find user");
    }
  }
}
