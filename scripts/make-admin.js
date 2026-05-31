const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const path = require("path");

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node scripts/make-admin.js <email>");
  process.exit(1);
}

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully.");
    const db = client.db();
    
    // Find the user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      console.error(`Error: User with email "${email}" not found. Please sign up first on the website!`);
      process.exit(1);
    }
    
    // Update role
    const result = await db.collection("users").updateOne(
      { email },
      { $set: { role: "admin" } }
    );
    
    if (result.modifiedCount === 1) {
      console.log(`Success! User "${email}" has been successfully promoted to "admin"!`);
    } else {
      console.log(`User "${email}" already has "admin" role or could not be updated.`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await client.close();
  }
}

main();
