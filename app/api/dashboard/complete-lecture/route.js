import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { batchSlug, lectureId } = await request.json();
  const userId = new ObjectId(session.user.id);

  try {
    const batch = await db.collection("batches").findOne({ slug: batchSlug });
    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    const enrollment = await db.collection("enrollments").findOne({ userId, batchId: batch._id });
    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    const lectureOid = new ObjectId(lectureId);
    const completedIds = (enrollment.completedLectures || []).map((id) => id.toString());
    const isCompleted = completedIds.includes(lectureId);

    // Toggle: add or remove from completedLectures
    let update;
    if (isCompleted) {
      update = { $pull: { completedLectures: lectureOid } };
    } else {
      update = { $addToSet: { completedLectures: lectureOid } };
    }

    await db.collection("enrollments").updateOne({ _id: enrollment._id }, update);

    // Return updated list as strings
    const updated = await db.collection("enrollments").findOne({ _id: enrollment._id });
    return NextResponse.json({
      success: true,
      completedLectures: (updated.completedLectures || []).map((id) => id.toString()),
    });
  } catch (error) {
    console.error("Complete lecture error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
