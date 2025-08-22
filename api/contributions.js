import { connectToDatabase } from "../config/db.js";

export const config = {
  api: {
    bodyParser: true
  }
};

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection("contributions");

    if (req.method === "GET") {
      const contributions = await collection.find({}).toArray();
      return res.status(200).json(contributions);
    }

    if (req.method === "POST") {
      const data = req.body;

      // Basic validation
      const requiredFields = [
        "date","recipient","sender","amount","method",
        "from","to","txn_id","note","sender_proof","recvr_proof"
      ];

      const missingFields = requiredFields.filter(f => !data[f]);
      if (missingFields.length > 0)
        return res.status(400).json({ message: "Missing fields", missing: missingFields });

      if (typeof data.amount !== "number")
        return res.status(400).json({ message: "Amount must be a number" });

      const result = await collection.insertOne(data);
      return res.status(201).json({ message: "Contribution added", contribution: result });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
