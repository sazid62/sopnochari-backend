import express from "express";
import { getContributionsCollection, connectDB } from "./config/db.js";

const router = express.Router();

// GET contributions
router.get("/", async (req, res) => {
  try {
    const collection = await connectDB();
    const contributions = await collection.find({}).toArray();
    res.status(200).json(contributions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching contributions", error: err.message });
  }
});

// POST contribution
router.post("/", async (req, res) => {
  try {
    const newContribution = req.body;
    const collection = await connectDB();

    const requiredFields = [
      "date","recipient","sender","amount","method",
      "from","to","txn_id","note","sender_proof","recvr_proof"
    ];

    const missingFields = requiredFields.filter(f => !newContribution[f]);
    if (missingFields.length > 0) return res.status(400).json({ message: "Missing fields", missing: missingFields });

    if (typeof newContribution.amount !== "number")
      return res.status(400).json({ message: "Amount must be a number" });

    const result = await collection.insertOne(newContribution);
    const insertedDoc = await collection.findOne({ _id: result.insertedId });

    res.status(201).json({ message: "Contribution added", contribution: insertedDoc });
  } catch (err) {
    res.status(500).json({ message: "Error inserting contribution", error: err.message });
  }
});

export default router;
