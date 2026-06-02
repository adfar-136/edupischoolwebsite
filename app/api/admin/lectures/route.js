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

  const lectures = await db.collection("lectures").find({}).sort({ scheduledAt: 1 }).toArray();
  const batches = await db.collection("batches").find({}).toArray();
  const modules = await db.collection("modules").find({}).sort({ createdAt: 1 }).toArray();

  const batchMap = {};
  batches.forEach((b) => { batchMap[b._id.toString()] = b.title; });

  return NextResponse.json({
    lectures: lectures.map((l) => ({
      ...l,
      _id: l._id.toString(),
      batchId: l.batchId.toString(),
      batchTitle: batchMap[l.batchId.toString()] || "Unknown",
      scheduledAt: l.scheduledAt?.toISOString(),
    })),
    batches: batches.map((b) => ({ _id: b._id.toString(), title: b.title, slug: b.slug })),
    modules: modules.map((m) => ({ _id: m._id.toString(), batchId: m.batchId?.toString(), name: m.name })),
  });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { batchId, lectureNumber, title, description, scheduledAt, joinLink, recordingLink, resources, completed, moduleName, notes } = body;

  if (!batchId || !title || !lectureNumber || !moduleName) {
    return NextResponse.json({ error: "batchId, lectureNumber, title and moduleName are required" }, { status: 400 });
  }

  // Verify that the module exists for this batch (handle batchId as either string or ObjectId)
  const moduleExists = await db.collection("modules").findOne({
    name: moduleName,
    $or: [
      { batchId: batchId },
      { batchId: new ObjectId(batchId) }
    ]
  });

  if (!moduleExists) {
    return NextResponse.json({ error: "The selected module does not exist for this batch. Please define it first." }, { status: 400 });
  }

  const result = await db.collection("lectures").insertOne({
    batchId: new ObjectId(batchId),
    lectureNumber: parseInt(lectureNumber),
    title,
    description: description || "",
    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    joinLink: joinLink || "",
    recordingLink: recordingLink || "",
    resources: resources || [],
    completed: completed || false,
    moduleName: moduleName || "",
    notes: notes || "",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
