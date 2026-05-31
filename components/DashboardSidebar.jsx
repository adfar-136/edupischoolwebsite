"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/batches", icon: BookOpen, label: "My Batches" },
  { href: "/dashboard/masterclasses", icon: Calendar, label: "Masterclasses" },
  { href: "/dashboard/announcements", icon: Bell, label: "Announcements" },
];

export default function DashboardSidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className="sidebar"
      style={{ display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}
    >
      {/* Logo */}
      <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src="/logo-light.svg" alt="EdupiSchool" style={{ height: "40px", width: "auto" }} />
        </Link>
      </div>

      {/* User info */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
              fontFamily: "var(--font-display)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "white", fontWeight: 600, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name}
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {user?.role === "admin" && (
          <div style={{ padding: "0 16px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "16px" }}>
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                background: "rgba(244,169,66,0.12)",
                border: "1.5px solid var(--color-saffron)",
                color: "var(--color-saffron)",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,169,66,0.2)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244,169,66,0.12)" }}
            >
              <Shield size={16} />
              Admin Control Panel
            </Link>
          </div>
        )}
        <p style={{ padding: "8px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "4px" }}>
          Student Area
        </p>
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={16} />
              {label}
              {isActive && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/batches" className="sidebar-link">
          <GraduationCap size={16} />
          Browse More Batches
        </Link>
        <button
          onClick={handleSignOut}
          className="sidebar-link"
          style={{ width: "100%", textAlign: "left", fontFamily: "var(--font-sans)" }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
