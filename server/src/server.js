import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import ideaRoutes from "./routes/idea.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Campus Project Hub API is running" });
});

app.use("/api/ideas", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "MongoDB is not connected. Start MongoDB service, then refresh."
    });
  }
  return next();
});

app.use("/api/ideas", ideaRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
  connectDB();
});
