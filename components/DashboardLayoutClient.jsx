"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, LogOut, GraduationCap, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Sidebar Links matches the main navigation
const sidebarLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/batches", label: "My Batches" },
  { href: "/dashboard/masterclasses", label: "Masterclasses" },
  { href: "/dashboard/certificates", label: "My Certificates" },
  { href: "/dashboard/announcements", label: "Announcements" },
];

export default function DashboardLayoutClient({ children, user }) {
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
      {/* Styles for mobile layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-cream);
        }
        
        .desktop-sidebar {
          display: block;
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
        }
        
        .mobile-header {
          display: none;
          position: sticky;
          top: 0;
          width: 100%;
          height: 64px;
          background: rgba(250, 247, 242, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(28, 28, 28, 0.06);
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 200;
        }
        
        .mobile-drawer-backdrop {
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
        
        .mobile-drawer {
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100vh;
          background: var(--color-charcoal);
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 301;
          display: flex;
          flex-direction: column;
        }
        
        .mobile-drawer.open {
          transform: translateX(0);
        }
        
        @media (max-width: 1023px) {
          .dashboard-layout {
            flex-direction: column;
          }
          
          .desktop-sidebar {
            display: none;
          }
          
          .mobile-header {
            display: flex;
          }
          
          .mobile-drawer-backdrop.open {
            display: block;
          }
        }
      `}} />

      <div className="dashboard-layout">
        {/* DESKTOP SIDEBAR */}
        <div className="desktop-sidebar">
          {/* We import/render the custom sidebar directly or as children */}
          <aside
            className="sidebar"
            style={{ display: "flex", flexDirection: "column", height: "100vh" }}
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
                  <p style={{ color: "white", fontWeight: 600, fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                    {user?.name}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Nav Links */}
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
              
              {/* Load custom lucide icons dynamically */}
              {sidebarLinks.map(({ href, label }) => {
                const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
                // Load corresponding icon dynamically
                let Icon = GraduationCap;
                if (label === "Overview") {
                  Icon = require("lucide-react").LayoutDashboard;
                } else if (label === "My Batches") {
                  Icon = require("lucide-react").BookOpen;
                } else if (label === "Masterclasses") {
                  Icon = require("lucide-react").Calendar;
                } else if (label === "My Certificates") {
                  Icon = require("lucide-react").Award;
                } else if (label === "Announcements") {
                  Icon = require("lucide-react").Bell;
                }

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

            {/* Bottom Actions */}
            <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/batches" className="sidebar-link">
                <GraduationCap size={16} />
                Browse More Batches
              </Link>
              <button
                onClick={handleSignOut}
                className="sidebar-link"
                style={{ width: "100%", textAlign: "left", fontFamily: "var(--font-sans)", background: "none", border: "none" }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>
        </div>

        {/* MOBILE STICKY NAVBAR HEADER */}
        <header className="mobile-header">
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
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)" }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "none" }}
          >
            <Menu size={24} />
          </button>
          
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.svg" alt="EdupiSchool" style={{ height: "32px", width: "auto" }} />
          </Link>

          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-display)",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
        </header>

        {/* MOBILE DRAWER DRAWER SIDEBAR */}
        <div
          className={`mobile-drawer-backdrop ${isMobileMenuOpen ? "open" : ""}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <img src="/logo-light.svg" alt="EdupiSchool" style={{ height: "32px", width: "auto" }} />
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

          {/* Nav Links in Drawer */}
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
                  }}
                >
                  <Shield size={16} />
                  Admin Control Panel
                </Link>
              </div>
            )}
            
            <p style={{ padding: "8px 24px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "4px" }}>
              Student Area
            </p>

            {sidebarLinks.map(({ href, label }) => {
              const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
              let Icon = GraduationCap;
              if (label === "Overview") {
                Icon = require("lucide-react").LayoutDashboard;
              } else if (label === "My Batches") {
                Icon = require("lucide-react").BookOpen;
              } else if (label === "Masterclasses") {
                Icon = require("lucide-react").Calendar;
              } else if (label === "My Certificates") {
                Icon = require("lucide-react").Award;
              } else if (label === "Announcements") {
                Icon = require("lucide-react").Bell;
              }

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

          {/* Drawer Footer */}
          <div style={{ padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
            <Link href="/batches" className="sidebar-link">
              <GraduationCap size={16} />
              Browse More Batches
            </Link>
            <button
              onClick={handleSignOut}
              className="sidebar-link"
              style={{ width: "100%", textAlign: "left", fontFamily: "var(--font-sans)", background: "none", border: "none" }}
            >
              <LogOut size={16} />
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
