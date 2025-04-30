import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../../services/userService";

interface JwtPayload {
  id: number;
  email: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set in environment variables");
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).user = { id: decoded.id };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const enhancedAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authMiddleware(req, res, () => {});

    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userService = new UserService();
    const fullUser = await userService.findUserByID(userId);
    (req as any).user = fullUser;

    return next();
  } catch (error) {
    console.error("Enhanced auth error:", error);
    res.status(401).json({ message: "User not found or token invalid" });
    return;
  }
};
