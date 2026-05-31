"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Video,
  Star,
  ClipboardList,
  Bell,
  Users,
  LogOut,
  ChevronRight,
  Shield,
  PhoneCall,
  Settings,
} from "lucide-react";

const links = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/admin/batches", icon: BookOpen, label: "Batches" },
  { href: "/admin/lectures", icon: Video, label: "Lectures" },
  { href: "/admin/masterclasses", icon: Star, label: "Masterclasses" },
  { href: "/admin/assignments", icon: ClipboardList, label: "Assignments" },
  { href: "/admin/announcements", icon: Bell, label: "Announcements" },
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/leads", icon: PhoneCall, label: "Leads" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        background: "#111827",
        color: "white",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "4px" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #F4A942, #D4891E)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="white" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "white" }}>
            EdupiSchool
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
          <Shield size={12} color="#F4A942" />
          <span style={{ fontSize: "11px", color: "#F4A942", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Admin Panel
          </span>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #F4A942, #2D6A4F)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "white", fontFamily: "var(--font-display)", flexShrink: 0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "white", fontWeight: 600, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>Administrator</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        <p style={{ padding: "8px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "4px" }}>
          Manage
        </p>
        {links.map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";
          const isAdminHome = exact && pathname === "/admin";
          const active = isActive || isAdminHome;

          return (
            <Link
              key={href}
              href={href}
              className={active ? "admin-link-active" : "admin-link-inactive"}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 24px",
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
        >
          <GraduationCap size={15} />
          Student View
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "11px 24px",
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            transition: "color 0.2s ease",
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
