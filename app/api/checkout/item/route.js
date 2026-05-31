import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  try {
    let item;
    if (type === "batch") {
      // Allow looking up by ObjectId or string slug/id
      let query;
      try {
        query = { _id: new ObjectId(id) };
      } catch {
        query = { slug: id };
      }
      item = await db.collection("batches").findOne(query);
    } else if (type === "masterclass") {
      item = await db.collection("masterclasses").findOne({ _id: new ObjectId(id) });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...item,
      _id: item._id.toString(),
      scheduledAt: item.scheduledAt?.toISOString?.() ?? item.scheduledAt,
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
