import mongoose from "mongoose";

let isConnecting = false;

export const connectDB = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn("MONGO_URI not set. Running with in-memory fallback store.");
    return;
  }

  isConnecting = true;

  try {
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
