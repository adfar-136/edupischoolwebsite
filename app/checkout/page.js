"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { GraduationCap, ShieldCheck, CreditCard, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "batch" or "masterclass"
  const id = searchParams.get("id");

  const { data: session, isPending } = authClient.useSession();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !type) return;

    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/checkout/item?type=${type}&id=${id}`);
        const data = await res.json();
        setItem(data);
      } catch {
        setError("Could not load item details. Please go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, type]);

  const handleConfirm = async () => {
    if (!session) {
      router.push(`/login?redirect=/checkout?type=${type}&id=${id}`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // TODO: Razorpay payment integration goes here
      // Example:
      // const order = await fetch("/api/payment/create-order", { method: "POST", body: JSON.stringify({ amount: item.price }) }).then(r => r.json());
      // const rzp = new Razorpay({ key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, order_id: order.id, ... });
      // rzp.open();

      // For now: direct enrollment/booking without payment
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--color-cream-dark)",
              borderTopColor: "var(--color-saffron)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--color-muted)" }}>Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(45,106,79,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <CheckCircle size={40} color="var(--color-forest)" />
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, marginBottom: "12px" }}>
          {type === "batch" ? "Enrollment Confirmed!" : "Booking Confirmed!"}
        </h2>
        <p style={{ color: "var(--color-muted)", fontSize: "16px" }}>
          Redirecting you to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 24px" }}>
      {/* Payment Gateway Coming Soon Banner */}
      <div
        style={{
          padding: "14px 18px",
          background: "rgba(244,169,66,0.1)",
          border: "1px solid rgba(244,169,66,0.3)",
          borderRadius: "12px",
          marginBottom: "28px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <AlertTriangle size={18} color="var(--color-saffron-dark)" style={{ flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-saffron-dark)", marginBottom: "4px" }}>
            Payment Gateway Coming Soon
          </p>
          <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)", lineHeight: 1.5 }}>
            Razorpay integration is under development. Enrollment is free right now — you will be billed when payment goes live.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: "40px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "26px",
            fontWeight: 700,
            color: "var(--color-charcoal)",
            marginBottom: "28px",
          }}
        >
          {type === "batch" ? "Batch Enrollment" : "Masterclass Booking"}
        </h1>

        {/* Item Summary */}
        {item ? (
          <div
            style={{
              padding: "20px",
              background: "var(--color-cream)",
              borderRadius: "12px",
              marginBottom: "28px",
              border: "1px solid var(--color-cream-dark)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span className="badge badge-saffron" style={{ marginBottom: "8px", display: "inline-block" }}>
                  {type === "batch" ? "Long-term Batch" : "Sunday Masterclass"}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
                  {item.title || item.topic}
                </h3>
                {item.duration && (
                  <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>{item.duration} months · 3 sessions / week</p>
                )}
                {item.scheduledAt && (
                  <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>
                    {new Date(item.scheduledAt).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}
                  </p>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--color-charcoal)" }}>
                  ₹{(item.fees || item.price || 199).toLocaleString("en-IN")}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-muted)" }}>one-time</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "20px", background: "var(--color-cream)", borderRadius: "12px", marginBottom: "28px", color: "var(--color-muted)", fontSize: "14px" }}>
            Item not found. Please go back and try again.
          </div>
        )}

        {/* User Info (prefilled) */}
        {session && (
          <div style={{ marginBottom: "28px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "16px" }}>
              Your Details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", display: "block", marginBottom: "6px" }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  readOnly
                  value={session.user.name || ""}
                  className="input-field"
                  style={{ background: "var(--color-cream)", cursor: "default", fontSize: "14px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", display: "block", marginBottom: "6px" }}>
                  EMAIL
                </label>
                <input
                  type="email"
                  readOnly
                  value={session.user.email || ""}
                  className="input-field"
                  style={{ background: "var(--color-cream)", cursor: "default", fontSize: "14px" }}
                />
              </div>
            </div>
          </div>
        )}

        {!session && (
          <div style={{ marginBottom: "24px", padding: "16px", background: "rgba(244,169,66,0.06)", borderRadius: "12px", border: "1px solid rgba(244,169,66,0.2)" }}>
            <p style={{ fontSize: "14px", color: "var(--color-charcoal)", marginBottom: "10px" }}>
              You need to sign in to complete this enrollment.
            </p>
            <Link href={`/login?redirect=/checkout?type=${type}&id=${id}`} className="btn-primary" style={{ fontSize: "14px", padding: "10px 20px" }}>
              Sign In to Continue
            </Link>
          </div>
        )}

        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Order summary */}
        {item && (
          <div style={{ padding: "16px 0", borderTop: "1px solid var(--color-cream-dark)", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "14px", color: "var(--color-muted)" }}>{item.title || item.topic}</span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>₹{(item.fees || item.price || 199).toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--color-cream-dark)", marginTop: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "15px" }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 800, color: "var(--color-charcoal)" }}>
                ₹{(item.fees || item.price || 199).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!session || !item || submitting}
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            fontSize: "16px",
            padding: "14px",
            opacity: !session || !item || submitting ? 0.6 : 1,
            cursor: !session || !item || submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Processing…" : type === "batch" ? "Confirm Enrollment" : "Confirm Booking"}
          {!submitting && <ArrowRight size={16} />}
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px" }}>
          <ShieldCheck size={14} color="var(--color-forest)" />
          <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>
            Secure enrollment · Your data is private
          </span>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link href={type === "batch" ? "/batches" : "/masterclasses"} style={{ color: "var(--color-muted)", fontSize: "14px", textDecoration: "none" }}>
          ← Go back
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-cream)", paddingTop: "60px", paddingBottom: "80px" }}>
      {/* Mini header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #F4A942, #D4891E)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={18} color="white" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)" }}>
            EdupiSchool
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
          {["Item", "Details", "Confirm"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: i === 1 ? "var(--color-saffron)" : "var(--color-cream-dark)",
                  color: i === 1 ? "white" : "var(--color-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: i === 1 ? "var(--color-charcoal)" : "var(--color-muted)" }}>
                {step}
              </span>
              {i < 2 && <div style={{ width: 24, height: "1px", background: "var(--color-cream-dark)", marginLeft: "4px" }} />}
            </div>
          ))}
        </div>
      </div>

      <Suspense fallback={<div style={{ textAlign: "center", color: "var(--color-muted)" }}>Loading…</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
