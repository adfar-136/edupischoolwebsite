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
  if (body.title !== undefined) update.title = body.title;
  if (body.content !== undefined) update.content = body.content;
  if (body.isPinned !== undefined) update.isPinned = body.isPinned;
  if (body.batchId !== undefined) update.batchId = body.batchId ? new ObjectId(body.batchId) : null;

  await db.collection("announcements").updateOne({ _id: new ObjectId(id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.collection("announcements").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
