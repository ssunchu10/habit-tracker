import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { User } from "@prisma/client";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const { first_name, last_name, email } = req.body;
      
      const existingUser = await this.userService.findUserByID(userId);
      
      if (email && email !== existingUser.email) {
        const emailExists = await this.userService.findUserByEmail(email);
        if (emailExists) {
          res.status(409).json({ message: "Email already in use" });
          return;
        }
      }
      
      const updateData: Partial<User> = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (email) updateData.email = email;
      
      const updatedUser = await this.userService.updateUser(userId, updateData);
      const { password_hash, ...safeUser } = updatedUser;
      
      res.status(200).json({
        user: safeUser,
        message: "User updated successfully"
      });
      return;
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
      return;
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      await this.userService.deleteUser(userId);
      
      res.status(200).json({
        message: "User deleted successfully"
      });
      return;
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user" });
      return;
    }
  };
  
  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await this.userService.findUserByID(userId);
      
      const { password_hash, ...safeUser } = user;
      
      res.status(200).json({
        user: safeUser,
        message: "User fetched successfully"
      });
      return;
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
      return;
    }
  };
}