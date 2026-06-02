import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const moduleItem = await db.collection("modules").findOne({ _id: new ObjectId(id) });
    if (!moduleItem) return NextResponse.json({ error: "Module not found" }, { status: 404 });

    return NextResponse.json({ module: { ...moduleItem, _id: moduleItem._id.toString(), batchId: moduleItem.batchId?.toString() } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, batchId } = body;

    if (!name || !batchId) {
      return NextResponse.json({ error: "Module Name and Batch are required" }, { status: 400 });
    }

    await db.collection("modules").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, batchId, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    await db.collection("modules").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
