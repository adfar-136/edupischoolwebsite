import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const batchId = searchParams.get("batchId");
    
    let query = {};
    if (batchId) {
      query.batchId = batchId;
    }

    const modules = await db.collection("modules").find(query).sort({ createdAt: 1 }).toArray();
    const batches = await db.collection("batches").find({}).toArray();

    // Map batch titles
    const batchesMap = {};
    batches.forEach((b) => {
      batchesMap[b._id.toString()] = b.title;
    });

    const enriched = modules.map((m) => ({
      ...m,
      _id: m._id.toString(),
      batchId: m.batchId?.toString(),
      batchTitle: batchesMap[m.batchId?.toString()] || "Unknown Batch",
    }));

    return NextResponse.json({ modules: enriched, batches: batches.map(b => ({ ...b, _id: b._id.toString() })) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const { name, batchId } = body;

    if (!name || !batchId) {
      return NextResponse.json({ error: "Module Name and Batch are required" }, { status: 400 });
    }

    const result = await db.collection("modules").insertOne({
      name,
      batchId,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
