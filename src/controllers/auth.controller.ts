import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/userService";
import { saltAndHashPassword } from "../utils/password";
import prisma from "../lib/prisma";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  isProduction = process.env.NODE_ENV === "production";

  private generateToken = (user: any) => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET not set in environment variables");
    }

    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        res.status(409).json({ message: "Email already registered" });
        return;
      }

      if (password.length < 8) {
        res
          .status(400)
          .json({ message: "Password must be at least 8 characters long" });
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

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: this.isProduction,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          user: safeUser,
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

      const existingUser = await this.userService.findUserByEmail(email);
      if (!existingUser) {
        res.status(409).json({ message: "User not registered" });
        return;
      }

      const user = await this.userService.findUserByCredentials(
        email,
        password
      );

      await prisma.user.update({
        where: { id: user.id },
        data: { last_login: new Date() },
      });

      const token = this.generateToken(user);

      const { password_hash, ...safeUser } = user;

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: this.isProduction,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          user: safeUser,
          message: "User registered Sucessfully",
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Invalid Credentials" });
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: this.isProduction,
        sameSite: "lax",
      })
      .status(200)
      .json({ message: "Logged out successfully" });
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

      res.status(200).json({
        user: safeUser,
        message: "User fetched Sucessfully",
      });
      return;
    } catch (error) {
      console.error("Get current user error:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
      return;
    }
  };
}
