import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

export const metadata = { title: "My Batches — EdupiSchool Dashboard" };

async function getEnrolledBatches(userId) {
  try {
    const oid = new ObjectId(userId);
    const enrollments = await db.collection("enrollments").find({ userId: oid }).toArray();
    const batchIds = enrollments.map((e) => e.batchId);
    if (!batchIds.length) return [];

    const batches = await db.collection("batches").find({ _id: { $in: batchIds } }).toArray();
    const lectureData = await Promise.all(
      enrollments.map(async (enroll) => {
        const total = await db.collection("lectures").countDocuments({ batchId: enroll.batchId });
        return { batchId: enroll.batchId.toString(), total, completed: (enroll.completedLectures || []).length };
      })
    );

    return batches.map((b) => {
      const lData = lectureData.find((l) => l.batchId === b._id.toString());
      return {
        ...b,
        _id: b._id.toString(),
        total: lData?.total || 0,
        completed: lData?.completed || 0,
      };
    });
  } catch {
    return [];
  }
}

const CATEGORY_BAR = {
  FSD: "linear-gradient(90deg, #3B82F6, #6366F1)",
  DSA: "linear-gradient(90deg, #2D6A4F, #52B788)",
  GenAI: "linear-gradient(90deg, #F4A942, #D4891E)",
};

export default async function DashboardBatchesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const batches = await getEnrolledBatches(session.user.id);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px" }}>
            My Batches
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
            {batches.length} batch{batches.length !== 1 ? "es" : ""} enrolled.
          </p>
        </div>
        <Link href="/batches" className="btn-secondary" style={{ fontSize: "14px", padding: "10px 20px" }}>
          Browse More Batches <ArrowRight size={14} />
        </Link>
      </div>

      {batches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 32px", background: "white", borderRadius: "20px", border: "2px dashed var(--color-cream-dark)" }}>
          <BookOpen size={40} style={{ margin: "0 auto 16px", color: "var(--color-muted)", display: "block" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "8px" }}>No batches yet</h3>
          <p style={{ color: "var(--color-muted)", fontSize: "15px", marginBottom: "20px" }}>
            Join a long-term batch to get access to live lectures, recordings, and mentorship.
          </p>
          <Link href="/batches" className="btn-primary" style={{ display: "inline-flex" }}>
            Browse Batches <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
          {batches.map((batch) => {
            const pct = batch.total ? Math.round((batch.completed / batch.total) * 100) : 0;
            const catBar = CATEGORY_BAR[batch.category] || CATEGORY_BAR["FSD"];

            return (
              <div key={batch._id} className="card">
                <div style={{ height: "6px", background: catBar }} />
                <div style={{ padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <span className="badge badge-saffron">{batch.category}</span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: pct === 100 ? "var(--color-forest)" : "var(--color-muted)" }}>
                      {pct}% complete
                    </span>
                  </div>

                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "8px" }}>
                    {batch.title}
                  </h2>

                  <p style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                    {batch.description}
                  </p>

                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--color-muted)", marginBottom: "20px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={11} /> {batch.duration} months
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <BookOpen size={11} /> {batch.completed}/{batch.total} lectures
                    </span>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/batches/${batch.slug}`}
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    {pct === 0 ? "Start Learning" : pct === 100 ? "Review" : "Continue"} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
