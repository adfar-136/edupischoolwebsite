import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { Bell, Pin } from "lucide-react";

export const metadata = { title: "Announcements — EdupiSchool Dashboard" };

async function getAnnouncements(userId) {
  try {
    const oid = new ObjectId(userId);
    const enrollments = await db.collection("enrollments").find({ userId: oid }).toArray();
    const batchIds = enrollments.map((e) => e.batchId);

    const query = batchIds.length
      ? { $or: [{ batchId: null }, { batchId: { $in: batchIds } }] }
      : { batchId: null };

    const announcements = await db
      .collection("announcements")
      .find(query)
      .sort({ isPinned: -1, createdAt: -1 })
      .toArray();

    const batches = batchIds.length
      ? await db.collection("batches").find({ _id: { $in: batchIds } }).toArray()
      : [];
    const batchMap = {};
    batches.forEach((b) => { batchMap[b._id.toString()] = b.title; });

    return announcements.map((a) => ({
      ...a,
      _id: a._id.toString(),
      batchId: a.batchId?.toString() || null,
      batchTitle: a.batchId ? (batchMap[a.batchId.toString()] || "Your Batch") : null,
      createdAt: a.createdAt?.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function DashboardAnnouncementsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const announcements = await getAnnouncements(session.user.id);

  const pinned = announcements.filter((a) => a.isPinned);
  const rest = announcements.filter((a) => !a.isPinned);

  return (
    <div className="dashboard-container">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px" }}>
          Announcements
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
          {announcements.length === 0 ? "No announcements yet." : `${announcements.length} announcement${announcements.length !== 1 ? "s" : ""} for you.`}
        </p>
      </div>

      {announcements.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 32px", background: "white", borderRadius: "20px", border: "2px dashed var(--color-cream-dark)" }}>
          <Bell size={40} style={{ margin: "0 auto 16px", color: "var(--color-muted)", display: "block" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "8px" }}>No announcements</h3>
          <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
            Adfar will post updates here. Check back soon!
          </p>
        </div>
      ) : (
        <>
          {pinned.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Pin size={16} color="var(--color-saffron-dark)" /> Pinned
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pinned.map((ann) => (
                  <AnnouncementCard key={ann._id} ann={ann} />
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "14px" }}>
                All Announcements
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {rest.map((ann) => (
                  <AnnouncementCard key={ann._id} ann={ann} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AnnouncementCard({ ann }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "14px",
        padding: "20px 24px",
        borderLeft: ann.isPinned ? "4px solid var(--color-saffron)" : "4px solid transparent",
        border: "1px solid var(--color-cream-dark)",
        borderLeftWidth: ann.isPinned ? "4px" : "1px",
      }}
    >
      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        {ann.isPinned && <span className="badge badge-saffron">📌 Pinned</span>}
        {ann.batchTitle ? (
          <span className="badge badge-forest">{ann.batchTitle}</span>
        ) : (
          <span className="badge" style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5" }}>Global</span>
        )}
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "8px" }}>
        {ann.title}
      </h3>
      <p style={{ fontSize: "14px", color: "var(--color-charcoal-light)", lineHeight: 1.7 }}>{ann.content}</p>
      <p style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "12px" }}>
        {ann.createdAt ? new Date(ann.createdAt).toLocaleString("en-IN", { month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
      </p>
    </div>
  );
}
