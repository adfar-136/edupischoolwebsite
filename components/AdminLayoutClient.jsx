"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, LogOut, GraduationCap, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/batches", label: "Batches" },
  { href: "/admin/lectures", label: "Lectures" },
  { href: "/admin/masterclasses", label: "Masterclasses" },
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayoutClient({ children, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #F1F0EC;
        }
        
        .desktop-admin-sidebar {
          display: block;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
        }
        
        .admin-mobile-header {
          display: none;
          position: sticky;
          top: 0;
          width: 100%;
          height: 64px;
          background: rgba(241, 240, 236, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(28, 28, 28, 0.06);
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 200;
        }
        
        .admin-drawer-backdrop {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 300;
        }
        
        .admin-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: #111827;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 301;
          display: flex;
          flex-direction: column;
        }
        
        .admin-drawer.open {
          transform: translateX(0);
        }
        
        @media (max-width: 1023px) {
          .admin-layout {
            flex-direction: column;
          }
          
          .desktop-admin-sidebar {
            display: none;
          }
          
          .admin-mobile-header {
            display: flex;
          }
          
          .admin-drawer-backdrop.open {
            display: block;
          }
        }
      `}} />

      <div className="admin-layout">
        {/* DESKTOP SIDEBAR */}
        <div className="desktop-admin-sidebar">
          <aside
            style={{
              width: 260,
              height: "100vh",
              background: "#111827",
              color: "white",
              padding: "24px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Logo */}
            <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/admin" style={{ display: "flex", alignItems: "center", textDecoration: "none", marginBottom: "4px" }}>
                <img src="/logo-light.svg" alt="EdupiSchool" style={{ height: "40px", width: "auto" }} />
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                <Shield size={12} color="#F4A942" />
                <span style={{ fontSize: "11px", color: "#F4A942", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Admin Panel
                </span>
              </div>
            </div>

            {/* User Info */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #F4A942, #2D6A4F)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "white", fontFamily: "var(--font-display)", flexShrink: 0 }}>
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                    {user?.name}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: 0 }}>Administrator</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
              <p style={{ padding: "8px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "4px" }}>
                Manage
              </p>
              {adminLinks.map(({ href, label, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";
                const isAdminHome = exact && pathname === "/admin";
                const active = isActive || isAdminHome;

                let Icon = GraduationCap;
                if (label === "Overview") {
                  Icon = require("lucide-react").LayoutDashboard;
                } else if (label === "Batches") {
                  Icon = require("lucide-react").BookOpen;
                } else if (label === "Lectures") {
                  Icon = require("lucide-react").Video;
                } else if (label === "Masterclasses") {
                  Icon = require("lucide-react").Star;
                } else if (label === "Assignments") {
                  Icon = require("lucide-react").ClipboardList;
                } else if (label === "Announcements") {
                  Icon = require("lucide-react").Bell;
                } else if (label === "Students") {
                  Icon = require("lucide-react").Users;
                } else if (label === "Leads") {
                  Icon = require("lucide-react").PhoneCall;
                } else if (label === "Settings") {
                  Icon = require("lucide-react").Settings;
                }

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

            {/* Bottom Actions */}
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
        </div>

        {/* MOBILE HEADER */}
        <header className="admin-mobile-header">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-charcoal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <Menu size={24} />
          </button>
          
          <Link href="/admin" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.svg" alt="EdupiSchool" style={{ height: "32px", width: "auto" }} />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #F4A942, #2D6A4F)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: 700,
                color: "white",
                fontFamily: "var(--font-display)",
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* MOBILE DRAWER SIDEBAR */}
        <div
          className={`admin-drawer-backdrop ${isMobileMenuOpen ? "open" : ""}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={`admin-drawer ${isMobileMenuOpen ? "open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <img src="/logo-light.svg" alt="EdupiSchool" style={{ height: "32px", width: "auto" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                <Shield size={10} color="#F4A942" />
                <span style={{ fontSize: "9px", color: "#F4A942", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Admin Panel
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                borderRadius: "8px"
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links in Drawer */}
          <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
            <p style={{ padding: "8px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "4px" }}>
              Manage
            </p>
            {adminLinks.map(({ href, label, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href) && href !== "/admin";
              const isAdminHome = exact && pathname === "/admin";
              const active = isActive || isAdminHome;

              let Icon = GraduationCap;
              if (label === "Overview") {
                Icon = require("lucide-react").LayoutDashboard;
              } else if (label === "Batches") {
                Icon = require("lucide-react").BookOpen;
              } else if (label === "Lectures") {
                Icon = require("lucide-react").Video;
              } else if (label === "Masterclasses") {
                Icon = require("lucide-react").Star;
              } else if (label === "Assignments") {
                Icon = require("lucide-react").ClipboardList;
              } else if (label === "Announcements") {
                Icon = require("lucide-react").Bell;
              } else if (label === "Students") {
                Icon = require("lucide-react").Users;
              } else if (label === "Leads") {
                Icon = require("lucide-react").PhoneCall;
              } else if (label === "Settings") {
                Icon = require("lucide-react").Settings;
              }

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

          {/* Drawer Footer */}
          <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
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
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        <main style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </>
  );
}
