"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, Search, Globe } from "lucide-react";

const EMPTY_INSTRUCTOR = {
  name: "",
  title: "",
  bio: "",
  image: "",
  github: "",
  linkedin: "",
  twitter: "",
  instagram: "",
  youtube: "",
};

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_INSTRUCTOR);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchInstructors = async () => {
    try {
      const res = await fetch("/api/admin/instructors");
      const data = await res.json();
      setInstructors(data.instructors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_INSTRUCTOR);
    setError("");
    setShowForm(true);
  };

  const openEdit = (instructor) => {
    setEditing(instructor._id);
    setForm({
      name: instructor.name || "",
      title: instructor.title || "",
      bio: instructor.bio || "",
      image: instructor.image || "",
      github: instructor.github || "",
      linkedin: instructor.linkedin || "",
      twitter: instructor.twitter || "",
      instagram: instructor.instagram || "",
      youtube: instructor.youtube || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/admin/instructors/${editing}` : "/api/admin/instructors";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save instructor");
      setShowForm(false);
      fetchInstructors();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this instructor?")) return;
    try {
      const res = await fetch(`/api/admin/instructors/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchInstructors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = instructors.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Instructor Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{instructors.length} total instructors registered</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: "8px" }}>
          <Plus size={16} /> Add Instructor
        </button>
      </div>

      {/* Filter and Search */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", maxWidth: "400px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={16} color="var(--color-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            className="input-field"
            style={{ paddingLeft: "36px", marginBottom: 0 }}
            placeholder="Search by name or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading instructors...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "2px dashed var(--color-cream-dark)" }}>
          <p style={{ color: "var(--color-muted)", marginBottom: "16px" }}>No instructors match your search criteria.</p>
          <button onClick={openCreate} className="btn-primary" style={{ fontSize: "14px" }}>
            <Plus size={15} /> Add New Instructor
          </button>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Instructor Info</th>
                <th>Title</th>
                <th>Bio Summary</th>
                <th>Social Channels</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inst) => (
                <tr key={inst._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "var(--color-cream-dark)",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--color-charcoal)",
                          flexShrink: 0,
                        }}
                      >
                        {inst.image ? (
                          <img src={inst.image} alt={inst.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          inst.name.charAt(0)
                        )}
                      </div>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-charcoal)" }}>{inst.name}</p>
                    </div>
                  </td>
                  <td style={{ fontSize: "14px" }}>{inst.title}</td>
                  <td style={{ fontSize: "13px", color: "var(--color-muted)", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {inst.bio}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {["github", "linkedin", "twitter", "instagram", "youtube"].map((network) => {
                        const val = inst[network];
                        if (!val) return null;
                        return (
                          <span
                            key={network}
                            style={{
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              background: "rgba(28,28,28,0.06)",
                              color: "var(--color-charcoal-light)",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {network}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(inst)}
                        style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(inst._id)}
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
                {editing ? "Edit Instructor" : "Add Instructor"}
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
                <label className="form-label">Full Name</label>
                <input
                  className="input-field"
                  required
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Professional Title</label>
                <input
                  className="input-field"
                  required
                  placeholder="e.g. Senior Software Engineer at Netflix"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Bio Details</label>
                <textarea
                  className="input-field"
                  rows={4}
                  required
                  placeholder="Tell students about this instructor's experience and style..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Profile Image URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-charcoal)", borderTop: "1px solid var(--color-cream-dark)", paddingTop: "16px", marginTop: "8px", marginBottom: "4px" }}>
                Social Profiles & Links
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">GitHub</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://github.com/..."
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Twitter / X</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://twitter.com/..."
                    value={form.twitter}
                    onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Instagram</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://instagram.com/..."
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">YouTube Channel</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://youtube.com/@..."
                  value={form.youtube}
                  onChange={(e) => setForm({ ...form, youtube: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
                >
                  <Save size={15} />
                  {saving ? "Saving…" : editing ? "Update Details" : "Add Instructor"}
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
