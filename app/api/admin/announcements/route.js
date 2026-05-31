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

// GET all announcements
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const announcements = await db.collection("announcements").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({
    announcements: announcements.map((a) => ({
      ...a,
      _id: a._id.toString(),
      batchId: a.batchId?.toString() || null,
      createdAt: a.createdAt?.toISOString(),
    })),
  });
}

// POST create
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, content, batchId, isPinned } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const result = await db.collection("announcements").insertOne({
    title,
    content,
    batchId: batchId ? new ObjectId(batchId) : null,
    isPinned: !!isPinned,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
