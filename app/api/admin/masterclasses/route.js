import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const masterclasses = await db.collection("masterclasses").find({}).sort({ scheduledAt: -1 }).toArray();
  return NextResponse.json({
    masterclasses: masterclasses.map((m) => ({
      ...m,
      _id: m._id.toString(),
      scheduledAt: m.scheduledAt?.toISOString(),
    })),
  });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { topic, description, scheduledAt, price, joinLink, recordingLink } = await request.json();

  if (!topic || !scheduledAt) {
    return NextResponse.json({ error: "Topic and scheduledAt are required" }, { status: 400 });
  }

  const result = await db.collection("masterclasses").insertOne({
    topic,
    description: description || "",
    scheduledAt: new Date(scheduledAt),
    price: parseInt(price) || 199,
    joinLink: joinLink || "",
    recordingLink: recordingLink || "",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
