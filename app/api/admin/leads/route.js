import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const leads = await db
      .collection("leads")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      leads: leads.map((l) => ({
        ...l,
        _id: l._id.toString(),
        createdAt: l.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Fetch leads error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
