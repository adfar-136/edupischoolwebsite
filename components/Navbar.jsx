"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Menu, X, BookOpen, GraduationCap } from "lucide-react";

const navLinks = [
  { href: "/batches", label: "Batches" },
  { href: "/masterclasses", label: "Masterclasses" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = authClient.useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? "0 2px 20px rgba(28,28,28,0.08)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #F4A942, #D4891E)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GraduationCap size={20} color="white" strokeWidth={2} />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "20px",
              color: "var(--color-charcoal)",
              letterSpacing: "-0.02em",
            }}
          >
            EdupiSchool
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hide-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "nav-link-active" : "nav-link-inactive"}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hide-mobile">
          {session ? (
            <>
              <Link
                href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                className="btn-ghost"
                style={{ padding: "8px 18px", fontSize: "14px" }}
              >
                {session.user.role === "admin" ? "Admin Panel" : "My Dashboard"}
              </Link>
              <button onClick={handleSignOut} className="btn-secondary" style={{ padding: "8px 18px", fontSize: "14px" }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost" style={{ padding: "8px 18px", fontSize: "14px" }}>
                Login
              </Link>
              <Link href="/signup" className="btn-primary" style={{ padding: "8px 20px", fontSize: "14px" }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "8px" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid var(--color-cream-dark)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 500,
                color: "var(--color-charcoal)",
                textDecoration: "none",
                display: "block",
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {session ? (
              <>
                <Link
                  href={session.user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="btn-secondary"
                  style={{ textAlign: "center" }}
                >
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary" style={{ textAlign: "center" }}>
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary" style={{ textAlign: "center", justifyContent: "center" }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hide-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
