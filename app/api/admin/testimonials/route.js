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

  const testimonials = await db.collection("testimonials").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ testimonials: testimonials.map((t) => ({ ...t, _id: t._id.toString() })) });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { name, location, text, avatar, batch, rating, status } = body;

  if (!name || !text) {
    return NextResponse.json({ error: "Name and Text are required" }, { status: 400 });
  }

  const result = await db.collection("testimonials").insertOne({
    name,
    location: location || "",
    text,
    avatar: avatar || "",
    batch: batch || "",
    rating: parseInt(rating) || 5,
    status: status || "published",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
