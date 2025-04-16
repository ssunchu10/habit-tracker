import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./lib/connectDB";
import authRoutes from "./routes/auth.route";

const app: Express = express();

connectDB();

app.set("trust proxy", true);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Habit Tracker API is running");
});

app.use("/api/auth", authRoutes);

const PORT: string | number = parseInt(process.env.PORT || "3001");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
