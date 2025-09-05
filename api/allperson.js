import { Router } from "express";
import { connectToDatabase } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    const { db } = await connectToDatabase();
    const collection = db.collection("persons");



    const persons = await collection.find(username ? {username}  : {}).toArray();
    return res.status(200).json(persons);
  } catch (err) {
    console.error("GET /api/person error:", err);
    return res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username } = req.query;
    const { db } = await connectToDatabase();
    const collection = db.collection("persons");

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const now = new Date();

    const result = await collection.updateOne(
      { username }, // find by username
      { $set: { lastVisit: now } }, // update
      { upsert: true } // create if not exist
    );

    return res.status(200).json({
      message: "Last visit updated",
      username,
      lastVisit: now,
      result,
    });
  } catch (err) {
    console.error("POST /api/person error:", err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
