"use client";

import { useState, useEffect } from "react";
import { Plus, Pin, PinOff, Trash2, X, Save } from "lucide-react";

const EMPTY = { title: "", content: "", batchId: "", isPinned: false };

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    const [annRes, batchRes] = await Promise.all([
      fetch("/api/admin/announcements"),
      fetch("/api/admin/batches"),
    ]);
    const annData = await annRes.json();
    const batchData = await batchRes.json();
    setAnnouncements(annData.announcements || []);
    setBatches(batchData.batches || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, batchId: form.batchId || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setShowForm(false);
      setForm(EMPTY);
      fetchData();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const togglePin = async (ann) => {
    await fetch(`/api/admin/announcements/${ann._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPinned: !ann.isPinned }),
    });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    fetchData();
  };

  const batchMap = {};
  batches.forEach((b) => { batchMap[b._id] = b.title; });

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Announcements
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{announcements.length} total announcements</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(""); setForm(EMPTY); }} className="btn-primary">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading…</div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "2px dashed var(--color-cream-dark)" }}>
          <p style={{ color: "var(--color-muted)", marginBottom: "16px" }}>No announcements yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {announcements.map((ann) => (
            <div
              key={ann._id}
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px 24px",
                border: `1px solid ${ann.isPinned ? "rgba(244,169,66,0.3)" : "var(--color-cream-dark)"}`,
                borderLeft: ann.isPinned ? "4px solid var(--color-saffron)" : "4px solid transparent",
                boxShadow: ann.isPinned ? "var(--shadow-card)" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    {ann.isPinned && <span className="badge badge-saffron">📌 Pinned</span>}
                    {ann.batchId ? (
                      <span className="badge badge-forest">{batchMap[ann.batchId] || "Batch-specific"}</span>
                    ) : (
                      <span className="badge" style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5" }}>Global</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px" }}>
                    {ann.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--color-charcoal-light)", lineHeight: 1.6 }}>{ann.content}</p>
                  <p style={{ fontSize: "12px", color: "var(--color-muted)", marginTop: "8px" }}>
                    {ann.createdAt ? new Date(ann.createdAt).toLocaleString("en-IN") : ""}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", marginLeft: "16px", flexShrink: 0 }}>
                  <button
                    onClick={() => togglePin(ann)}
                    title={ann.isPinned ? "Unpin" : "Pin"}
                    style={{ padding: "7px 12px", borderRadius: "8px", background: ann.isPinned ? "rgba(244,169,66,0.15)" : "var(--color-cream-dark)", border: "none", cursor: "pointer", color: ann.isPinned ? "var(--color-saffron-dark)" : "var(--color-muted)", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 }}
                  >
                    {ann.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
                    {ann.isPinned ? "Unpin" : "Pin"}
                  </button>
                  <button
                    onClick={() => handleDelete(ann._id)}
                    style={{ padding: "7px 12px", borderRadius: "8px", background: "rgba(220,38,38,0.08)", border: "none", cursor: "pointer", color: "#B91C1C", display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600 }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ width: "100%", maxWidth: "480px", background: "white", height: "100vh", overflow: "auto", padding: "32px", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700 }}>New Announcement</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>

            {error && <div style={{ padding: "12px", background: "rgba(220,38,38,0.08)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "16px" }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title</label>
                <input className="input-field" required placeholder="Announcement title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Content</label>
                <textarea className="input-field" rows={4} required placeholder="Announcement details…" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Batch (optional — leave empty for global)</label>
                <select className="input-field" value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })}>
                  <option value="">Global (all students)</option>
                  {batches.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="pin-toggle" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} style={{ width: 16, height: 16 }} />
                <label htmlFor="pin-toggle" className="form-label" style={{ margin: 0 }}>Pin this announcement</label>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {saving ? "Saving…" : "Create Announcement"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ padding: "12px 20px" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
