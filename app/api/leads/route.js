import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, interest, number } = body;

    if (!name || !email || !interest || !number) {
      return NextResponse.json(
        { error: "Name, email, interest, and phone number are required." },
        { status: 400 }
      );
    }

    const result = await db.collection("leads").insertOne({
      name,
      email,
      interest,
      number,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit lead. Please try again later." },
      { status: 500 }
    );
  }
}
