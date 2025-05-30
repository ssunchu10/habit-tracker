import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: './prod.env' });
} else {
  dotenv.config();
}
import cors from "cors";
import routes from "./routes/index";
import cookieParser from "cookie-parser";

const app: Express = express();
app.use(cookieParser());

app.set("trust proxy", true);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Habit Tracker API is running");
});

app.use("/api", routes);

const PORT: string | number = parseInt(process.env.PORT || "3001");

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
