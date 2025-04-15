import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/userService";
import { saltAndHashPassword } from "../utils/password";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  private generateToken = (user: any) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    return jwt.sign({
      id: user.id,
      email: user.email,
    }, secret, {
        expiresIn: '7d'
    });
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const hashedPassword = await saltAndHashPassword(password);

      const user = await this.userService.createUser({
        first_name,
        last_name,
        email,
        password_hash: hashedPassword,
      });

      const token = this.generateToken(user);

      const { password_hash, ...safeUser } = user;

      res.status(201).json({
        user: safeUser,
        token,
        message: "User registered Sucessfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Credentials required" });
      }

      const user = await this.userService.findUserByCredentials(
        email,
        password
      );

      user.last_login = new Date();
      await user.save();

      const token = this.generateToken(user);

      const { password_hash, ...safeUser } = user;

      res.status(201).json({
        user: safeUser,
        token,
        message: "User logged in Sucessfully",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Invalid Credentials" });
    }
  };

  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await this.userService.findUserByID(userId);

      const { password_hash, ...safeUser } = user;

      res.status(201).json({
        user: safeUser,
        message: "User logged in Sucessfully",
      });
    } catch (error) {
      console.error("");
    }
  };
}
