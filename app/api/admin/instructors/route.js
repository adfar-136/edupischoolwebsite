import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const instructors = await db.collection("instructors").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ instructors: instructors.map((i) => ({ ...i, _id: i._id.toString() })) });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { name, title, bio, image, github, linkedin, twitter, instagram, youtube } = body;

  if (!name || !title) {
    return NextResponse.json({ error: "Name and Title are required" }, { status: 400 });
  }

  const result = await db.collection("instructors").insertOne({
    name,
    title,
    bio: bio || "",
    image: image || "",
    github: github || "",
    linkedin: linkedin || "",
    twitter: twitter || "",
    instagram: instagram || "",
    youtube: youtube || "",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
