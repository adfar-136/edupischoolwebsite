import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lock, Clock, Calendar, Users, CheckCircle, ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

const FALLBACK_BATCHES = {
  "full-stack-development": {
    _id: "fsd",
    title: "Full Stack Development",
    slug: "full-stack-development",
    category: "FSD",
    description:
      "Master modern Full Stack development end-to-end. This 8-month batch covers React, Next.js, Node.js, Express, MongoDB, PostgreSQL, authentication, deployment, and production architecture. You will build 6 real projects — not toy apps.",
    fees: 8000,
    duration: 8,
    status: "active",
    highlights: [
      "React 19 & Next.js 15 App Router",
      "Node.js & Express REST APIs",
      "MongoDB & PostgreSQL databases",
      "JWT / OAuth Authentication",
      "CI/CD & Cloud Deployment",
      "Real production projects",
    ],
  },
  "data-structures-algorithms": {
    _id: "dsa",
    title: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    category: "DSA",
    description:
      "A 5-month structured journey through DSA — designed for interview preparation and genuine problem-solving mastery. We use pattern-based learning, not memorization. You will solve 200+ problems and participate in weekly mock interviews.",
    fees: 3000,
    duration: 5,
    status: "active",
    highlights: [
      "Arrays, Strings & Hashing",
      "Linked Lists, Trees & Graphs",
      "Dynamic Programming (DP)",
      "Greedy & Backtracking",
      "Mock Interview Sessions",
    ],
  },
};

const FALLBACK_LECTURES = {
  "full-stack-development": [
    { lectureNumber: 1, title: "Introduction to Full Stack & Modern Web", description: "Big picture overview, tools, environment setup." },
    { lectureNumber: 2, title: "React Fundamentals — JSX, Components, Props & State" },
    { lectureNumber: 3, title: "React Hooks Deep Dive — useState, useEffect, useRef, useContext" },
    { lectureNumber: 4, title: "Next.js App Router — Pages, Layouts, Loading States" },
    { lectureNumber: 5, title: "Server Components vs Client Components" },
    { lectureNumber: 6, title: "Node.js & Express — Building RESTful APIs" },
    { lectureNumber: 7, title: "MongoDB — Schemas, Queries, Aggregation" },
    { lectureNumber: 8, title: "Authentication — JWT & BetterAuth" },
    { lectureNumber: 9, title: "Connecting Frontend and Backend" },
    { lectureNumber: 10, title: "Deployment — Vercel, Railway, Docker Basics" },
  ],
  "data-structures-algorithms": [
    { lectureNumber: 1, title: "Arrays & Two Pointers Pattern" },
    { lectureNumber: 2, title: "Hashing & Frequency Maps" },
    { lectureNumber: 3, title: "Sliding Window Technique" },
    { lectureNumber: 4, title: "Binary Search & Its Variations" },
    { lectureNumber: 5, title: "Linked Lists — Traversal, Reversal, Merging" },
    { lectureNumber: 6, title: "Trees — BFS, DFS, Level Order" },
    { lectureNumber: 7, title: "Graphs — Adjacency, BFS/DFS, Union Find" },
    { lectureNumber: 8, title: "Dynamic Programming — Patterns & Memoization" },
    { lectureNumber: 9, title: "Greedy Algorithms & Intervals" },
    { lectureNumber: 10, title: "Mock Interview Round 1" },
  ],
};

async function getBatchData(slug) {
  try {
    const { db } = await import("@/lib/mongodb");
    const batch = await db.collection("batches").findOne({ slug });
    if (!batch) return null;
    const lectures = await db
      .collection("lectures")
      .find({ batchId: batch._id })
      .sort({ lectureNumber: 1 })
      .toArray();
    return {
      batch: { ...batch, _id: batch._id.toString() },
      lectures: lectures.map((l) => ({ ...l, _id: l._id.toString(), batchId: l.batchId.toString() })),
    };
  } catch {
    const batch = FALLBACK_BATCHES[slug];
    if (!batch) return null;
    return { batch, lectures: FALLBACK_LECTURES[slug] || [] };
  }
}

async function getUserEnrollment(batchId) {
  try {
    const { db } = await import("@/lib/mongodb");
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    const enrollment = await db.collection("enrollments").findOne({
      userId: new ObjectId(session.user.id),
      batchId: typeof batchId === "string" ? new ObjectId(batchId) : batchId,
    });
    return enrollment;
  } catch {
    return null;
  }
}

const CATEGORY_BAR = {
  FSD: "linear-gradient(90deg, #3B82F6, #6366F1)",
  DSA: "linear-gradient(90deg, #2D6A4F, #52B788)",
  GenAI: "linear-gradient(90deg, #F4A942, #D4891E)",
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBatchData(slug);
  if (!data) return { title: "Batch not found" };
  return {
    title: `${data.batch.title} — EdupiSchool`,
    description: data.batch.description,
  };
}

export default async function BatchDetailPage({ params }) {
  const { slug } = await params;
  const data = await getBatchData(slug);
  if (!data) notFound();

  const { batch, lectures } = data;
  const enrollment = await getUserEnrollment(batch._id);
  const isEnrolled = !!enrollment;

  const catBar = CATEGORY_BAR[batch.category] || CATEGORY_BAR["FSD"];

  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        style={{
          background: "var(--color-charcoal)",
          padding: "80px 0 64px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(244,169,66,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={14} />
            <Link href="/batches" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Batches</Link>
            <ChevronRight size={14} />
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{batch.title}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "48px", alignItems: "start" }}>
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "rgba(244,169,66,0.15)",
                  color: "var(--color-saffron)",
                  borderRadius: "50px",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "16px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {batch.category} Batch
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "20px",
                }}
              >
                {batch.title}
              </h1>

              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "600px" }}>
                {batch.description}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "28px" }}>
                {[
                  { icon: Clock, label: `${batch.duration} months duration` },
                  { icon: Calendar, label: "3 live sessions every week" },
                  { icon: Users, label: "Live + recorded sessions" },
                  { icon: BookOpen, label: `${lectures.length} lectures planned` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
                    <Icon size={14} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing card */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "20px",
                padding: "32px",
                minWidth: "280px",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "44px",
                  fontWeight: 800,
                  color: "var(--color-saffron)",
                  marginBottom: "4px",
                }}
              >
                ₹{batch.fees?.toLocaleString("en-IN")}
              </div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>
                One-time payment · Lifetime access
              </p>

              {isEnrolled ? (
                <div>
                  <div
                    style={{
                      padding: "12px 20px",
                      background: "rgba(45,106,79,0.2)",
                      border: "1px solid rgba(82,183,136,0.3)",
                      borderRadius: "50px",
                      textAlign: "center",
                      color: "#52B788",
                      fontWeight: 600,
                      fontSize: "14px",
                      marginBottom: "12px",
                    }}
                  >
                    ✓ Already Enrolled
                  </div>
                  <Link href="/dashboard" className="btn-forest" style={{ width: "100%", justifyContent: "center" }}>
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/checkout?type=batch&id=${batch._id}`}
                  className="btn-primary"
                  style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "14px 20px" }}
                >
                  Enroll Now <ArrowRight size={18} />
                </Link>
              )}

              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {["3 live sessions every week with Adfar", "Lifetime access to recordings", "Study resources & assignments", "Private student community"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
                    <CheckCircle size={13} color="#52B788" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {batch.highlights && (
        <section style={{ background: "white", borderBottom: "1px solid var(--color-cream-dark)", padding: "32px 0" }}>
          <div className="container" style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
            {batch.highlights.map((h) => (
              <div key={h} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500 }}>
                <CheckCircle size={14} color="var(--color-forest)" />
                <span style={{ color: "var(--color-charcoal)" }}>{h}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Curriculum */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>
            {/* Lectures list */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "32px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  color: "var(--color-charcoal)",
                }}
              >
                Curriculum Overview
              </h2>
              <p style={{ fontSize: "15px", color: "var(--color-muted)", marginBottom: "32px" }}>
                {isEnrolled
                  ? "You have full access to all lecture details and resources."
                  : "Lecture titles are visible to everyone. Full content unlocks after enrollment."}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {lectures.map((lecture, i) => (
                  <div
                    key={lecture._id || i}
                    style={{
                      padding: "18px 20px",
                      background: "white",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      border: "1px solid var(--color-cream-dark)",
                      transition: "border-color 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: catBar,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {lecture.lectureNumber}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: "15px", color: "var(--color-charcoal)", marginBottom: "2px" }}>
                        {lecture.title}
                      </p>
                      {isEnrolled && lecture.description ? (
                        <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>{lecture.description}</p>
                      ) : !isEnrolled ? (
                        <p style={{ fontSize: "12px", color: "var(--color-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Lock size={11} /> Enroll to access full details & resources
                        </p>
                      ) : null}
                    </div>

                    {!isEnrolled && (
                      <Lock size={16} color="var(--color-muted)" style={{ flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky sidebar CTA */}
            <div style={{ position: "sticky", top: "88px" }}>
              <div className="card" style={{ padding: "32px" }}>
                <div style={{ height: "4px", background: catBar, borderRadius: "4px", marginBottom: "24px" }} />
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
                  Ready to enroll?
                </h3>
                <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBottom: "24px" }}>
                  Join this batch and get live mentorship with 3 sessions every week by Adfar Rasheed.
                </p>

                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "36px",
                    fontWeight: 800,
                    color: "var(--color-charcoal)",
                    marginBottom: "20px",
                  }}
                >
                  ₹{batch.fees?.toLocaleString("en-IN")}
                </div>

                {isEnrolled ? (
                  <Link href="/dashboard" className="btn-forest" style={{ width: "100%", justifyContent: "center" }}>
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href={`/checkout?type=batch&id=${batch._id}`}
                    className="btn-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Enroll Now <ArrowRight size={16} />
                  </Link>
                )}

                <p style={{ fontSize: "12px", color: "var(--color-muted)", textAlign: "center", marginTop: "12px" }}>
                  Secure enrollment · Lifetime access
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
