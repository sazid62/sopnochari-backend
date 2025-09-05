import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import uploadRoutes from "./api/upload.js";
import contributionRoutes from "./api/contributions.js";
import personRoutes from "./api/person.js"

import { connectToDatabase } from "./config/db.js";

// Connect DB
await connectToDatabase();

const app = express();
const PORT = process.env.PORT || 5555;

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

 

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/person", personRoutes)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Sopnochari API" });
});


// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
