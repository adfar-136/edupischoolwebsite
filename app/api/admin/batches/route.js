import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";

async function requireAdmin(req) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const batches = await db.collection("batches").find({}).sort({ createdAt: -1 }).toArray();
  return NextResponse.json({ batches: batches.map((b) => ({ ...b, _id: b._id.toString() })) });
}

export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { title, slug, description, category, duration, fees, startDate, thumbnail, status, instructorName, instructorTitle } = body;

  if (!title || !slug || !category) {
    return NextResponse.json({ error: "Title, slug, and category are required" }, { status: 400 });
  }

  const existing = await db.collection("batches").findOne({ slug });
  if (existing) {
    return NextResponse.json({ error: "A batch with this slug already exists" }, { status: 409 });
  }

  const result = await db.collection("batches").insertOne({
    title,
    slug,
    description,
    category,
    duration: parseInt(duration) || 0,
    fees: parseInt(fees) || 0,
    startDate: startDate ? new Date(startDate) : null,
    thumbnail: thumbnail || "",
    status: status || "draft",
    instructorName: instructorName || "",
    instructorTitle: instructorTitle || "",
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true, id: result.insertedId.toString() }, { status: 201 });
}
