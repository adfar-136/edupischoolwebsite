"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X, Save } from "lucide-react";

const EMPTY = { lectureId: "", title: "", description: "", deadline: "" };

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    const [aRes, lRes] = await Promise.all([
      fetch("/api/admin/assignments"),
      fetch("/api/admin/lectures"),
    ]);
    const aData = await aRes.json();
    const lData = await lRes.json();
    setAssignments(aData.assignments || []);
    setLectures(lData.lectures || []);
    setBatches(lData.batches || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const handleDelete = async (id) => {
    if (!confirm("Delete this assignment?")) return;
    await fetch(`/api/admin/assignments/${id}`, { method: "DELETE" });
    fetchData();
  };

  const lectureMap = {};
  lectures.forEach((l) => { lectureMap[l._id] = `#${l.lectureNumber}: ${l.title}`; });

  const batchMap = {};
  batches.forEach((b) => { batchMap[b._id] = b.title; });

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Assignment Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{assignments.length} total assignments</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(""); setForm(EMPTY); }} className="btn-primary">
          <Plus size={16} /> Attach Assignment
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading…</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {assignments.map((a) => (
            <div key={a._id} className="card" style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span className="badge" style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5", marginBottom: "8px", display: "inline-block", fontSize: "11px" }}>
                    Assignment
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>{a.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)", marginBottom: "8px" }}>{a.description}</p>
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--color-muted)" }}>
                    <span>📚 {lectureMap[a.lectureId] || "Unknown lecture"}</span>
                    <span>⏰ Due: {a.deadline ? new Date(a.deadline).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" }) : "No deadline"}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(a._id)} style={{ padding: "7px 12px", borderRadius: "8px", background: "rgba(220,38,38,0.08)", border: "none", cursor: "pointer", color: "#B91C1C", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  <Trash2 size={12} /> Delete
                </button>
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
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700 }}>Attach Assignment</h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={22} /></button>
            </div>

            {error && <div style={{ padding: "12px", background: "rgba(220,38,38,0.08)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "16px" }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Attach to Lecture</label>
                <select className="input-field" required value={form.lectureId} onChange={(e) => setForm({ ...form, lectureId: e.target.value })}>
                  <option value="">Select lecture…</option>
                  {lectures.map((l) => (
                    <option key={l._id} value={l._id}>
                      [{batchMap[l.batchId] || "?"}] #{l.lectureNumber}: {l.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assignment Title</label>
                <input className="input-field" required placeholder="Build a REST API" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea className="input-field" rows={4} required placeholder="What should students build or do?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Submission Deadline</label>
                <input type="datetime-local" className="input-field" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {saving ? "Saving…" : "Attach Assignment"}
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
