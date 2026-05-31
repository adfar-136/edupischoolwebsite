"use client";

import { useState, useEffect } from "react";
import { Award, Download, Copy, Check, Loader2, FileText, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [printingCert, setPrintingCert] = useState(null);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const res = await fetch("/api/certificates");
        if (!res.ok) throw new Error("Failed to load certificates");
        const data = await res.json();
        setCertificates(data.certificates || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your certificates. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (cert) => {
    setPrintingCert(cert);
    // Give state updates a moment to render before opening print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
        <Loader2 size={36} className="text-saffron" style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>Loading your achievements...</p>
      </div>
    );
  }

  return (
    <>
      {/* Styles for printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide standard layout */
          aside,
          .no-print {
            display: none !important;
          }
          
          /* Force page style to landscape */
          @page {
            size: landscape;
            margin: 0;
          }
          
          body,
          main,
          #__next,
          html {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .print-container {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 100vw !important;
            height: 100vh !important;
            background: #ffffff !important;
            padding: 2.5rem !important;
            box-sizing: border-box !important;
          }
        }
        
        @media screen {
          .print-container {
            display: none !important;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />

      {/* 1. Normal Dashboard UI (Screen View) */}
      <div className="no-print dashboard-container">
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "32px",
              fontWeight: 700,
              color: "var(--color-charcoal)",
              marginBottom: "6px",
            }}
          >
            My Certificates 🏆
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "15px" }}>
            Celebrate your academic milestones and download verified credentials.
          </p>
        </div>

        {error && (
          <div style={{ padding: "16px 20px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "12px", color: "#B91C1C", marginBottom: "24px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {certificates.length === 0 ? (
          <div
            style={{
              padding: "64px 32px",
              background: "white",
              borderRadius: "20px",
              boxShadow: "var(--shadow-card)",
              textAlign: "center",
              maxWidth: "600px",
              margin: "40px auto 0",
              border: "1.5px dashed var(--color-cream-dark)",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(244, 169, 66, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Award size={36} style={{ color: "var(--color-saffron)" }} />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "8px" }}>
              No Certificates Earned Yet
            </h3>
            <p style={{ color: "var(--color-muted)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>
              Certificates are automatically generated when you finish all lectures in a batch or attend our premier live masterclasses. Keep up the great work!
            </p>
            <Link href="/dashboard/batches" className="btn-primary">
              Continue Learning
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "white",
                  border: "1px solid rgba(28,28,28,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Visual badge top right */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                  }}
                >
                  <span
                    className={cert.type === "masterclass" ? "badge badge-forest" : "badge badge-saffron"}
                    style={{ fontSize: "10px", padding: "4px 10px", borderRadius: "30px", fontWeight: 700 }}
                  >
                    {cert.type === "masterclass" ? "Masterclass" : "Batch Course"}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: "28px 28px 24px 28px", flex: 1 }}>
                  <Award size={32} className="text-saffron" style={{ marginBottom: "16px" }} />
                  
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "var(--color-charcoal)",
                      lineHeight: "1.3",
                      marginBottom: "12px",
                      paddingRight: "80px", // leave space for badge
                    }}
                  >
                    {cert.courseTitle}
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-muted)" }}>
                      <Calendar size={14} />
                      <span>Issued: {new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--color-muted)" }}>
                      <ShieldCheck size={14} style={{ color: "var(--color-forest)" }} />
                      <span>Verifiable Credential</span>
                    </div>
                  </div>

                  {/* ID box */}
                  <div
                    style={{
                      background: "var(--color-cream)",
                      border: "1px solid var(--color-cream-dark)",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    <span style={{ color: "var(--color-muted)", fontWeight: 500 }}>ID: <strong style={{ color: "var(--color-charcoal)", fontFamily: "monospace" }}>{cert.certificateId}</strong></span>
                    <button
                      onClick={() => handleCopy(cert.certificateId)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: copiedId === cert.certificateId ? "var(--color-forest)" : "var(--color-muted)",
                        padding: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.2s",
                      }}
                      title="Copy Certificate ID"
                    >
                      {copiedId === cert.certificateId ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div
                  style={{
                    padding: "16px 28px",
                    borderTop: "1px solid rgba(28,28,28,0.06)",
                    background: "rgba(250,247,242,0.5)",
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() => handleDownload(cert)}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: "10px 16px",
                      fontSize: "13px",
                      borderRadius: "10px",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    <Download size={14} />
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Premium Printable Diploma (Invisible on Screen, Visible on Print) */}
      {printingCert && (
        <div className="print-container">
          <div
            style={{
              width: "100%",
              height: "100%",
              border: "16px solid var(--color-saffron)",
              padding: "4px",
              boxSizing: "border-box",
              background: "#FAF7F2",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                border: "2px solid var(--color-charcoal)",
                padding: "48px 64px",
                boxSizing: "border-box",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              {/* Top corner ornaments */}
              <div style={{ position: "absolute", top: 12, left: 12, width: 24, height: 24, borderTop: "3px solid var(--color-forest)", borderLeft: "3px solid var(--color-forest)" }}></div>
              <div style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderTop: "3px solid var(--color-forest)", borderRight: "3px solid var(--color-forest)" }}></div>
              {/* Bottom corner ornaments */}
              <div style={{ position: "absolute", bottom: 12, left: 12, width: 24, height: 24, borderBottom: "3px solid var(--color-forest)", borderLeft: "3px solid var(--color-forest)" }}></div>
              <div style={{ position: "absolute", bottom: 12, right: 12, width: 24, height: 24, borderBottom: "3px solid var(--color-forest)", borderRight: "3px solid var(--color-forest)" }}></div>

              {/* Logo / Header */}
              <div>
                <img
                  src="/logo.svg"
                  alt="EduPiSchool"
                  style={{ height: "64px", width: "auto", marginBottom: "12px", display: "inline-block" }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Institution of Advanced Learning & Technology
                </p>
              </div>

              {/* Title */}
              <div style={{ margin: "20px 0" }}>
                <h1
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "44px",
                    fontWeight: 800,
                    color: "var(--color-charcoal)",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  Certificate of Completion
                </h1>
                <div
                  style={{
                    width: "120px",
                    height: "3px",
                    background: "var(--color-saffron)",
                    margin: "12px auto 0",
                  }}
                ></div>
              </div>

              {/* Body Content */}
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontSize: "18px",
                    color: "var(--color-muted)",
                    marginBottom: "16px",
                  }}
                >
                  This is proudly presented to
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "var(--color-charcoal)",
                    textDecoration: "underline",
                    textDecorationColor: "var(--color-saffron)",
                    textUnderlineOffset: "8px",
                    textDecorationThickness: "2px",
                    margin: "0 0 20px 0",
                  }}
                >
                  {printingCert.userName}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "15px",
                    color: "var(--color-muted)",
                    maxWidth: "600px",
                    lineHeight: "1.6",
                    margin: "0 auto",
                  }}
                >
                  for successfully satisfying all curriculum requirements and actively completing the advanced curriculum of
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--color-forest)",
                    marginTop: "16px",
                    marginBottom: "0",
                  }}
                >
                  {printingCert.courseTitle}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "12px",
                    color: "var(--color-muted)",
                    marginTop: "6px",
                  }}
                >
                  ({printingCert.type === "masterclass" ? "A Specialized Academic Masterclass" : "An Intensive Cohort Batch Program"})
                </p>
              </div>

              {/* Signatures & Credentials */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginTop: "20px",
                }}
              >
                {/* Left Side: Issuing Authority / Signature */}
                <div style={{ textAlign: "left", width: "240px" }}>
                  <div
                    style={{
                      fontFamily: "Playfair Display",
                      fontStyle: "italic",
                      fontSize: "22px",
                      color: "var(--color-charcoal-light)",
                      marginBottom: "6px",
                      height: "36px",
                      lineHeight: "36px",
                    }}
                  >
                    Adfar Rasheed
                  </div>
                  <div style={{ borderTop: "1px solid var(--color-muted)", paddingTop: "6px" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", fontWeight: 700, color: "var(--color-charcoal)", margin: 0, textTransform: "uppercase" }}>
                      Director of Education
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", color: "var(--color-muted)", margin: 0 }}>
                      EduPiSchool Academics
                    </p>
                  </div>
                </div>

                {/* Center: Award Seal */}
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "2px dashed var(--color-saffron-dark)",
                    background: "rgba(244, 169, 66, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Award size={36} style={{ color: "var(--color-saffron-dark)" }} />
                </div>

                {/* Right Side: Credential verification details */}
                <div style={{ textAlign: "right", width: "240px" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "12px", color: "var(--color-charcoal)", margin: "0 0 4px 0" }}>
                    <strong>Date:</strong> {new Date(printingCert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <div style={{ borderTop: "1px solid var(--color-muted)", paddingTop: "6px" }}>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 700, color: "var(--color-charcoal)", margin: 0, textTransform: "uppercase" }}>
                      Credential Verification
                    </p>
                    <p style={{ fontFamily: "monospace", fontSize: "10px", color: "var(--color-muted)", margin: 0, fontWeight: "bold" }}>
                      ID: {printingCert.certificateId}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
