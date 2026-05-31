import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { Calendar, Clock, ExternalLink } from "lucide-react";

export const metadata = { title: "My Masterclasses — EdupiSchool Dashboard" };

async function getBookings(userId) {
  try {
    const oid = new ObjectId(userId);
    const bookings = await db.collection("bookings").find({ userId: oid }).toArray();
    const mcIds = bookings.map((b) => b.masterclassId);
    if (!mcIds.length) return [];
    const masterclasses = await db.collection("masterclasses").find({ _id: { $in: mcIds } }).toArray();
    return masterclasses.map((m) => ({ ...m, _id: m._id.toString(), scheduledAt: m.scheduledAt?.toISOString() }));
  } catch {
    return [];
  }
}

export default async function DashboardMasterclassesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const masterclasses = await getBookings(session.user.id);
  const now = new Date();

  const upcoming = masterclasses.filter((m) => new Date(m.scheduledAt) >= now);
  const past = masterclasses.filter((m) => new Date(m.scheduledAt) < now);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px" }}>
          My Masterclasses
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
          {masterclasses.length === 0 ? "No bookings yet." : `${masterclasses.length} masterclass${masterclasses.length !== 1 ? "es" : ""} booked.`}
        </p>
      </div>

      {masterclasses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 32px", background: "white", borderRadius: "20px", border: "2px dashed var(--color-cream-dark)" }}>
          <Calendar size={40} style={{ margin: "0 auto 16px", color: "var(--color-muted)", display: "block" }} />
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "8px" }}>No masterclasses booked</h3>
          <p style={{ color: "var(--color-muted)", fontSize: "15px", marginBottom: "20px" }}>
            Book a Sunday masterclass for just ₹199.
          </p>
          <Link href="/masterclasses" className="btn-forest" style={{ display: "inline-flex" }}>
            Browse Masterclasses
          </Link>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>Upcoming</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {upcoming.map((mc) => <MasterclassCard key={mc._id} mc={mc} now={now} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, marginBottom: "16px" }}>Past Sessions</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {past.map((mc) => <MasterclassCard key={mc._id} mc={mc} now={now} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MasterclassCard({ mc, now }) {
  const scheduled = new Date(mc.scheduledAt);
  const diffMins = (now - scheduled) / 60000;
  const showJoin = diffMins >= -30 && diffMins <= 180;
  const isPast = scheduled < now;

  return (
    <div className="card" style={{ padding: "24px" }}>
      <span className="badge badge-saffron" style={{ marginBottom: "12px", display: "inline-block" }}>
        {isPast ? "Completed" : "Upcoming"}
      </span>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{mc.topic}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
          <Calendar size={12} />
          {scheduled.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)" }}>
          <Clock size={12} />
          {scheduled.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
      {showJoin && mc.joinLink ? (
        <a href={mc.joinLink} target="_blank" rel="noopener noreferrer" className="btn-forest" style={{ width: "100%", justifyContent: "center", fontSize: "14px" }}>
          🔴 Join Live <ExternalLink size={13} />
        </a>
      ) : isPast && mc.recordingLink ? (
        <a href={mc.recordingLink} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: "14px" }}>
          Watch Recording <ExternalLink size={13} />
        </a>
      ) : isPast ? (
        <div style={{ textAlign: "center", fontSize: "13px", color: "var(--color-muted)" }}>No recording available</div>
      ) : (
        <div style={{ textAlign: "center", fontSize: "13px", color: "var(--color-muted)" }}>Session not live yet</div>
      )}
    </div>
  );
}
