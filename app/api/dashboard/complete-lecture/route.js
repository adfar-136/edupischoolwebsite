import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

function generateCertificateId(type, category) {
  const prefix = type === "masterclass" ? "EDUPI-MC" : `EDUPI-${(category || "COURSE").toUpperCase().slice(0, 5)}`;
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

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
    const updatedCompleted = (updated.completedLectures || []).map((id) => id.toString());

    // --- Auto-issue batch completion certificate ---
    let certificateIssued = false;
    if (!isCompleted) {
      // Only check when marking complete (not unchecking)
      const totalLectures = await db.collection("lectures").countDocuments({ batchId: batch._id });
      if (totalLectures > 0 && updatedCompleted.length >= totalLectures) {
        // Check if certificate already exists
        const existingCert = await db.collection("certificates").findOne({
          userId,
          type: "batch",
          courseId: batch._id,
        });

        if (!existingCert) {
          await db.collection("certificates").insertOne({
            userId,
            userName: session.user.name,
            userEmail: session.user.email,
            type: "batch",
            courseTitle: batch.title,
            courseId: batch._id,
            category: batch.category || "Course",
            certificateId: generateCertificateId("batch", batch.category),
            issuedAt: new Date(),
            issuedBy: "system",
          });
          certificateIssued = true;
        }
      }
    }

    return NextResponse.json({
      success: true,
      completedLectures: updatedCompleted,
      certificateIssued,
    });
  } catch (error) {
    console.error("Complete lecture error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
