import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const uri = process.env.MONGODB_URI;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const email = process.argv[2] || "admin@edupischool.com";
const password = process.argv[3] || "AdminAdfar2026!";
const name = "Adfar Rasheed (Admin)";

async function main() {
  console.log(`Attempting to create admin account: ${email}`);
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      console.log(`User ${email} already exists in database. Promoting to admin directly...`);
      const result = await db.collection("users").updateOne(
        { email },
        { $set: { role: "admin" } }
      );
      console.log("Success! Account is fully active as Admin.");
      return;
    }

    // Initialize temporary better-auth instance for password hashing & account linking
    const tempAuth = betterAuth({
      database: mongodbAdapter(db, {
        client,
        usePlural: true,
      }),
      emailAndPassword: {
        enabled: true,
      },
      baseURL: appUrl,
    });

    // Call better-auth API to sign up the user securely
    await tempAuth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    // Promote user to admin role
    await db.collection("users").updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    console.log("\n=============================================");
    console.log("🎉 ADMIN ACCOUNT SUCCESSFULLY CREATED!");
    console.log("=============================================");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log("Role:     admin");
    console.log("=============================================");
    console.log("You can now log in on your website using these credentials!");

  } catch (error) {
    console.error("An error occurred during admin creation:", error);
  } finally {
    await client.close();
  }
}

main();
