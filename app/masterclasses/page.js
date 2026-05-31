import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowRight, Play, Users } from "lucide-react";

export const metadata = {
  title: "Sunday Masterclasses — EdupiSchool",
  description: "One-time live masterclasses on specific tech topics by Adfar Rasheed. Just ₹199 per session.",
};

async function getMasterclasses() {
  try {
    const { db } = await import("@/lib/mongodb");
    const all = await db.collection("masterclasses").find({}).sort({ scheduledAt: -1 }).toArray();
    return all.map((m) => ({
      ...m,
      _id: m._id.toString(),
      scheduledAt: m.scheduledAt?.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function MasterclassesPage() {
  const all = await getMasterclasses();
  const now = new Date();
  const upcoming = all.filter((m) => new Date(m.scheduledAt) >= now);
  const past = all.filter((m) => new Date(m.scheduledAt) < now);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        style={{
          background: "var(--color-charcoal)",
          padding: "80px 0 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(45,106,79,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(82,183,136,0.15)",
              color: "#52B788",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Sunday Masterclasses
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
            One Session. One Topic. All Value.
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", maxWidth: "520px" }}>
            Deep-dive Sunday sessions on specific tech topics. Just ₹199 per session. No long-term commitment required.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--color-charcoal)",
              marginBottom: "8px",
            }}
          >
            Upcoming Sessions
          </h2>
          <p style={{ fontSize: "15px", color: "var(--color-muted)", marginBottom: "32px" }}>
            Book your spot before they fill up. Live every Sunday.
          </p>

          {upcoming.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 32px",
                background: "white",
                borderRadius: "20px",
                border: "1px solid var(--color-cream-dark)",
              }}
            >
              <Calendar size={40} style={{ margin: "0 auto 16px", color: "var(--color-muted)", display: "block" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "8px" }}>
                No upcoming masterclasses yet
              </h3>
              <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
                New masterclasses are announced frequently. Check back soon or follow{" "}
                <a href="https://www.instagram.com/adfarsirofficial?igsh=ZGU2ZDVlOXlqbDdx&utm_source=qr" style={{ color: "var(--color-saffron-dark)", textDecoration: "none" }}>
                  @adfarsirofficial
                </a>{" "}
                for announcements.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
              {upcoming.map((mc) => (
                <MasterclassCard key={mc._id} mc={mc} isUpcoming />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past sessions */}
      {past.length > 0 && (
        <section className="section" style={{ background: "var(--color-cream-dark)" }}>
          <div className="container">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--color-charcoal)",
                marginBottom: "8px",
              }}
            >
              Past Sessions
            </h2>
            <p style={{ fontSize: "14px", color: "var(--color-muted)", marginBottom: "28px" }}>
              Recordings available if you were enrolled. Missed it? Book the next one.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {past.map((mc) => (
                <MasterclassCard key={mc._id} mc={mc} isUpcoming={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

function MasterclassCard({ mc, isUpcoming }) {
  const date = new Date(mc.scheduledAt);
  const formatted = date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="card"
      style={{
        opacity: isUpcoming ? 1 : 0.75,
        position: "relative",
        overflow: "visible",
      }}
    >
      {isUpcoming && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "20px",
            padding: "4px 12px",
            background: "linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))",
            borderRadius: "50px",
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--color-charcoal)",
            boxShadow: "0 4px 12px rgba(244,169,66,0.3)",
          }}
        >
          UPCOMING
        </div>
      )}

      <div style={{ padding: "28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <span className="badge badge-saffron">Masterclass</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--color-saffron-dark)",
            }}
          >
            ₹{mc.price || 199}
          </span>
        </div>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--color-charcoal)",
            marginBottom: "10px",
            lineHeight: 1.3,
          }}
        >
          {mc.topic}
        </h3>

        <p style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.6, marginBottom: "20px" }}>
          {mc.description}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-muted)" }}>
            <Calendar size={13} />
            {formatted}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-muted)" }}>
            <Clock size={13} />
            {time} · 1.5 hours
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-muted)" }}>
            <Users size={13} />
            Live with Q&amp;A
          </div>
        </div>

        {isUpcoming ? (
          <Link
            href={`/checkout?type=masterclass&id=${mc._id}`}
            className="btn-forest"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Book Now — ₹199 <ArrowRight size={15} />
          </Link>
        ) : mc.recordingLink ? (
          <a
            href={mc.recordingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            <Play size={15} /> Watch Recording
          </a>
        ) : (
          <div
            style={{
              padding: "10px 20px",
              background: "var(--color-cream-dark)",
              borderRadius: "50px",
              textAlign: "center",
              fontSize: "14px",
              color: "var(--color-muted)",
            }}
          >
            Session Completed
          </div>
        )}
      </div>
    </div>
  );
}
