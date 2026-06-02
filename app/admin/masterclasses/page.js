"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

const EMPTY = { topic: "", description: "", scheduledAt: "", price: 199, joinLink: "", recordingLink: "", instructorName: "", instructorTitle: "" };

export default function AdminMasterclassesPage() {
  const [masterclasses, setMasterclasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    const res = await fetch("/api/admin/masterclasses");
    const data = await res.json();
    setMasterclasses(data.masterclasses || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setShowForm(true);
  };

  const openEdit = (mc) => {
    setEditing(mc._id);
    setForm({
      topic: mc.topic || "",
      description: mc.description || "",
      scheduledAt: mc.scheduledAt ? mc.scheduledAt.slice(0, 16) : "",
      price: mc.price || 199,
      joinLink: mc.joinLink || "",
      recordingLink: mc.recordingLink || "",
      instructorName: mc.instructorName || "",
      instructorTitle: mc.instructorTitle || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/admin/masterclasses/${editing}` : "/api/admin/masterclasses";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setShowForm(false);
      fetchData();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this masterclass?")) return;
    await fetch(`/api/admin/masterclasses/${id}`, { method: "DELETE" });
    fetchData();
  };

  const now = new Date();

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Masterclass Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{masterclasses.length} total sessions</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Create Masterclass
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {masterclasses.map((mc) => {
            const isPast = new Date(mc.scheduledAt) < now;
            return (
              <div key={mc._id} className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                      <span className="badge badge-saffron">{isPast ? "Past" : "Upcoming"}</span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-saffron-dark)" }}>₹{mc.price}</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
                      {mc.topic}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--color-muted)", marginBottom: "8px" }}>{mc.description}</p>
                    <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--color-muted)", flexWrap: "wrap" }}>
                      <span>📅 {mc.scheduledAt ? new Date(mc.scheduledAt).toLocaleString("en-IN") : "Not set"}</span>
                      <span>👤 {mc.instructorName || "Adfar Rasheed"}</span>
                      {mc.joinLink && <span>🔗 Join link set</span>}
                      {mc.recordingLink && <span>🎥 Recording available</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => openEdit(mc)} style={{ padding: "7px 14px", borderRadius: "8px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Edit size={12} /> Edit
                    </button>
                    <button onClick={() => handleDelete(mc._id)} style={{ padding: "7px 14px", borderRadius: "8px", background: "rgba(220,38,38,0.08)", border: "none", cursor: "pointer", color: "#B91C1C", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={{ width: "100%", maxWidth: "520px", background: "white", height: "100vh", overflow: "auto", padding: "32px", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700 }}>
                {editing ? "Edit Masterclass" : "Create Masterclass"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>

            {error && <div style={{ padding: "12px", background: "rgba(220,38,38,0.08)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "16px" }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Topic</label>
                <input className="input-field" required placeholder="e.g. Next.js 15 Deep Dive" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Scheduled Date & Time</label>
                <input type="datetime-local" className="input-field" required value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Price (₹)</label>
                <input type="number" min={0} className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Zoom / Meet Join Link</label>
                <input type="url" className="input-field" placeholder="https://meet.google.com/..." value={form.joinLink} onChange={(e) => setForm({ ...form, joinLink: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Instructor Name</label>
                  <input className="input-field" placeholder="e.g. Adfar Rasheed" value={form.instructorName || ""} onChange={(e) => setForm({ ...form, instructorName: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Instructor Title</label>
                  <input className="input-field" placeholder="e.g. Lead Educator" value={form.instructorTitle || ""} onChange={(e) => setForm({ ...form, instructorTitle: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Google Drive Recording Link (post-session)</label>
                <input type="url" className="input-field" placeholder="https://drive.google.com/..." value={form.recordingLink} onChange={(e) => setForm({ ...form, recordingLink: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {saving ? "Saving…" : editing ? "Update" : "Create Masterclass"}
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
