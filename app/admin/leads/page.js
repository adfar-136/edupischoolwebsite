"use client";

import { useState, useEffect } from "react";
import { Search, Trash2, PhoneCall, Mail, Calendar, User } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load leads");
      setLeads(data.leads || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
      } else {
        alert("Failed to delete lead");
      }
    } catch {
      alert("Error deleting lead");
    }
  };

  const filtered = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.number?.toLowerCase().includes(search.toLowerCase()) ||
      l.interest?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Leads &amp; Inquiries
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
            {leads.length} captured inquiries from the landing page form
          </p>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: "20px", maxWidth: "480px" }}>
        <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
        <input
          className="input-field"
          style={{ paddingLeft: "40px" }}
          placeholder="Search by name, email, phone or interest…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div style={{ padding: "12px", background: "rgba(220,38,38,0.08)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading leads…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: "white", padding: "60px 40px", borderRadius: "16px", textAlign: "center", border: "1.5px solid var(--color-cream-dark)" }}>
          <PhoneCall size={36} style={{ color: "var(--color-muted)", opacity: 0.4, margin: "0 auto 12px" }} />
          <p style={{ color: "var(--color-charcoal)", fontWeight: 600 }}>No leads found</p>
          <p style={{ color: "var(--color-muted)", fontSize: "13px", marginTop: "4px" }}>
            {search ? "Try checking your search keyword." : "Leads submitted via the home page form will appear here."}
          </p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-cream-dark)" }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Lead / Name</th>
                <th>Phone Number</th>
                <th>Interest Topic</th>
                <th>Date Captured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(244,169,66,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User size={14} color="var(--color-saffron-dark)" style={{ margin: "0 auto" }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "13.5px" }}>{lead.name}</p>
                        <p style={{ fontSize: "11px", color: "var(--color-muted)", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Mail size={10} /> {lead.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: "13px", fontWeight: 500 }}>
                    <a href={`tel:${lead.number}`} style={{ color: "var(--color-charcoal)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <PhoneCall size={12} color="var(--color-muted)" />
                      {lead.number}
                    </a>
                  </td>
                  <td>
                    <span className="badge badge-saffron" style={{ fontSize: "11px" }}>
                      {lead.interest}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "var(--color-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={11} />
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(lead._id)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        background: "rgba(220,38,38,0.06)",
                        border: "none",
                        cursor: "pointer",
                        color: "#DC2626",
                        fontWeight: 600,
                        fontSize: "12px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.06)")}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
