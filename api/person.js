import { connectToDatabase } from "../config/db.js";

export const config = {
  api: {
    bodyParser: false, // we use query params, no JSON body needed
  },
};

export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("persons");

    if (req.method === "GET") {
      const { username } = req.query;
      const persons = await collection.find(username ? { username } : {}).toArray();
      return res.status(200).json(persons);
    }

    if (req.method === "POST") {
      const { username } = req.query; // read from query, no body
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      const now = new Date();
      const result = await collection.updateOne(
        { username },            // find by username
        { $set: { lastVisit: now } }, // update lastVisit
        { upsert: true }         // create if not exist
      );

      return res.status(200).json({
        message: "Last visit updated",
        username,
        lastVisit: now,
        result,
      });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("Error in /api/person:", err);
    return res.status(500).json({ message: err.message });
  }
}
