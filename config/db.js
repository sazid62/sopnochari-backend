import { MongoClient } from "mongodb";

let contributionsCollection;

export async function connectDB() {
  if (!contributionsCollection) {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db("sopnochari");
    contributionsCollection = db.collection("contributions");
    console.log("✅ MongoDB connected");
  }
  return contributionsCollection;
}

export function getContributionsCollection() {
  if (!contributionsCollection) throw new Error("DB not connected");
  return contributionsCollection;
}
