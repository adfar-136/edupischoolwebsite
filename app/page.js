import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroLeadForm from "@/components/HeroLeadForm";
import { clientPromise } from "@/lib/mongodb";
import { ArrowRight, Calendar, Clock, Users, Star, CheckCircle, ChevronRight, Zap } from "lucide-react";

// Inline social icons for compatibility with older lucide-react versions in Server Components
function YoutubeIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// Chinar leaf SVG watermark component
function ChinarWatermark() {
  return (
    <svg
      style={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "520px",
        height: "520px",
        opacity: 0.06,
        pointerEvents: "none",
      }}
      viewBox="0 0 200 200"
      fill="currentColor"
    >
      {/* Stylized Chinar leaf shape */}
      <path
        d="M100 10 C100 10, 60 30, 40 60 C20 90, 25 120, 40 140 C30 145, 25 155, 30 165 C40 150, 55 145, 70 148 C80 160, 90 175, 100 185 C110 175, 120 160, 130 148 C145 145, 160 150, 170 165 C175 155, 170 145, 160 140 C175 120, 180 90, 160 60 C140 30, 100 10, 100 10Z"
        style={{ color: "var(--color-saffron)" }}
      />
      <path
        d="M100 35 C100 35, 75 50, 60 75 C50 90, 55 110, 65 125 L100 160 L135 125 C145 110, 150 90, 140 75 C125 50, 100 35, 100 35Z"
        fill="var(--color-cream)"
        opacity={0.3}
      />
      <line x1="100" y1="35" x2="100" y2="185" stroke="var(--color-saffron)" strokeWidth="2" opacity={0.5} />
      <line x1="75" y1="70" x2="100" y2="95" stroke="var(--color-saffron)" strokeWidth="1.5" opacity={0.4} />
      <line x1="65" y1="100" x2="100" y2="120" stroke="var(--color-saffron)" strokeWidth="1.5" opacity={0.4} />
      <line x1="125" y1="70" x2="100" y2="95" stroke="var(--color-saffron)" strokeWidth="1.5" opacity={0.4} />
      <line x1="135" y1="100" x2="100" y2="120" stroke="var(--color-saffron)" strokeWidth="1.5" opacity={0.4} />
    </svg>
  );
}

// Mountain silhouette SVG for hero background
function MountainSilhouette() {
  return (
    <svg
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        opacity: 0.04,
        pointerEvents: "none",
      }}
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <path
        d="M0 200 L0 140 L180 60 L360 120 L480 20 L600 100 L720 40 L840 110 L960 30 L1080 90 L1200 50 L1320 110 L1440 70 L1440 200 Z"
        style={{ color: "var(--color-charcoal)" }}
      />
    </svg>
  );
}

const HARDCODED_TESTIMONIALS = [
  {
    name: "Bilal Ahmad",
    location: "Srinagar, Kashmir",
    text: "Adfar's teaching style is completely different. He doesn't just show code — he explains *why* you're writing it. My understanding of Full Stack jumped 10x in the first month.",
    avatar: "B",
    batch: "FSD Batch",
    rating: 5,
  },
  {
    name: "Rukhsar Nazir",
    location: "Anantnag, Kashmir",
    text: "I had tried multiple online platforms before. Nothing clicked until I joined EdupiSchool. The Sunday sessions are genuinely the best 3 hours of my week.",
    avatar: "R",
    batch: "DSA Batch",
    rating: 5,
  },
  {
    name: "Aaqib Hussain",
    location: "Baramulla, Kashmir",
    text: "The GenAI batch changed my perspective on what's possible. I've already built two side projects using AI APIs — things I couldn't have imagined six months ago.",
    avatar: "A",
    batch: "GenAI Batch",
    rating: 5,
  },
  {
    name: "Nida Shah",
    location: "Sopore, Kashmir",
    text: "The community here is unlike anything else. Adfar is responsive, motivating, and genuinely cares about student progress. Not just a teacher — a mentor.",
    avatar: "N",
    batch: "FSD Batch",
    rating: 5,
  },
];

const STATS = [
  { value: "30,000+", label: "Students Trained" },
  { value: "3", label: "Active Batches" },
  { value: "50+", label: "Masterclasses Held" },
  { value: "95%", label: "Satisfaction Rate" },
];

async function getPageData() {
  try {
    const { db } = await import("@/lib/mongodb");
    const [batches, masterclasses, settingsDoc] = await Promise.all([
      db.collection("batches").find({ status: "active" }).limit(3).toArray(),
      db
        .collection("masterclasses")
        .find({ scheduledAt: { $gte: new Date() } })
        .sort({ scheduledAt: 1 })
        .limit(3)
        .toArray(),
      db.collection("settings").findOne({ key: "socials" }),
    ]);
    return {
      batches: batches.map((b) => ({ ...b, _id: b._id.toString() })),
      masterclasses: masterclasses.map((m) => ({
        ...m,
        _id: m._id.toString(),
        scheduledAt: m.scheduledAt?.toISOString(),
      })),
      settings: settingsDoc || { instagram: "", linkedin: "", youtube: "", twitter: "", customLinks: [] },
    };
  } catch {
    return { 
      batches: [], 
      masterclasses: [], 
      settings: { instagram: "", linkedin: "", youtube: "", twitter: "", customLinks: [] } 
    };
  }
}

const FALLBACK_BATCHES = [
  {
    _id: "fsd",
    title: "Full Stack Development",
    slug: "full-stack-development",
    description: "Master React, Next.js, Node.js, Express, and MongoDB. Build real production web apps.",
    price: 3999,
    duration: "16 Weeks",
    lessonsCount: 48,
    category: "FSD",
    status: "active",
  },
  {
    _id: "dsa",
    title: "DSA & Coding Interview Guide",
    slug: "dsa-interview-guide",
    description: "Learn essential Data Structures, Algorithms, and interview patterns to land your job.",
    price: 3000,
    duration: "12 Weeks",
    lessonsCount: 36,
    category: "DSA",
    status: "active",
  },
];

const CATEGORY_COLORS = {
  FSD: { bg: "rgba(59,130,246,0.1)", text: "#1D4ED8" },
  DSA: { bg: "rgba(45,106,79,0.1)", text: "#2D6A4F" },
  GenAI: { bg: "rgba(244,169,66,0.15)", text: "#D4891E" },
};

export default async function HomePage() {
  const { batches: dbBatches, masterclasses, settings } = await getPageData();
  const batches = dbBatches.length > 0 ? dbBatches : FALLBACK_BATCHES;

  const upcomingBatch = batches.find((b) => {
    if (!b.startDate || b.status !== "active") return false;
    const start = new Date(b.startDate);
    const diffTime = start.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= -2 && diffDays <= 12; // starts between 2 days ago and next 12 days
  });

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section
        style={{
          background: "var(--color-cream)",
          position: "relative",
          overflow: "hidden",
          minHeight: "72vh",
          display: "flex",
          alignItems: "center",
          padding: "24px 0",
        }}
      >
        <MountainSilhouette />
        <ChinarWatermark />

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(244,169,66,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "16px 24px" }}>
          <div className="hero-grid">
            {/* Left Column (Content) */}
            <div>
              {/* Pre-headline tag */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  background: "rgba(244,169,66,0.12)",
                  borderRadius: "50px",
                  marginBottom: "12px",
                  border: "1px solid rgba(244,169,66,0.3)",
                }}
              >
                <Zap size={14} color="var(--color-saffron-dark)" />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--color-saffron-dark)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Long-Term Batches Now Open
                </span>
              </div>

              {/* Main headline */}
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(34px, 5.2vw, 52px)",
                  fontWeight: 800,
                  color: "var(--color-charcoal)",
                  lineHeight: 1.1,
                  marginBottom: "12px",
                  letterSpacing: "-0.02em",
                }}
              >
                Learn FSD, DSA &amp; GenAI from{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #F4A942, #2D6A4F)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Kashmir's own
                </span>
              </h1>

              {/* Animated Mission Banner */}
              <div className="mission-banner">
                <span className="mission-badge">My Core Belief &amp; Mission 🎯</span>
                <p className="mission-text-highlight">
                  &ldquo;Goal is not to crack <span style={{ color: "var(--color-saffron-dark)", fontWeight: 800 }}>FAANG</span>, but your <span style={{ color: "var(--color-forest)", fontWeight: 800 }}>first internship</span> or <span style={{ color: "var(--color-forest)", fontWeight: 800 }}>first Job</span>.&rdquo;
                </p>
                <p style={{ fontSize: "14px", color: "var(--color-muted)", margin: 0, lineHeight: 1.5 }}>
                  Live sessions by <strong style={{ color: "var(--color-charcoal)", fontWeight: 600 }}>Adfar Rasheed</strong>. We cut the hype and focus on raw engineering, real-world projects, and hands-on guidance to help you land your job.
                </p>
              </div>

              {/* Trust badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                {["30,000+ students trained", "3 live sessions/week", "Lifetime recording access", "Hands-on projects"].map((badge) => (
                  <span
                    key={badge}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      color: "var(--color-muted)",
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle size={12} color="var(--color-forest)" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Link href="/batches" className="btn-primary" style={{ fontSize: "15px", padding: "12px 28px" }}>
                  Join a Batch
                  <ArrowRight size={16} />
                </Link>
                <Link href="/masterclasses" className="btn-secondary" style={{ fontSize: "15px", padding: "12px 28px" }}>
                  Book a Masterclass
                </Link>
              </div>
            </div>

            {/* Right Column (Lead Form Card) */}
            <div
              className="card"
              style={{
                background: "white",
                padding: "20px 24px",
                borderRadius: "20px",
                border: "1.5px solid var(--color-cream-dark)",
                boxShadow: "0 12px 40px rgba(28,28,28,0.05)",
                width: "100%",
                maxWidth: "440px",
                justifySelf: "center",
              }}
            >
              <HeroLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "var(--color-charcoal)", padding: "32px 0" }}>
        <div className="container stats-grid">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: "center",
                padding: "20px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "36px",
                  fontWeight: 800,
                  color: "var(--color-saffron)",
                  marginBottom: "4px",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BATCHES ── */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span className="badge badge-saffron" style={{ marginBottom: "16px", display: "inline-block" }}>
              Long-Term Batches
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                color: "var(--color-charcoal)",
                marginBottom: "16px",
              }}
            >
              Learn from scratch. Build for real.
            </h2>
            <p style={{ fontSize: "17px", color: "var(--color-muted)", maxWidth: "500px", margin: "0 auto" }}>
              Every batch runs live with 3 sessions every week — focused Q&amp;A, instruction, and guided projects.
            </p>
          </div>
          {/* Dynamic Upcoming Batch Banner managed by Admin via startDate */}
          {upcomingBatch && (
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {batches.map((batch) => {
              const catColors = CATEGORY_COLORS[batch.category] || CATEGORY_COLORS["FSD"];
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
                  {/* Card header */}
                  <div
                    style={{
                      height: "8px",
                      background:
                        batch.category === "FSD"
                          ? "linear-gradient(90deg, #3B82F6, #6366F1)"
                          : batch.category === "DSA"
                          ? "linear-gradient(90deg, #2D6A4F, #52B788)"
                          : "linear-gradient(90deg, #F4A942, #D4891E)",
                    }}
                  />
                  <div style={{ padding: "28px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <span
                        className="badge"
                        style={{ background: catColors.bg, color: catColors.text }}
                      >
                        {batch.category}
                      </span>
                      {isUpcoming ? (
                        <span className="badge badge-saffron" style={{ animation: "pulse 2s ease-in-out infinite" }}>
                          🔥 Starting Next Week!
                        </span>
                      ) : (
                        <span className="badge badge-forest" style={{ fontSize: "11px" }}>
                          3 sessions / week
                        </span>
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        fontWeight: 700,
                        marginBottom: "10px",
                        color: "var(--color-charcoal)",
                      }}
                    >
                      {batch.title}
                    </h3>
                    <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBottom: "20px", lineHeight: 1.6 }}>
                      {batch.description}
                    </p>

                    <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
                        <Clock size={13} />
                        {batch.duration} months
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
                        <Calendar size={13} />
                        3 sessions/week
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

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "var(--color-charcoal)",
                          }}
                        >
                          ₹{batch.fees?.toLocaleString("en-IN")}
                        </span>
                        <span style={{ fontSize: "13px", color: "var(--color-muted)", marginLeft: "4px" }}>/ batch</span>
                      </div>
                      <Link
                        href={`/batches/${batch.slug}`}
                        className="btn-primary"
                        style={{ padding: "10px 20px", fontSize: "14px" }}
                      >
                        View Batch
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/batches" className="btn-secondary">
              See All Batches
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MASTERCLASSES ── */}
      {masterclasses.length > 0 && (
        <section className="section" style={{ background: "var(--color-cream-dark)" }}>
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <span className="badge badge-forest" style={{ marginBottom: "16px", display: "inline-block" }}>
                Sunday Masterclasses
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 700,
                  marginBottom: "12px",
                  color: "var(--color-charcoal)",
                }}
              >
                Upcoming Masterclasses
              </h2>
              <p style={{ fontSize: "16px", color: "var(--color-muted)" }}>
                One-time deep dives on specific topics — just ₹199 per session.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
              {masterclasses.map((mc) => (
                <div key={mc._id} className="card" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span className="badge badge-saffron">Masterclass</span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "var(--color-saffron-dark)",
                      }}
                    >
                      ₹{mc.price || 199}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                    {mc.topic}
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--color-muted)", marginBottom: "16px" }}>{mc.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)", marginBottom: "16px" }}>
                    <Calendar size={13} />
                    {new Date(mc.scheduledAt).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
                  </div>
                  <Link
                    href={`/checkout?type=masterclass&id=${mc._id}`}
                    className="btn-forest"
                    style={{ width: "100%", justifyContent: "center", padding: "10px 20px", fontSize: "14px" }}
                  >
                    Book Now — ₹199
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Link href="/masterclasses" className="btn-ghost">
                View All Masterclasses <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT ADFAR ── */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          <div className="instructor-grid">
            {/* Left: image placeholder with gradient */}
            <div
              style={{
                aspectRatio: "4/5",
                borderRadius: "24px",
                background: "var(--color-charcoal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-card-hover)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img 
                src="/adfar.jpg" 
                alt="Adfar Rasheed" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 0
                }} 
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(28,28,28,0.85))",
                  padding: "32px",
                  zIndex: 1,
                }}
              >
                <p style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "white" }}>
                  Adfar Rasheed
                </p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px" }}>Full Stack Developer & Educator</p>
              </div>
            </div>

            {/* Right: bio */}
            <div>
              <span className="badge badge-saffron" style={{ marginBottom: "20px", display: "inline-block" }}>
                About Your Instructor
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 700,
                  color: "var(--color-charcoal)",
                  marginBottom: "20px",
                  lineHeight: 1.2,
                }}
              >
                Teaching code from the valley of Kashmir
              </h2>
              <p style={{ fontSize: "15.5px", color: "var(--color-muted)", lineHeight: 1.8, marginBottom: "16px" }}>
                Adfar Rasheed is a Full-Stack Developer and Tech Educator based in Kashmir. Formerly a lead faculty member at PW Skills and College Wallah, he has trained over 50,000 students in industry-relevant technologies including the MERN Stack, React, Generative AI, Prompt Engineering, DSA, and Databases.
              </p>
              <p style={{ fontSize: "15.5px", color: "var(--color-muted)", lineHeight: 1.8, marginBottom: "20px" }}>
                Today, Adfar launches his upskilling cohorts independently on EdupiSchool. Beyond live interactive batches, Adfar conducts college seminars across India, creates educational content, and mentors students with the kind of honest, grounded guidance you'd expect from a trusted elder brother — not just a teacher.
              </p>

              {/* Dynamic Mission Inline Callout */}
              <div className="mission-banner" style={{ margin: "24px 0", borderLeft: "5px solid var(--color-forest) !important" }}>
                <span className="mission-badge" style={{ background: "rgba(45,106,79,0.08)", color: "var(--color-forest-dark)" }}>The Educator's Oath 🌸</span>
                <p className="mission-text-highlight" style={{ fontSize: "16.5px" }}>
                  &ldquo;I believe our sole focus should be helping you secure that first job or internship. Forget the vanity metrics.&rdquo;
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {[
                  "MERN Stack (MongoDB, Express, React, Node)",
                  "Data Structures & Algorithms (DSA) Interview Patterns",
                  "Generative AI & Prompt Engineering (Claude, ChatGPT)",
                  "Former PW Skills & College Wallah Lead Faculty (Trained 50k+ students)",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle size={16} color="var(--color-forest)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "15px", color: "var(--color-charcoal-light)" }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                <Link href="/about" className="btn-primary">
                  Read Adfar's Full Story
                  <ArrowRight size={16} />
                </Link>
                
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { icon: YoutubeIcon, href: "https://www.youtube.com/@adfar-rasheed", keyName: "youtube", label: "YouTube" },
                    { icon: InstagramIcon, href: "https://www.instagram.com/adfarsirofficial?igsh=ZGU2ZDVlOXlqbDdx&utm_source=qr", keyName: "instagram", label: "Instagram" },
                    { icon: LinkedinIcon, href: "https://www.linkedin.com/in/adfar-rasheed/", keyName: "linkedin", label: "LinkedIn" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-btn-home ${s.keyName}`}
                      title={s.label}
                    >
                      <s.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: "var(--color-charcoal)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
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
              Student Stories
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "white",
              }}
            >
              What our students say
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {HARDCODED_TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "28px",
                  transition: "background 0.3s ease",
                }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} color="#F4A942" fill="#F4A942" />
                  ))}
                </div>

                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "24px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "white",
                      flexShrink: 0,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>{t.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{t.location} · {t.batch}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Mission Banner (Dark Mode) */}
          <div className="mission-banner-dark" style={{ marginTop: "48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <span className="mission-badge" style={{ background: "rgba(244,169,66,0.15)", color: "var(--color-saffron)" }}>Our Core Philosophy 🎯</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>EDUPISCHOOL MISSION</span>
            </div>
            <p className="mission-text-highlight" style={{ color: "white", fontSize: "20px" }}>
              &ldquo;Goal is not to crack FAANG but your first internship or first Job.&rdquo;
            </p>
            <p style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>
              At EdupiSchool, we believe modern edtech has lost its way in corporate hype and false promises of elite boardrooms. True, life-altering success is securing your very first industry job, building core confidence, and standing on your own feet. Everything we teach is laser-focused on that singular landmark milestone.
            </p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, var(--color-saffron) 0%, #D4891E 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              color: "var(--color-charcoal)",
              marginBottom: "16px",
            }}
          >
            Ready to start your journey?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(28,28,28,0.7)",
              marginBottom: "40px",
              maxWidth: "480px",
              margin: "0 auto 40px",
            }}
          >
            Join hundreds of students from Kashmir and beyond learning to build real technology.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "14px" }}>
            <Link
              href="/batches"
              style={{
                padding: "14px 36px",
                background: "var(--color-charcoal)",
                color: "white",
                borderRadius: "50px",
                fontWeight: 600,
                fontSize: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              Explore Batches <ArrowRight size={18} />
            </Link>
            <Link
              href="/masterclasses"
              style={{
                padding: "14px 36px",
                background: "rgba(255,255,255,0.3)",
                color: "var(--color-charcoal)",
                borderRadius: "50px",
                fontWeight: 600,
                fontSize: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                border: "2px solid rgba(28,28,28,0.2)",
              }}
            >
              ₹199 Masterclasses
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL MEDIA HUB ── */}
      <section className="section" style={{ background: "var(--color-cream-dark)", padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-saffron" style={{ marginBottom: "16px", display: "inline-block" }}>Community &amp; Socials</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "12px" }}>
              Connect Beyond the Classroom
            </h2>
            <p style={{ color: "var(--color-muted)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              Join my active learning communities, check out my latest code tutorials, and stay updated with live cohorts!
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {/* YouTube Card */}
            {settings?.youtube && (
              <a 
                href={settings.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  padding: "32px",
                  background: "white",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1.5px solid var(--color-cream-dark)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(28,28,28,0.02)"
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                  📺
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", margin: "0 0 8px" }}>YouTube Channel</h4>
                <p style={{ fontSize: "13.5px", color: "var(--color-muted)", margin: "0 0 16px" }}>Subscribe for deep-dives in MERN stacks, system designs, and tech career guides.</p>
                <span style={{ color: "var(--color-forest)", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Subscribe Now <ArrowRight size={14} />
                </span>
              </a>
            )}

            {/* LinkedIn Card */}
            {settings?.linkedin && (
              <a 
                href={settings.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  padding: "32px",
                  background: "white",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1.5px solid var(--color-cream-dark)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(28,28,28,0.02)"
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(10,102,194,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                  💼
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", margin: "0 0 8px" }}>LinkedIn Network</h4>
                <p style={{ fontSize: "13.5px", color: "var(--color-muted)", margin: "0 0 16px" }}>Connect with me for developer networking, tech insights, and cohort launches.</p>
                <span style={{ color: "var(--color-forest)", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Connect Roster <ArrowRight size={14} />
                </span>
              </a>
            )}

            {/* Instagram Card */}
            {settings?.instagram && (
              <a 
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  padding: "32px",
                  background: "white",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1.5px solid var(--color-cream-dark)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(28,28,28,0.02)"
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(225,48,108,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                  📸
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", margin: "0 0 8px" }}>Instagram Reels</h4>
                <p style={{ fontSize: "13.5px", color: "var(--color-muted)", margin: "0 0 16px" }}>Check out coding reels, daily tech setups, and behind-the-scenes in Kashmir.</p>
                <span style={{ color: "var(--color-forest)", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Follow Reels <ArrowRight size={14} />
                </span>
              </a>
            )}

            {/* Twitter Card */}
            {settings?.twitter && (
              <a 
                href={settings.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  padding: "32px",
                  background: "white",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1.5px solid var(--color-cream-dark)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(28,28,28,0.02)"
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(29,161,242,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                  🐦
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", margin: "0 0 8px" }}>Twitter / X</h4>
                <p style={{ fontSize: "13.5px", color: "var(--color-muted)", margin: "0 0 16px" }}>Read developer threads, open-source thoughts, and prompt-engineering tips.</p>
                <span style={{ color: "var(--color-forest)", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Follow Feed <ArrowRight size={14} />
                </span>
              </a>
            )}

            {/* Render any Custom Link sections dynamically! */}
            {settings?.customLinks && settings.customLinks.map((item, idx) => (
              <a 
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  padding: "32px",
                  background: "white",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  border: "1.5px solid var(--color-cream-dark)",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(28,28,28,0.02)"
                }}
              >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(45,106,79,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>
                  {item.icon || "🔗"}
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", margin: "0 0 8px" }}>{item.title}</h4>
                <p style={{ fontSize: "13.5px", color: "var(--color-muted)", margin: "0 0 16px" }}>Explore this custom directory page and resource link launched by Adfar.</p>
                <span style={{ color: "var(--color-forest)", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Visit Resource <ArrowRight size={14} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
