"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function HeroLeadForm() {
  const [form, setForm] = useState({ name: "", email: "", interest: "Full Stack Development", number: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit. Please try again.");

      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "360px",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(45,106,79,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            animation: "scaleUp 0.3s ease forwards"
          }}
        >
          <CheckCircle2 size={32} color="var(--color-forest)" />
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--color-charcoal)",
            marginBottom: "8px",
          }}
        >
          Inquiry Received!
        </h3>
        <p style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.6, maxWidth: "280px" }}>
          Thank you, <strong style={{ color: "var(--color-charcoal)" }}>{form.name}</strong>. Our team of experts will get in touch with you shortly to share details. 🌸
        </p>
        <style>{`
          @keyframes scaleUp {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <Sparkles size={16} color="var(--color-saffron-dark)" />
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--color-charcoal)", margin: 0 }}>
          Get Free Counselling
        </h3>
      </div>
      <p style={{ fontSize: "13px", color: "var(--color-muted)", marginBottom: "20px", lineHeight: 1.5 }}>
        Fill out your details to get a direct syllabus brochure and request a callback from our team of experts.
      </p>

      {error && (
        <div style={{ padding: "10px 12px", background: "rgba(220,38,38,0.08)", borderRadius: "8px", fontSize: "12.5px", color: "#B91C1C", marginBottom: "16px", border: "1px solid rgba(220,38,38,0.15)" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: "11px", marginBottom: "4px" }}>Full Name</label>
          <input
            type="text"
            required
            placeholder="Aarav Sharma"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ fontSize: "13.5px", padding: "8px 12px" }}
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: "11px", marginBottom: "4px" }}>Email address</label>
          <input
            type="email"
            required
            placeholder="aarav@gmail.com"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ fontSize: "13.5px", padding: "8px 12px" }}
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: "11px", marginBottom: "4px" }}>Phone Number</label>
          <input
            type="tel"
            required
            placeholder="+91 98765 43210"
            className="input-field"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            style={{ fontSize: "13.5px", padding: "8px 12px" }}
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontSize: "11px", marginBottom: "4px" }}>Course Interest</label>
          <select
            className="input-field"
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
            style={{ fontSize: "13.5px", padding: "8px 12px", background: "white" }}
            disabled={loading}
          >
            <option value="Full Stack Development">Full Stack Development (FSD)</option>
            <option value="DSA &amp; Coding Interviews">DSA &amp; Coding Interviews (DSA)</option>
            <option value="Sunday Masterclasses">Sunday Masterclasses</option>
            <option value="Other / General Query">Other / General Query</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            fontSize: "14px",
            padding: "10px 14px",
            marginTop: "6px",
            boxShadow: "0 4px 12px rgba(244,169,66,0.25)"
          }}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              Get Free Counselling
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
