import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

let db: any;

async function dbConnect() {
  if (!db) {
    await client.connect();
    db = client.db("testimonial-db");
  }
  console.log("client connected");
  return { db, client };
}

export default dbConnect;
