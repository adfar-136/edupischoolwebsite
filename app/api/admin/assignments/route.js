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

  const assignments = await db.collection("assignments").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({
    assignments: assignments.map((a) => ({
      ...a,
      _id: a._id.toString(),
      lectureId: a.lectureId.toString(),
      batchId: a.batchId?.toString(),
      deadline: a.deadline?.toISOString(),
    })),
  });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { lectureId, title, description, deadline } = await request.json();

  if (!lectureId || !title || !deadline) {
    return NextResponse.json({ error: "lectureId, title, and deadline are required" }, { status: 400 });
  }

  const lectureOid = new ObjectId(lectureId);
  const lecture = await db.collection("lectures").findOne({ _id: lectureOid });
  if (!lecture) return NextResponse.json({ error: "Lecture not found" }, { status: 404 });

  const result = await db.collection("assignments").insertOne({
    lectureId: lectureOid,
    batchId: lecture.batchId,
    title,
    description: description || "",
    deadline: new Date(deadline),
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
