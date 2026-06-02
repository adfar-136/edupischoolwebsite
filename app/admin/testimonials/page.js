"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, Search, Star } from "lucide-react";

const EMPTY_TESTIMONIAL = {
  name: "",
  location: "",
  text: "",
  avatar: "",
  batch: "",
  rating: 5,
  status: "published",
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_TESTIMONIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      setTestimonials(data.testimonials || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_TESTIMONIAL);
    setError("");
    setShowForm(true);
  };

  const openEdit = (testimonial) => {
    setEditing(testimonial._id);
    setForm({
      name: testimonial.name || "",
      location: testimonial.location || "",
      text: testimonial.text || "",
      avatar: testimonial.avatar || "",
      batch: testimonial.batch || "",
      rating: testimonial.rating || 5,
      status: testimonial.status || "published",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/admin/testimonials/${editing}` : "/api/admin/testimonials";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save testimonial");
      setShowForm(false);
      fetchTestimonials();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = testimonials.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.text.toLowerCase().includes(search.toLowerCase()) ||
      t.batch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Testimonials Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{testimonials.length} student reviews registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: "8px" }}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", maxWidth: "400px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} color="var(--color-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="input-field"
            style={{ paddingLeft: "36px", marginBottom: 0 }}
            placeholder="Search by student, text, or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading testimonials...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "2px dashed var(--color-cream-dark)" }}>
          <p style={{ color: "var(--color-muted)", marginBottom: "16px" }}>No testimonials found.</p>
          <button onClick={openCreate} className="btn-primary" style={{ fontSize: "14px" }}>
            <Plus size={15} /> Add Testimonial
          </button>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Batch &amp; Location</th>
                <th>Rating</th>
                <th>Review Text</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((test) => (
                <tr key={test._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {test.avatar && test.avatar.startsWith("http") ? (
                          <img src={test.avatar} alt={test.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        ) : (
                          test.avatar || test.name.charAt(0)
                        )}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-charcoal)" }}>{test.name}</p>
                    </div>
                  </td>
                  <td style={{ fontSize: "13px" }}>
                    <div>
                      <p style={{ fontWeight: 600, color: "var(--color-charcoal-light)" }}>{test.batch}</p>
                      <p style={{ color: "var(--color-muted)" }}>{test.location}</p>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          color={idx < (test.rating || 5) ? "#F4A942" : "#D1D5DB"}
                          fill={idx < (test.rating || 5) ? "#F4A942" : "none"}
                        />
                      ))}
                    </div>
                  </td>
                  <td style={{ fontSize: "13px", color: "var(--color-charcoal-light)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{test.text}"
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "50px",
                        fontSize: "11px",
                        fontWeight: 600,
                        background: test.status === "published" ? "rgba(45,106,79,0.1)" : "rgba(244,169,66,0.1)",
                        color: test.status === "published" ? "#2D6A4F" : "#D4891E",
                      }}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(test)}
                        style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test._id)}
                        style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(220,38,38,0.08)", border: "none", cursor: "pointer", color: "#B91C1C", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Drawer overlay */}
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
              maxWidth: "520px",
              background: "white",
              height: "100vh",
              overflow: "auto",
              padding: "32px",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.15)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)" }}>
                {editing ? "Edit Testimonial" : "Add Testimonial"}
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
                <label className="form-label">Student Name</label>
                <input
                  className="input-field"
                  required
                  placeholder="e.g. Bilal Ahmad"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Location</label>
                <input
                  className="input-field"
                  required
                  placeholder="e.g. Srinagar, Kashmir"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Batch Tag</label>
                  <input
                    className="input-field"
                    required
                    placeholder="e.g. FSD Batch"
                    value={form.batch}
                    onChange={(e) => setForm({ ...form, batch: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Rating</label>
                  <select
                    className="input-field"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star{r > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Avatar (Initials or Image URL)</label>
                <input
                  className="input-field"
                  placeholder="e.g. B (or https://...)"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Review Text</label>
                <textarea
                  className="input-field"
                  rows={5}
                  required
                  placeholder="Write the student's review..."
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
                >
                  <Save size={15} />
                  {saving ? "Saving…" : editing ? "Update Testimonial" : "Add Testimonial"}
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
