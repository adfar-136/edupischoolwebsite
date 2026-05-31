import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db, client } from "./mongodb";

// Use BETTER_AUTH_URL (server-only, not baked into client bundle)
// Falls back to NEXT_PUBLIC_APP_URL then localhost
let appUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";
if (appUrl.endsWith("/")) {
  appUrl = appUrl.slice(0, -1);
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    usePlural: true, // Uses plural collection names (users, sessions, accounts)
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: false, // Disables setting this field directly during register
      },
    },
  },
  baseURL: appUrl,
  trustHost: true,
  trustedOrigins: [
    "https://edupischool.in",
    "https://www.edupischool.in",
    "http://localhost:3000",
    appUrl,
  ].filter(Boolean),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
});
