"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, UserMinus, BookOpen, Calendar } from "lucide-react";

export default function AdminStudentsPage() {
  const [data, setData] = useState({ users: [], batches: [], masterclasses: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [acting, setActing] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/admin/students");
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const performAction = async (action, payload) => {
    setActing(true);
    await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, userId: selectedUser._id, ...payload }),
    });
    await fetchData();
    // refresh the selected user
    setSelectedUser((prev) => {
      if (!prev) return null;
      const updated = data.users.find((u) => u._id === prev._id);
      return updated || prev;
    });
    setActing(false);
  };

  const filtered = data.users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const enrolledBatchSet = new Set(selectedUser?.enrolledBatches || []);
  const bookedMCSet = new Set(selectedUser?.bookedMasterclasses || []);

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
          Student Management
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{data.users.length} registered students</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
        {/* Students table */}
        <div>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
            <input
              className="input-field"
              style={{ paddingLeft: "40px" }}
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading…</div>
          ) : (
            <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
              <table className="data-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Role</th>
                    <th>Enrolled In</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => setSelectedUser(user)}
                      style={{ cursor: "pointer", background: selectedUser?._id === user._id ? "rgba(244,169,66,0.05)" : "transparent" }}
                    >
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "white", flexShrink: 0, fontFamily: "var(--font-display)" }}>
                            {user.name?.charAt(0)?.toUpperCase() || "S"}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: "13px" }}>{user.name}</p>
                            <p style={{ fontSize: "11px", color: "var(--color-muted)" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding: "3px 8px", borderRadius: "50px", fontSize: "11px", fontWeight: 600, background: user.role === "admin" ? "rgba(244,169,66,0.15)" : "rgba(45,106,79,0.1)", color: user.role === "admin" ? "var(--color-saffron-dark)" : "var(--color-forest)" }}>
                          {user.role || "student"}
                        </span>
                      </td>
                      <td style={{ fontSize: "13px", color: "var(--color-muted)" }}>
                        {user.enrolledBatches?.length || 0} batch(es)
                      </td>
                      <td style={{ fontSize: "12px", color: "var(--color-muted)" }}>
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "—"}
                      </td>
                      <td>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                          style={{ padding: "5px 10px", borderRadius: "6px", background: "rgba(244,169,66,0.1)", border: "none", cursor: "pointer", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "12px" }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right panel: manage selected user */}
        <div>
          {selectedUser ? (
            <div className="card" style={{ padding: "24px", position: "sticky", top: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "white", fontFamily: "var(--font-display)" }}>
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--color-charcoal)" }}>{selectedUser.name}</p>
                  <p style={{ fontSize: "12px", color: "var(--color-muted)" }}>{selectedUser.email}</p>
                </div>
              </div>

              {/* Batch management */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                  Batch Enrollments
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {data.batches.map((batch) => {
                    const isEnrolled = selectedUser.enrolledBatches.includes(batch._id);
                    return (
                      <div key={batch._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: isEnrolled ? "rgba(45,106,79,0.07)" : "var(--color-cream)", borderRadius: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <BookOpen size={13} color={isEnrolled ? "var(--color-forest)" : "var(--color-muted)"} />
                          <span style={{ fontSize: "13px", fontWeight: 500, color: isEnrolled ? "var(--color-forest)" : "var(--color-charcoal)" }}>{batch.title}</span>
                        </div>
                        <button
                          disabled={acting}
                          onClick={() => performAction(isEnrolled ? "unenroll" : "enroll", { batchId: batch._id })}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "none",
                            cursor: acting ? "not-allowed" : "pointer",
                            background: isEnrolled ? "rgba(220,38,38,0.08)" : "rgba(45,106,79,0.1)",
                            color: isEnrolled ? "#B91C1C" : "var(--color-forest)",
                            fontSize: "11px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            opacity: acting ? 0.6 : 1,
                          }}
                        >
                          {isEnrolled ? <><UserMinus size={11} /> Remove</> : <><UserPlus size={11} /> Enroll</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Masterclass management */}
              {data.masterclasses.length > 0 && (
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                    Masterclass Bookings
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {data.masterclasses.map((mc) => {
                      const isBooked = selectedUser.bookedMasterclasses.includes(mc._id);
                      return (
                        <div key={mc._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: isBooked ? "rgba(244,169,66,0.07)" : "var(--color-cream)", borderRadius: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Calendar size={13} color={isBooked ? "var(--color-saffron-dark)" : "var(--color-muted)"} />
                            <span style={{ fontSize: "12px", fontWeight: 500, color: isBooked ? "var(--color-saffron-dark)" : "var(--color-charcoal)" }}>{mc.topic}</span>
                          </div>
                          <button
                            disabled={acting}
                            onClick={() => performAction(isBooked ? "unbook" : "book", { masterclassId: mc._id })}
                            style={{ padding: "4px 10px", borderRadius: "6px", border: "none", cursor: acting ? "not-allowed" : "pointer", background: isBooked ? "rgba(220,38,38,0.08)" : "rgba(244,169,66,0.1)", color: isBooked ? "#B91C1C" : "var(--color-saffron-dark)", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", opacity: acting ? 0.6 : 1 }}
                          >
                            {isBooked ? <><UserMinus size={11} /> Remove</> : <><UserPlus size={11} /> Book</>}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: "40px 24px", background: "white", borderRadius: "16px", textAlign: "center", border: "2px dashed var(--color-cream-dark)" }}>
              <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>Select a student to manage their enrollments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
