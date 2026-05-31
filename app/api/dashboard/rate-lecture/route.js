import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function POST(request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { lectureId, rating, comment } = await request.json();
    
    if (!lectureId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const userId = new ObjectId(session.user.id);
    const lecObjectId = new ObjectId(lectureId);

    // Upsert rating (user can update their previous rating/comment)
    await db.collection("ratings").updateOne(
      { userId, lectureId: lecObjectId },
      {
        $set: {
          rating,
          comment: comment || "",
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, rating, comment });
  } catch (error) {
    console.error("Lecture rating error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
