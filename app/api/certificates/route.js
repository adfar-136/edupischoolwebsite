import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = new ObjectId(session.user.id);
  const certificates = await db
    .collection("certificates")
    .find({ userId })
    .sort({ issuedAt: -1 })
    .toArray();

  return NextResponse.json({
    certificates: certificates.map((c) => ({
      ...c,
      _id: c._id.toString(),
      userId: c.userId.toString(),
    })),
  });
}
