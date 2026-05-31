import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic") || "";
    const difficulty = searchParams.get("difficulty") || "";
    const search = searchParams.get("search") || "";

    const query = {};

    // Filter by topic if specified and not 'All'
    if (topic && topic !== "All") {
      // Direct string match. Let's make sure we support both Node.js/Node formats safely if needed.
      if (topic === "Node") {
        query.topic = "Node.js";
      } else {
        query.topic = topic;
      }
    }

    // Filter by difficulty if specified and not 'All'
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    // Filter by keyword search matching question or answer
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } }
      ];
    }

    const questions = await db.collection("questions").find(query).toArray();

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
