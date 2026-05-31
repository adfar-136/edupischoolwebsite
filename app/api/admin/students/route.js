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

  const [users, batches, masterclasses, enrollments, bookings] = await Promise.all([
    db.collection("users").find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("batches").find({}).toArray(),
    db.collection("masterclasses").find({}).toArray(),
    db.collection("enrollments").find({}).toArray(),
    db.collection("bookings").find({}).toArray(),
  ]);

  const enrollmentsByUser = {};
  enrollments.forEach((e) => {
    const uid = e.userId.toString();
    if (!enrollmentsByUser[uid]) enrollmentsByUser[uid] = [];
    enrollmentsByUser[uid].push(e.batchId.toString());
  });

  const bookingsByUser = {};
  bookings.forEach((b) => {
    const uid = b.userId.toString();
    if (!bookingsByUser[uid]) bookingsByUser[uid] = [];
    bookingsByUser[uid].push(b.masterclassId.toString());
  });

  return NextResponse.json({
    users: users.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "student",
      createdAt: u.createdAt?.toISOString(),
      enrolledBatches: enrollmentsByUser[u._id.toString()] || [],
      bookedMasterclasses: bookingsByUser[u._id.toString()] || [],
    })),
    batches: batches.map((b) => ({ _id: b._id.toString(), title: b.title })),
    masterclasses: masterclasses.map((m) => ({ _id: m._id.toString(), topic: m.topic })),
  });
}

// POST: enroll or unenroll a student
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { action, userId, batchId, masterclassId } = await request.json();
  const userOid = new ObjectId(userId);

  if (batchId) {
    const batchOid = new ObjectId(batchId);
    if (action === "enroll") {
      const existing = await db.collection("enrollments").findOne({ userId: userOid, batchId: batchOid });
      if (!existing) {
        await db.collection("enrollments").insertOne({ userId: userOid, batchId: batchOid, completedLectures: [], enrolledAt: new Date() });
      }
    } else if (action === "unenroll") {
      await db.collection("enrollments").deleteOne({ userId: userOid, batchId: batchOid });
    }
  }

  if (masterclassId) {
    const mcOid = new ObjectId(masterclassId);
    if (action === "book") {
      const existing = await db.collection("bookings").findOne({ userId: userOid, masterclassId: mcOid });
      if (!existing) {
        await db.collection("bookings").insertOne({ userId: userOid, masterclassId: mcOid, bookedAt: new Date() });
      }
    } else if (action === "unbook") {
      await db.collection("bookings").deleteOne({ userId: userOid, masterclassId: mcOid });
    }
  }

  return NextResponse.json({ success: true });
}
