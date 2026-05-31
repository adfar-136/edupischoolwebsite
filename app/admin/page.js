import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { headers } from "next/headers";
import Link from "next/link";
import { BookOpen, Users, Calendar, Bell, TrendingUp, ArrowRight, Star } from "lucide-react";

async function getStats() {
  try {
    const [students, batches, masterclasses, enrollments, bookings, announcements] = await Promise.all([
      db.collection("users").countDocuments({ role: "student" }),
      db.collection("batches").countDocuments({ status: "active" }),
      db.collection("masterclasses").countDocuments({ scheduledAt: { $gte: new Date() } }),
      db.collection("enrollments").countDocuments(),
      db.collection("bookings").countDocuments(),
      db.collection("announcements").countDocuments({ isPinned: true }),
    ]);
    return { students, batches, masterclasses, enrollments, bookings, announcements };
  } catch {
    return { students: 0, batches: 0, masterclasses: 0, enrollments: 0, bookings: 0, announcements: 0 };
  }
}

export const metadata = { title: "Admin Overview — EdupiSchool" };

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const stats = await getStats();

  const statCards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "#6366F1", bg: "rgba(99,102,241,0.1)" },
    { label: "Active Batches", value: stats.batches, icon: BookOpen, color: "var(--color-saffron-dark)", bg: "rgba(244,169,66,0.1)" },
    { label: "Upcoming Masterclasses", value: stats.masterclasses, icon: Star, color: "var(--color-forest)", bg: "rgba(45,106,79,0.1)" },
    { label: "Total Enrollments", value: stats.enrollments, icon: TrendingUp, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
    { label: "Masterclass Bookings", value: stats.bookings, icon: Calendar, color: "#EC4899", bg: "rgba(236,72,153,0.1)" },
    { label: "Pinned Announcements", value: stats.announcements, icon: Bell, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  ];

  const quickActions = [
    { href: "/admin/batches", label: "Manage Batches", icon: BookOpen, desc: "Create, edit, or archive batches" },
    { href: "/admin/lectures", label: "Add Lectures", icon: Calendar, desc: "Schedule lectures and add resources" },
    { href: "/admin/masterclasses", label: "New Masterclass", icon: Star, desc: "Create an upcoming Sunday session" },
    { href: "/admin/students", label: "Student Management", icon: Users, desc: "Enroll or manage student access" },
    { href: "/admin/announcements", label: "Announcements", icon: Bell, desc: "Pin messages for students" },
  ];

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px" }}>
          Welcome, {session.user.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
          Admin overview — manage EdupiSchool from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {statCards.map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "22px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: 44, height: 44, borderRadius: "12px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "30px", fontWeight: 800, color: "var(--color-charcoal)", lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--color-muted)", marginTop: "2px" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "20px" }}>
        Quick Actions
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                padding: "24px",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "rgba(244,169,66,0.1)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <action.icon size={18} color="var(--color-saffron-dark)" />
              </div>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 700, marginBottom: "4px", color: "var(--color-charcoal)" }}>
                  {action.label}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>{action.desc}</p>
              </div>
              <ArrowRight size={15} color="var(--color-muted)" style={{ marginTop: "auto" }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
