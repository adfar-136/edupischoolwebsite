import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Clock, Calendar, Users, BookOpen } from "lucide-react";

const CATEGORY_COLORS = {
  FSD: { bg: "rgba(59,130,246,0.1)", text: "#1D4ED8", bar: "linear-gradient(90deg, #3B82F6, #6366F1)" },
  DSA: { bg: "rgba(45,106,79,0.1)", text: "#2D6A4F", bar: "linear-gradient(90deg, #2D6A4F, #52B788)" },
  GenAI: { bg: "rgba(244,169,66,0.15)", text: "#D4891E", bar: "linear-gradient(90deg, #F4A942, #D4891E)" },
  DataAnalytics: { bg: "rgba(13,148,136,0.1)", text: "#0F766E", bar: "linear-gradient(90deg, #0D9488, #14B8A6)" },
  DataScience: { bg: "rgba(124,58,237,0.1)", text: "#6D28D9", bar: "linear-gradient(90deg, #7C3AED, #A78BFA)" },
  Fundamentals: { bg: "rgba(225,29,72,0.1)", text: "#BE123C", bar: "linear-gradient(90deg, #E11D48, #F43F5E)" },
  CyberSecurity: { bg: "rgba(217,119,6,0.1)", text: "#B45309", bar: "linear-gradient(90deg, #D97706, #F59E0B)" },
};

const FALLBACK_BATCHES = [
  {
    _id: "fsd",
    title: "Full Stack Development",
    slug: "full-stack-development",
    category: "FSD",
    description:
      "Master modern Full Stack development with React, Next.js, Node.js, Express, MongoDB, and cloud deployment. Build 6+ production-grade applications over 8 months with 3 live sessions every week.",
    fees: 8000,
    duration: 8,
    status: "active",
    highlights: ["React & Next.js 15", "Node.js & REST APIs", "MongoDB & PostgreSQL", "Auth & Deployment"],
  },
  {
    _id: "dsa",
    title: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    category: "DSA",
    description:
      "A structured, pattern-based approach to DSA — from arrays and linked lists all the way to dynamic programming and system design. Built for both interview prep and genuine problem-solving mastery.",
    fees: 3000,
    duration: 5,
    status: "active",
    highlights: ["Arrays, Trees & Graphs", "Dynamic Programming", "Interview Pattern Mastery", "Mock Interviews"],
  },
];

async function getBatches() {
  try {
    const { db } = await import("@/lib/mongodb");
    const batches = await db.collection("batches").find({}).sort({ createdAt: -1 }).toArray();
    return batches.map((b) => ({ ...b, _id: b._id.toString() }));
  } catch {
    return FALLBACK_BATCHES;
  }
}

export const metadata = {
  title: "Batches — EdupiSchool",
  description: "Browse all live batches in Full Stack Development and DSA by Adfar Rasheed.",
};

export default async function BatchesPage({ searchParams }) {
  const batches = await getBatches();
  const params = await searchParams;
  const activeCategory = params?.category || "All";
  const categories = ["All", "FSD", "DSA", "GenAI", "DataAnalytics", "DataScience", "Fundamentals", "CyberSecurity"];

  const upcomingBatch = batches.find((b) => {
    if (!b.startDate || b.status !== "active") return false;
    const start = new Date(b.startDate);
    const diffTime = start.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= -2 && diffDays <= 12;
  });

  const filtered =
    activeCategory === "All" ? batches : batches.filter((b) => b.category === activeCategory);

  return (
    <>
      <Navbar />

      {/* Page header */}
      <section
        style={{
          background: "var(--color-charcoal)",
          padding: "72px 0 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 30% 50%, rgba(244,169,66,0.1) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(244,169,66,0.15)",
              color: "var(--color-saffron)",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Long-Term Batches
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "white",
              marginBottom: "16px",
            }}
          >
            Choose Your Learning Path
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", maxWidth: "520px" }}>
            3 live sessions every week, real projects, lifetime access to recordings. Learn with a community from Kashmir.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section style={{ background: "var(--color-cream)", borderBottom: "1px solid var(--color-cream-dark)", padding: "20px 0" }}>
        <div className="container" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={cat === "All" ? "/batches" : `/batches?category=${cat}`}
              style={{
                padding: "8px 20px",
                borderRadius: "50px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                border: "2px solid",
                transition: "all 0.2s ease",
                background: activeCategory === cat ? "var(--color-charcoal)" : "transparent",
                color: activeCategory === cat ? "white" : "var(--color-charcoal)",
                borderColor: activeCategory === cat ? "var(--color-charcoal)" : "var(--color-cream-dark)",
              }}
            >
              {cat === "All"
                ? "All Batches"
                : cat === "FSD"
                ? "Full Stack Dev"
                : cat === "DSA"
                ? "DSA"
                : cat === "GenAI"
                ? "Generative AI"
                : cat === "DataAnalytics"
                ? "Data Analytics"
                : cat === "DataScience"
                ? "Data Science"
                : cat === "Fundamentals"
                ? "Fundamentals"
                : cat === "CyberSecurity"
                ? "Cyber Security"
                : cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Batches grid */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          {/* Dynamic Upcoming Batch Banner managed by Admin via startDate */}
          {upcomingBatch && (activeCategory === "All" || activeCategory === upcomingBatch.category) && (
            <div
              style={{
                background: "linear-gradient(135deg, var(--color-saffron) 0%, #D4891E 100%)",
                borderRadius: "16px",
                padding: "28px 32px",
                marginBottom: "40px",
                boxShadow: "var(--shadow-card-hover)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  bottom: "-20px",
                  fontSize: "120px",
                  opacity: 0.08,
                  userSelect: "none",
                  pointerEvents: "none"
                }}
              >
                🌸
              </div>
              <div style={{ position: "relative", zIndex: 1, maxWidth: "560px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    background: "var(--color-charcoal)",
                    color: "white",
                    borderRadius: "50px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    marginBottom: "12px"
                  }}
                >
                  🚀 New Batch Starting Next Week!
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "var(--color-charcoal)",
                    marginBottom: "8px"
                  }}
                >
                  New {upcomingBatch.title} Batch Starting Soon!
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(28,28,28,0.85)", lineHeight: 1.6 }}>
                  Class starts on {new Date(upcomingBatch.startDate).toLocaleDateString("en-IN", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}. Enrollments are closing fast — secure your seat today!
                </p>
              </div>
              <Link
                href={`/batches/${upcomingBatch.slug}`}
                style={{
                  padding: "12px 28px",
                  background: "var(--color-charcoal)",
                  color: "white",
                  borderRadius: "50px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease",
                  position: "relative",
                  zIndex: 1
                }}
              >
                Secure Your Seat <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--color-muted)" }}>
              <BookOpen size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
              <p style={{ fontSize: "18px" }}>No batches found in this category.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "28px" }}>
              {filtered.map((batch) => {
                const catColors = CATEGORY_COLORS[batch.category] || CATEGORY_COLORS["FSD"];
                const statusLabel = batch.status === "active" ? "Enrolling Now" : batch.status === "draft" ? "Coming Soon" : "Completed";
                const statusBg = batch.status === "active" ? "rgba(45,106,79,0.1)" : batch.status === "draft" ? "rgba(244,169,66,0.1)" : "rgba(100,100,100,0.1)";
                const statusColor = batch.status === "active" ? "#2D6A4F" : batch.status === "draft" ? "#D4891E" : "#6B7280";

                const isUpcoming = batch.startDate && (() => {
                  const start = new Date(batch.startDate);
                  const diffTime = start.getTime() - new Date().getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays >= -2 && diffDays <= 12;
                })();

                return (
                  <div
                    key={batch._id}
                    className="card"
                    style={
                      isUpcoming
                        ? {
                            border: "2px solid var(--color-saffron)",
                            boxShadow: "0 12px 40px rgba(244,169,66,0.18)",
                            position: "relative",
                          }
                        : {}
                    }
                  >
                    <div style={{ height: "6px", background: catColors.bar }} />
                    <div style={{ padding: "32px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                        <span className="badge" style={{ background: catColors.bg, color: catColors.text }}>
                          {batch.category}
                        </span>
                        {isUpcoming ? (
                          <span className="badge badge-saffron" style={{ animation: "pulse 2s ease-in-out infinite" }}>
                            🔥 Starting Next Week!
                          </span>
                        ) : (
                          <span
                            style={{
                              padding: "4px 10px",
                              background: statusBg,
                              color: statusColor,
                              borderRadius: "50px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            {statusLabel}
                          </span>
                        )}
                      </div>

                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "24px",
                          fontWeight: 700,
                          marginBottom: "4px",
                          color: "var(--color-charcoal)",
                        }}
                      >
                        {batch.title}
                      </h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)", marginBottom: "16px" }}>
                        <span style={{ fontWeight: 600 }}>Taught by:</span>
                        <span>{batch.instructorName || "Adfar Rasheed"}</span>
                      </div>
                      <p style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.7, marginBottom: "20px" }}>
                        {batch.description}
                      </p>

                      {/* Highlights */}
                      {batch.highlights && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                            marginBottom: "24px",
                          }}
                        >
                          {batch.highlights.map((h) => (
                            <div key={h} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-charcoal-light)" }}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: catColors.text, flexShrink: 0 }} />
                              {h}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Meta info */}
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          padding: "16px",
                          background: "var(--color-cream)",
                          borderRadius: "12px",
                          marginBottom: "24px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
                          <Clock size={13} />
                          {batch.duration} months
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
                          <Calendar size={13} />
                          3 sessions/week
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
                          <Users size={13} />
                          Live + Recording
                        </div>
                      </div>

                      {isUpcoming && (
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--color-saffron-dark)",
                            background: "rgba(244,169,66,0.08)",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            textAlign: "center",
                            border: "1px dashed rgba(244,169,66,0.3)"
                          }}
                        >
                          🚨 New Batch starting next week on {new Date(batch.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}! Enrollments closing soon.
                        </div>
                      )}

                      {/* Price & CTA */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "32px",
                              fontWeight: 800,
                              color: "var(--color-charcoal)",
                            }}
                          >
                            ₹{batch.fees?.toLocaleString("en-IN")}
                          </span>
                          <span style={{ fontSize: "13px", color: "var(--color-muted)", marginLeft: "6px" }}>entire batch</span>
                        </div>
                        <Link
                          href={`/batches/${batch.slug}`}
                          className="btn-primary"
                          style={{ padding: "10px 22px", fontSize: "14px" }}
                        >
                          View Details <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
