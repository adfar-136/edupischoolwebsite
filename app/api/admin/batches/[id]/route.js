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

  const update = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.slug !== undefined) update.slug = body.slug;
  if (body.description !== undefined) update.description = body.description;
  if (body.category !== undefined) update.category = body.category;
  if (body.duration !== undefined) update.duration = parseInt(body.duration);
  if (body.fees !== undefined) update.fees = parseInt(body.fees);
  if (body.startDate !== undefined) update.startDate = body.startDate ? new Date(body.startDate) : null;
  if (body.thumbnail !== undefined) update.thumbnail = body.thumbnail;
  if (body.status !== undefined) update.status = body.status;
  if (body.instructorName !== undefined) update.instructorName = body.instructorName;
  if (body.instructorTitle !== undefined) update.instructorTitle = body.instructorTitle;
  update.updatedAt = new Date();

  await db.collection("batches").updateOne({ _id: new ObjectId(id) }, { $set: update });
  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.collection("batches").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}
