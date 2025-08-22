import { MongoClient } from "mongodb";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment");
  }

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("sopnochari");

  cachedClient = client;
  cachedDb = db;

  console.log("✅ MongoDB connected");

  return { client, db };
}
