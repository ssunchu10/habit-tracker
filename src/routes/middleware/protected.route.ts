import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../../services/userService";
import { IUser } from "../../models/User";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authentication token missing" });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    try {
      const decoded = jwt.verify(token, secret) as { id: string; email: string };
      
      req.user = { id: decoded.id } as IUser;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const enhancedAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  authMiddleware(req, res, async (err: any) => {
    if (err) return next(err);

    if (req.user?.id) {
      try {
        const userService = new UserService();
        const fullUser = await userService.findUserByID(req.user.id);
        req.user = fullUser;
        next();
      } catch (error) {
        console.error("Enhanced auth error:", error);
        res.status(401).json({ message: "User not found" });
      }
    } else {
      next();
    }
  });
};
