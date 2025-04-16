import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

let isConnected = false; 

export const connectDB =  async (): Promise<void> => {
    if (isConnected) {
        console.log("MongoDB is already connected.");
        return;
      }

    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI as string, {
      
        });

        isConnected = connection.readyState === 1;

        if (isConnected) {
            console.log("MongoDB is connected at the database: "+  connection?.db?.databaseName);
           
        }
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
    }
};
