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

export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  const update = { updatedAt: new Date() };
  const fields = ["title", "description", "lectureNumber", "joinLink", "recordingLink", "resources", "completed", "moduleName", "notes"];
  fields.forEach((f) => { if (body[f] !== undefined) update[f] = body[f]; });
  if (body.batchId) update.batchId = new ObjectId(body.batchId);
  if (body.scheduledAt) update.scheduledAt = new Date(body.scheduledAt);

  await db.collection("lectures").updateOne({ _id: new ObjectId(id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.collection("lectures").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
