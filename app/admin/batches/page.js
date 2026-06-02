"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Archive, CheckCircle, XCircle, Trash2, X, Save } from "lucide-react";

const EMPTY_BATCH = {
  title: "",
  slug: "",
  description: "",
  category: "FSD",
  duration: 6,
  fees: 0,
  startDate: "",
  thumbnail: "",
  status: "draft",
  instructorName: "",
  instructorTitle: "",
};

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_BATCH);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchBatches = async () => {
    const res = await fetch("/api/admin/batches");
    const data = await res.json();
    setBatches(data.batches || []);
    setLoading(false);
  };

  useEffect(() => { fetchBatches(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_BATCH);
    setError("");
    setShowForm(true);
  };

  const openEdit = (batch) => {
    setEditing(batch._id);
    setForm({
      title: batch.title || "",
      slug: batch.slug || "",
      description: batch.description || "",
      category: batch.category || "FSD",
      duration: batch.duration || 6,
      fees: batch.fees || 0,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split("T")[0] : "",
      thumbnail: batch.thumbnail || "",
      status: batch.status || "draft",
      instructorName: batch.instructorName || "",
      instructorTitle: batch.instructorTitle || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/admin/batches/${editing}` : "/api/admin/batches";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setShowForm(false);
      fetchBatches();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (id) => {
    if (!confirm("Archive this batch?")) return;
    await fetch(`/api/admin/batches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    fetchBatches();
  };

  const autoSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const STATUS_BADGE = {
    draft: { bg: "rgba(245,158,11,0.1)", color: "#B45309" },
    active: { bg: "rgba(45,106,79,0.1)", color: "#2D6A4F" },
    completed: { bg: "rgba(100,100,100,0.1)", color: "#6B7280" },
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Batch Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{batches.length} total batches</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: "8px" }}>
          <Plus size={16} /> Create Batch
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading…</div>
      ) : batches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "2px dashed var(--color-cream-dark)" }}>
          <p style={{ color: "var(--color-muted)", marginBottom: "16px" }}>No batches yet.</p>
          <button onClick={openCreate} className="btn-primary" style={{ fontSize: "14px" }}>
            <Plus size={15} /> Create your first batch
          </button>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Fees</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => {
                const s = STATUS_BADGE[batch.status] || STATUS_BADGE.draft;
                return (
                  <tr key={batch._id}>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-charcoal)" }}>{batch.title}</p>
                        <p style={{ fontSize: "12px", color: "var(--color-muted)" }}>
                          /{batch.slug} · Instructor: {batch.instructorName || "Adfar Rasheed"}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-saffron" style={{ fontSize: "11px" }}>{batch.category}</span>
                    </td>
                    <td style={{ fontSize: "14px" }}>{batch.duration} months</td>
                    <td style={{ fontSize: "14px", fontWeight: 600 }}>₹{batch.fees?.toLocaleString("en-IN")}</td>
                    <td>
                      <span style={{ padding: "4px 10px", borderRadius: "50px", fontSize: "12px", fontWeight: 600, background: s.bg, color: s.color }}>
                        {batch.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => openEdit(batch)}
                          style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                        {batch.status !== "completed" && (
                          <button
                            onClick={() => handleArchive(batch._id)}
                            style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(100,100,100,0.1)", border: "none", cursor: "pointer", color: "#6B7280", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            <Archive size={12} /> Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Drawer */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 200,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "white",
              height: "100vh",
              overflow: "auto",
              padding: "32px",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)" }}>
                {editing ? "Edit Batch" : "Create Batch"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-muted)" }}>
                <X size={22} />
              </button>
            </div>

            {error && (
              <div style={{ padding: "12px 16px", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "20px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Title</label>
                <input
                  className="input-field"
                  required
                  placeholder="Full Stack Development"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Slug</label>
                <input
                  className="input-field"
                  required
                  placeholder="full-stack-development"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea
                  className="input-field"
                  rows={4}
                  required
                  placeholder="What will students learn in this batch?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Category</label>
                  <select
                    className="input-field"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="FSD">Full Stack Dev</option>
                    <option value="DSA">DSA</option>
                    <option value="GenAI">Generative AI</option>
                    <option value="DataAnalytics">Data Analytics</option>
                    <option value="DataScience">Data Science</option>
                    <option value="Fundamentals">Programming Fundamentals</option>
                    <option value="CyberSecurity">Cyber Security</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Status</label>
                  <select
                    className="input-field"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Duration (months)</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    min={1}
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fees (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                    min={0}
                    value={form.fees}
                    onChange={(e) => setForm({ ...form, fees: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Thumbnail Image URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://..."
                  value={form.thumbnail}
                  onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Instructor Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Adfar Rasheed"
                    value={form.instructorName}
                    onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Instructor Title</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Lead Educator"
                    value={form.instructorTitle}
                    onChange={(e) => setForm({ ...form, instructorTitle: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
                >
                  <Save size={15} />
                  {saving ? "Saving…" : editing ? "Update Batch" : "Create Batch"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                  style={{ padding: "12px 20px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
