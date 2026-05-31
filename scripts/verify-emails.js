import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const uri = process.env.MONGODB_URI;

async function main() {
  if (!uri) {
    console.error("Error: MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    console.log("Setting emailVerified: true for all registered users...");
    const result = await db.collection("users").updateMany(
      {},
      { $set: { emailVerified: true } }
    );

    console.log(`\n🎉 SUCCESS! Modified ${result.modifiedCount} user records.`);
    console.log("Account linking is now fully unlocked for your emails!");

  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await client.close();
  }
}

main();
