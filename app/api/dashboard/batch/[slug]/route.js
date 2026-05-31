import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function GET(request, { params }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const userId = new ObjectId(session.user.id);

  try {
    const batch = await db.collection("batches").findOne({ slug });
    if (!batch) return NextResponse.json({ error: "Batch not found" }, { status: 404 });

    const enrollment = await db.collection("enrollments").findOne({ userId, batchId: batch._id });
    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    const lectures = await db
      .collection("lectures")
      .find({ batchId: batch._id })
      .sort({ lectureNumber: 1 })
      .toArray();

    // Get assignments for each lecture
    const lectureIds = lectures.map((l) => l._id);
    const assignments = lectureIds.length
      ? await db.collection("assignments").find({ lectureId: { $in: lectureIds } }).toArray()
      : [];

    const assignmentMap = {};
    assignments.forEach((a) => {
      assignmentMap[a.lectureId.toString()] = a;
    });

    // Get ratings given by user for these lectures
    const ratings = lectureIds.length
      ? await db.collection("ratings").find({ userId, lectureId: { $in: lectureIds } }).toArray()
      : [];

    const ratingsMap = {};
    ratings.forEach((r) => {
      ratingsMap[r.lectureId.toString()] = {
        rating: r.rating,
        comment: r.comment || "",
      };
    });

    // Batch-specific announcements
    const announcements = await db
      .collection("announcements")
      .find({ $or: [{ batchId: batch._id }, { batchId: null }], isPinned: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      batch: { ...batch, _id: batch._id.toString() },
      lectures: lectures.map((l) => ({
        ...l,
        _id: l._id.toString(),
        batchId: l.batchId.toString(),
        scheduledAt: l.scheduledAt?.toISOString(),
        assignment: assignmentMap[l._id.toString()]
          ? {
              ...assignmentMap[l._id.toString()],
              _id: assignmentMap[l._id.toString()]._id.toString(),
              deadline: assignmentMap[l._id.toString()].deadline?.toISOString(),
            }
          : null,
      })),
      enrollment: {
        ...enrollment,
        _id: enrollment._id.toString(),
        completedLectures: (enrollment.completedLectures || []).map((id) => id.toString()),
      },
      ratings: ratingsMap,
      announcements: announcements.map((a) => ({
        ...a,
        _id: a._id.toString(),
        batchId: a.batchId?.toString(),
        createdAt: a.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Batch fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
