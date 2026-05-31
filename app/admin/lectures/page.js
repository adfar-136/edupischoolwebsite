"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, ExternalLink } from "lucide-react";

const EMPTY_LECTURE = {
  batchId: "",
  lectureNumber: 1,
  title: "",
  description: "",
  scheduledAt: "",
  joinLink: "",
  recordingLink: "",
  resources: [],
  completed: false,
  moduleName: "",
  notes: "",
};

export default function AdminLecturesPage() {
  const [lectures, setLectures] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_LECTURE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [newResource, setNewResource] = useState({ name: "", url: "" });

  const fetchData = async () => {
    const res = await fetch("/api/admin/lectures");
    const data = await res.json();
    setLectures(data.lectures || []);
    setBatches(data.batches || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_LECTURE, batchId: batches[0]?._id || "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (lecture) => {
    setEditing(lecture._id);
    setForm({
      batchId: lecture.batchId,
      lectureNumber: lecture.lectureNumber,
      title: lecture.title,
      description: lecture.description || "",
      scheduledAt: lecture.scheduledAt ? lecture.scheduledAt.slice(0, 16) : "",
      joinLink: lecture.joinLink || "",
      recordingLink: lecture.recordingLink || "",
      resources: lecture.resources || [],
      completed: lecture.completed || false,
      moduleName: lecture.moduleName || "",
      notes: lecture.notes || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/admin/lectures/${editing}` : "/api/admin/lectures";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
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
    if (!confirm("Delete this lecture?")) return;
    await fetch(`/api/admin/lectures/${id}`, { method: "DELETE" });
    fetchData();
  };

  const addResource = () => {
    if (!newResource.name || !newResource.url) return;
    setForm({ ...form, resources: [...form.resources, { ...newResource }] });
    setNewResource({ name: "", url: "" });
  };

  const removeResource = (i) => {
    setForm({ ...form, resources: form.resources.filter((_, idx) => idx !== i) });
  };

  const filtered = filterBatch === "all" ? lectures : lectures.filter((l) => l.batchId === filterBatch);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Lecture Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{lectures.length} total lectures</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Lecture
        </button>
      </div>

      {/* Batch filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => setFilterBatch("all")}
          style={{ padding: "6px 14px", borderRadius: "50px", fontSize: "13px", fontWeight: 600, border: "1.5px solid", cursor: "pointer", background: filterBatch === "all" ? "var(--color-charcoal)" : "transparent", color: filterBatch === "all" ? "white" : "var(--color-charcoal)", borderColor: filterBatch === "all" ? "var(--color-charcoal)" : "var(--color-cream-dark)" }}
        >
          All Batches
        </button>
        {batches.map((b) => (
          <button
            key={b._id}
            onClick={() => setFilterBatch(b._id)}
            style={{ padding: "6px 14px", borderRadius: "50px", fontSize: "13px", fontWeight: 600, border: "1.5px solid", cursor: "pointer", background: filterBatch === b._id ? "var(--color-charcoal)" : "transparent", color: filterBatch === b._id ? "white" : "var(--color-charcoal)", borderColor: filterBatch === b._id ? "var(--color-charcoal)" : "var(--color-cream-dark)" }}
          >
            {b.title}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading…</div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Batch</th>
                <th>Scheduled</th>
                <th>Join Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lecture) => (
                <tr key={lecture._id}>
                  <td style={{ fontWeight: 700, color: "var(--color-saffron-dark)", fontSize: "14px" }}>
                    {lecture.lectureNumber}
                  </td>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: "14px" }}>{lecture.title}</p>
                    {lecture.completed && (
                      <span style={{ fontSize: "11px", color: "var(--color-forest)", fontWeight: 600 }}>✓ Completed</span>
                    )}
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--color-muted)" }}>{lecture.batchTitle}</td>
                  <td style={{ fontSize: "13px" }}>
                    {lecture.scheduledAt
                      ? new Date(lecture.scheduledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                  </td>
                  <td>
                    {lecture.joinLink ? (
                      <a href={lecture.joinLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--color-forest)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ExternalLink size={11} /> Join Link
                      </a>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--color-muted)" }}>Not set</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => openEdit(lecture)} style={{ padding: "5px 10px", borderRadius: "6px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Edit size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(lecture._id)} style={{ padding: "5px 10px", borderRadius: "6px", background: "rgba(220,38,38,0.08)", border: "none", cursor: "pointer", color: "#B91C1C", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide-in form */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div style={{ width: "100%", maxWidth: "600px", background: "white", height: "100vh", overflow: "auto", padding: "32px", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)" }}>
                {editing ? "Edit Lecture" : "Add Lecture"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            {error && <div style={{ padding: "12px", background: "rgba(220,38,38,0.08)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "16px" }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Batch</label>
                <select className="input-field" value={form.batchId} onChange={(e) => setForm({ ...form, batchId: e.target.value })} required>
                  <option value="">Select batch…</option>
                  {batches.map((b) => <option key={b._id} value={b._id}>{b.title}</option>)}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Lecture #</label>
                  <input type="number" min={1} className="input-field" required value={form.lectureNumber} onChange={(e) => setForm({ ...form, lectureNumber: parseInt(e.target.value) })} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Title</label>
                  <input className="input-field" required placeholder="Lecture title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Description</label>
                <textarea className="input-field" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Module Name</label>
                <input className="input-field" placeholder="e.g. Web Development &amp; JS Basics" value={form.moduleName} onChange={(e) => setForm({ ...form, moduleName: e.target.value })} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes &amp; Key Takeaways (One per line)</label>
                <textarea className="input-field" rows={4} placeholder="Takeaway 1&#10;Takeaway 2&#10;Takeaway 3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ resize: "vertical" }} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Scheduled Date & Time</label>
                <input type="datetime-local" className="input-field" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Zoom / Meet Join Link</label>
                <input type="url" className="input-field" placeholder="https://meet.google.com/..." value={form.joinLink} onChange={(e) => setForm({ ...form, joinLink: e.target.value })} />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Google Drive Recording Link (add after session)</label>
                <input type="url" className="input-field" placeholder="https://drive.google.com/..." value={form.recordingLink} onChange={(e) => setForm({ ...form, recordingLink: e.target.value })} />
              </div>

              {/* Resources */}
              <div>
                <label className="form-label" style={{ marginBottom: "10px", display: "block" }}>Resources</label>
                {form.resources.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", flex: 1, color: "var(--color-charcoal)" }}>{r.name} → {r.url}</span>
                    <button type="button" onClick={() => removeResource(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#B91C1C" }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "8px", marginTop: "8px" }}>
                  <input className="input-field" placeholder="Resource name" value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} style={{ fontSize: "13px" }} />
                  <input type="url" className="input-field" placeholder="URL" value={newResource.url} onChange={(e) => setNewResource({ ...newResource, url: e.target.value })} style={{ fontSize: "13px" }} />
                  <button type="button" onClick={addResource} className="btn-forest" style={{ padding: "8px 12px", fontSize: "13px" }}>
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="completed-toggle" checked={form.completed} onChange={(e) => setForm({ ...form, completed: e.target.checked })} style={{ width: 16, height: 16 }} />
                <label htmlFor="completed-toggle" className="form-label" style={{ margin: 0 }}>Mark as Completed</label>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} />
                  {saving ? "Saving…" : editing ? "Update Lecture" : "Add Lecture"}
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
