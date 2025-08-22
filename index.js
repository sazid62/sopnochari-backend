import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import uploadRoutes from "./api/upload.js";
import contributionRoutes from "./api/contributions.js";

import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : process.env.FRONTEND_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Connect DB
await connectDB();

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/contributions", contributionRoutes);
app.use(("/"), (req, res) => {
  res.status(200).json({ message: "Welcome to Sopnochari API" });
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
