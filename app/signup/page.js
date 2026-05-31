"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await authClient.signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { level: "weak", color: "#DC2626", text: "Too short" };
    if (p.length < 10) return { level: "medium", color: "#D97706", text: "Medium" };
    return { level: "strong", color: "#059669", text: "Strong" };
  };

  const strength = passwordStrength();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,169,66,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,106,79,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", textDecoration: "none", justifyContent: "center", marginBottom: "36px" }}
        >
          <img src="/logo.svg" alt="EdupiSchool" style={{ height: "46px", width: "auto" }} />
        </Link>

        <div className="card" style={{ padding: "40px", borderRadius: "24px" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px", textAlign: "center" }}>
            Create your account
          </h1>
          <p style={{ textAlign: "center", fontSize: "15px", color: "var(--color-muted)", marginBottom: "28px" }}>
            Join thousands of students learning from Kashmir
          </p>

          {/* Benefits */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", padding: "16px", background: "rgba(45,106,79,0.05)", borderRadius: "12px" }}>
            {["Access to all batch enrollment", "Book Sunday masterclasses", "Track your learning progress"].map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-charcoal-light)", fontWeight: 500 }}>
                <CheckCircle size={14} color="var(--color-forest)" />
                {b}
              </div>
            ))}
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            style={{
              width: "100%",
              padding: "12px 20px",
              background: "white",
              border: "1.5px solid var(--color-cream-dark)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--color-charcoal)",
              cursor: "pointer",
              transition: "border-color 0.2s ease",
              marginBottom: "20px",
              fontFamily: "var(--font-sans)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Sign up with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--color-cream-dark)" }} />
            <span style={{ fontSize: "13px", color: "var(--color-muted)", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "var(--color-cream-dark)" }} />
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "20px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input
                  id="signup-name"
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: "42px" }}
                  placeholder="Adfar Rasheed"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email address</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="input-field"
                  style={{ paddingLeft: "42px" }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                <input
                  id="signup-password"
                  type={showPass ? "text" : "password"}
                  required
                  className="input-field"
                  style={{ paddingLeft: "42px", paddingRight: "42px" }}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)", padding: 0, display: "flex" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {strength && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <div style={{ flex: 1, height: "4px", background: "var(--color-cream-dark)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: strength.level === "weak" ? "33%" : strength.level === "medium" ? "66%" : "100%",
                      background: strength.color,
                      borderRadius: "4px",
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: "12px", color: strength.color, fontWeight: 600, minWidth: "50px" }}>{strength.text}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", fontSize: "16px", padding: "14px", marginTop: "8px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account…" : "Create Account"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--color-muted)", marginTop: "20px" }}>
            By signing up, you agree to our terms of service.{" "}
          </p>

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--color-muted)", marginTop: "16px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--color-saffron-dark)", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
