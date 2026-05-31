import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const doc = await db.collection("settings").findOne({ key: "socials" });
    if (!doc) {
      return NextResponse.json({
        instagram: "https://www.instagram.com/adfarsirofficial?igsh=ZGU2ZDVlOXlqbDdx&utm_source=qr",
        linkedin: "https://www.linkedin.com/in/adfar-rasheed/",
        youtube: "https://www.youtube.com/@adfar-rasheed",
        twitter: "https://twitter.com/adfarrasheed",
        customLinks: []
      });
    }
    return NextResponse.json(doc);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { instagram, linkedin, youtube, twitter, customLinks } = body;

    await db.collection("settings").updateOne(
      { key: "socials" },
      {
        $set: {
          instagram: instagram || "",
          linkedin: linkedin || "",
          youtube: youtube || "",
          twitter: twitter || "",
          customLinks: customLinks || []
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
