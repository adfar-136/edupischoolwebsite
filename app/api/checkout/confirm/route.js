import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
  }

  const { type, id } = await request.json();

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const userId = new ObjectId(session.user.id);

  try {
    if (type === "batch") {
      let batchId;
      try {
        batchId = new ObjectId(id);
      } catch {
        // Try finding by slug
        const batch = await db.collection("batches").findOne({ slug: id });
        if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });
        batchId = batch._id;
      }

      // Check if already enrolled
      const existing = await db.collection("enrollments").findOne({ userId, batchId });
      if (existing) {
        return NextResponse.json({ message: "Already enrolled", alreadyEnrolled: true });
      }

      await db.collection("enrollments").insertOne({
        userId,
        batchId,
        completedLectures: [],
        enrolledAt: new Date(),
      });

      return NextResponse.json({ success: true, message: "Successfully enrolled in batch!" });
    } else if (type === "masterclass") {
      const masterclassId = new ObjectId(id);

      // Check if already booked
      const existing = await db.collection("bookings").findOne({ userId, masterclassId });
      if (existing) {
        return NextResponse.json({ message: "Already booked", alreadyBooked: true });
      }

      await db.collection("bookings").insertOne({
        userId,
        masterclassId,
        bookedAt: new Date(),
      });

      return NextResponse.json({ success: true, message: "Successfully booked masterclass!" });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Checkout confirm error:", error);
    return NextResponse.json({ error: "Failed to complete enrollment. Please try again." }, { status: 500 });
  }
}
