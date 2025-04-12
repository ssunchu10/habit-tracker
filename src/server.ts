import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import { connectDB } from "./lib/connectDB";

const app: Express = express();

connectDB();

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true, 
      methods: ['GET', 'POST', 'PUT', 'DELETE'], 
      allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  
const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

  