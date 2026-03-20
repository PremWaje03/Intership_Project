import mongoose from "mongoose";

let isConnecting = false;

export const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return;
  }

  isConnecting = true;

  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_project_hub";
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(() => {
      isConnecting = false;
      connectDB();
    }, 5000);
    return;
  }

  isConnecting = false;
};
