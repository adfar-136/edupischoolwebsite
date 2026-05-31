import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") return null;
  return session;
}

function generateCertificateId(type, category) {
  const prefix = type === "masterclass" ? "EDUPI-MC" : `EDUPI-${(category || "COURSE").toUpperCase().slice(0, 5)}`;
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

// GET: All certificates (admin view)
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const certificates = await db
    .collection("certificates")
    .find({})
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

// POST: Issue a masterclass certificate to a user
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, masterclassId } = await request.json();
  if (!userId || !masterclassId) {
    return NextResponse.json({ error: "userId and masterclassId are required" }, { status: 400 });
  }

  const userOid = new ObjectId(userId);
  const mcOid = new ObjectId(masterclassId);

  // Fetch user and masterclass details
  const [user, masterclass] = await Promise.all([
    db.collection("users").findOne({ _id: userOid }),
    db.collection("masterclasses").findOne({ _id: mcOid }),
  ]);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!masterclass) return NextResponse.json({ error: "Masterclass not found" }, { status: 404 });

  // Prevent duplicate
  const existing = await db.collection("certificates").findOne({
    userId: userOid,
    type: "masterclass",
    courseId: mcOid,
  });
  if (existing) {
    return NextResponse.json({ error: "Certificate already issued" }, { status: 409 });
  }

  const cert = {
    userId: userOid,
    userName: user.name,
    userEmail: user.email,
    type: "masterclass",
    courseTitle: masterclass.topic,
    courseId: mcOid,
    category: "Masterclass",
    certificateId: generateCertificateId("masterclass", null),
    issuedAt: new Date(),
    issuedBy: "admin",
  };

  await db.collection("certificates").insertOne(cert);
  return NextResponse.json({ success: true, certificateId: cert.certificateId });
}

// DELETE: Revoke a certificate by its certificateId string
export async function DELETE(request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { certificateId } = await request.json();
  if (!certificateId) return NextResponse.json({ error: "certificateId required" }, { status: 400 });

  await db.collection("certificates").deleteOne({ certificateId });
  return NextResponse.json({ success: true });
}
