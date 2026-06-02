"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";

const EMPTY_MODULE = {
  name: "",
  batchId: "",
};

export default function AdminModulesPage() {
  const [modules, setModules] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_MODULE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterBatch, setFilterBatch] = useState("all");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/modules");
      const data = await res.json();
      setModules(data.modules || []);
      setBatches(data.batches || []);
    } catch (e) {
      console.error("Failed to fetch modules:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", batchId: batches[0]?._id || "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (mod) => {
    setEditing(mod._id);
    setForm({
      name: mod.name || "",
      batchId: mod.batchId || "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editing ? `/api/admin/modules/${editing}` : "/api/admin/modules";
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
    if (!confirm("Are you sure you want to delete this module? This might leave lectures inside this module without a valid container.")) return;
    await fetch(`/api/admin/modules/${id}`, { method: "DELETE" });
    fetchData();
  };

  // Filter modules
  const filtered = modules.filter((m) => {
    const matchesBatch = filterBatch === "all" || m.batchId === filterBatch;
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.batchTitle.toLowerCase().includes(search.toLowerCase());
    return matchesBatch && matchesSearch;
  });

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Module Management
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{modules.length} total modules defined</p>
        </div>
        <button onClick={openCreate} className="btn-primary" style={{ gap: "8px" }}>
          <Plus size={16} /> Add Module
        </button>
      </div>

      {/* Filters bar */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search by module name or batch..."
          className="input-field"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "320px", margin: 0 }}
        />
        
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "var(--color-muted)" }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "2px dashed var(--color-cream-dark)" }}>
          <p style={{ color: "var(--color-muted)", marginBottom: "16px" }}>No modules found.</p>
          <button onClick={openCreate} className="btn-primary" style={{ fontSize: "14px" }}>
            <Plus size={15} /> Add your first module
          </button>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
          <table className="data-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Module Name</th>
                <th>Assigned Course (Batch)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mod) => (
                <tr key={mod._id}>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-charcoal)" }}>{mod.name}</p>
                  </td>
                  <td>
                    <span className="badge badge-saffron" style={{ fontSize: "12px" }}>{mod.batchTitle}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => openEdit(mod)} style={{ padding: "5px 10px", borderRadius: "6px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Edit size={11} /> Edit
                      </button>
                      <button onClick={() => handleDelete(mod._id)} style={{ padding: "5px 10px", borderRadius: "6px", background: "rgba(220,38,38,0.08)", border: "none", cursor: "pointer", color: "#B91C1C", fontWeight: 600, fontSize: "12px", display: "flex", alignItems: "center", gap: "3px" }}>
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
          <div style={{ width: "100%", maxWidth: "560px", background: "white", height: "100vh", overflow: "auto", padding: "32px", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)" }}>
                {editing ? "Edit Module" : "Add Module"}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={22} />
              </button>
            </div>

            {error && <div style={{ padding: "12px", background: "rgba(220,38,38,0.08)", borderRadius: "10px", fontSize: "14px", color: "#B91C1C", marginBottom: "16px" }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Course (Batch)</label>
                <select
                  className="input-field"
                  value={form.batchId}
                  onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                  required
                >
                  <option value="">Select a Course...</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Module Name</label>
                <input
                  className="input-field"
                  required
                  placeholder="e.g. Web Development &amp; JS Basics"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} />
                  {saving ? "Saving…" : editing ? "Update Module" : "Create Module"}
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
