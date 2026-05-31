import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { BookOpen, Calendar, Bell, TrendingUp, ArrowRight, Clock, CheckCircle } from "lucide-react";

async function getDashboardData(userId) {
  const oid = new ObjectId(userId);

  const [enrollments, bookings, announcements] = await Promise.all([
    db.collection("enrollments").find({ userId: oid }).toArray(),
    db.collection("bookings").find({ userId: oid }).toArray(),
    db
      .collection("announcements")
      .find({ isPinned: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray(),
  ]);

  // Get batch details for each enrollment
  const batchIds = enrollments.map((e) => e.batchId);
  const batches = batchIds.length
    ? await db.collection("batches").find({ _id: { $in: batchIds } }).toArray()
    : [];

  // Get lecture counts
  const lectureData = await Promise.all(
    enrollments.map(async (enroll) => {
      const total = await db.collection("lectures").countDocuments({ batchId: enroll.batchId });
      return { batchId: enroll.batchId.toString(), total, completed: (enroll.completedLectures || []).length };
    })
  );

  // Get upcoming masterclasses booked
  const masterclassIds = bookings.map((b) => b.masterclassId);
  const masterclasses = masterclassIds.length
    ? await db
        .collection("masterclasses")
        .find({ _id: { $in: masterclassIds }, scheduledAt: { $gte: new Date() } })
        .sort({ scheduledAt: 1 })
        .limit(3)
        .toArray()
    : [];

  return {
    enrollments: enrollments.map((e) => ({ ...e, _id: e._id.toString(), userId: e.userId.toString(), batchId: e.batchId.toString() })),
    batches: batches.map((b) => ({ ...b, _id: b._id.toString() })),
    lectureData,
    masterclasses: masterclasses.map((m) => ({ ...m, _id: m._id.toString(), scheduledAt: m.scheduledAt?.toISOString() })),
    announcements: announcements.map((a) => ({ ...a, _id: a._id.toString(), createdAt: a.createdAt?.toISOString() })),
  };
}

export const metadata = {
  title: "Dashboard — EdupiSchool",
};

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { enrollments, batches, lectureData, masterclasses, announcements } = await getDashboardData(session.user.id);

  const now = new Date();

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 700,
            color: "var(--color-charcoal)",
            marginBottom: "6px",
          }}
        >
          Welcome back, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
          Here's your learning overview for today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "36px" }}>
        {[
          { label: "Enrolled Batches", value: enrollments.length, icon: BookOpen, color: "var(--color-saffron)" },
          { label: "Booked Masterclasses", value: masterclasses.length, icon: Calendar, color: "var(--color-forest)" },
          {
            label: "Total Lectures Completed",
            value: lectureData.reduce((acc, l) => acc + l.completed, 0),
            icon: CheckCircle,
            color: "#6366F1",
          },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                background: `rgba(${stat.color === "var(--color-saffron)" ? "244,169,66" : stat.color === "var(--color-forest)" ? "45,106,79" : "99,102,241"},0.1)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
        {/* Left: Enrolled Batches */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)" }}>
              My Batches
            </h2>
            <Link href="/batches" style={{ fontSize: "13px", color: "var(--color-saffron-dark)", textDecoration: "none", fontWeight: 600 }}>
              Browse more →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div
              style={{
                padding: "48px 32px",
                background: "white",
                borderRadius: "16px",
                border: "2px dashed var(--color-cream-dark)",
                textAlign: "center",
              }}
            >
              <BookOpen size={36} style={{ margin: "0 auto 16px", color: "var(--color-muted)" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
                No batches yet
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "14px", marginBottom: "20px" }}>
                Join a long-term batch to get started with your learning journey.
              </p>
              <Link href="/batches" className="btn-primary" style={{ fontSize: "14px" }}>
                Browse Batches <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {batches.map((batch) => {
                const enrollment = enrollments.find((e) => e.batchId === batch._id);
                const progress = lectureData.find((l) => l.batchId === batch._id);
                const pct = progress?.total ? Math.round((progress.completed / progress.total) * 100) : 0;

                return (
                  <div key={batch._id} className="card" style={{ padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <div>
                        <span className="badge badge-saffron" style={{ marginBottom: "8px", display: "inline-block" }}>{batch.category}</span>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)" }}>
                          {batch.title}
                        </h3>
                      </div>
                      <Link
                        href={`/dashboard/batches/${batch.slug}`}
                        className="btn-primary"
                        style={{ padding: "8px 16px", fontSize: "13px" }}
                      >
                        Continue <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>
                          {progress?.completed || 0} of {progress?.total || 0} lectures
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-saffron-dark)" }}>{pct}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Upcoming masterclasses */}
          {masterclasses.length > 0 && (
            <div style={{ marginTop: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "20px" }}>
                Upcoming Masterclasses
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {masterclasses.map((mc) => {
                  const scheduled = new Date(mc.scheduledAt);
                  const diffMs = scheduled - now;
                  const diffMins = diffMs / 60000;
                  const showJoin = diffMins <= 30 && diffMins >= -180; // 30 mins before to 3h after

                  return (
                    <div key={mc._id} className="card" style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <div>
                        <h4 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                          {mc.topic}
                        </h4>
                        <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--color-muted)" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Calendar size={11} />
                            {scheduled.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <Clock size={11} />
                            {scheduled.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                      {showJoin && mc.joinLink ? (
                        <a
                          href={mc.joinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-forest"
                          style={{ padding: "8px 16px", fontSize: "13px", animation: "pulse 2s infinite", flexShrink: 0 }}
                        >
                          🔴 Join Live
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--color-muted)", flexShrink: 0 }}>Not live yet</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Announcements */}
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "20px" }}>
            Announcements
          </h2>

          {announcements.length === 0 ? (
            <div style={{ padding: "32px", background: "white", borderRadius: "16px", border: "1px solid var(--color-cream-dark)", textAlign: "center" }}>
              <Bell size={28} style={{ margin: "0 auto 12px", color: "var(--color-muted)", display: "block" }} />
              <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>No announcements yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {announcements.map((ann) => (
                <div key={ann._id} className="announcement-pinned">
                  {ann.batchId && (
                    <span className="badge badge-saffron" style={{ fontSize: "10px", marginBottom: "6px", display: "inline-block" }}>
                      Batch Announcement
                    </span>
                  )}
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: "var(--color-charcoal)" }}>
                    {ann.title}
                  </h4>
                  <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)", lineHeight: 1.6 }}>{ann.content}</p>
                  <p style={{ fontSize: "11px", color: "var(--color-muted)", marginTop: "8px" }}>
                    {new Date(ann.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
