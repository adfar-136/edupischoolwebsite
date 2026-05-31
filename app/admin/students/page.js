"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  UserPlus, 
  UserMinus, 
  BookOpen, 
  Calendar, 
  Download, 
  Users, 
  GraduationCap, 
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Award
} from "lucide-react";

export default function AdminStudentsPage() {
  const [data, setData] = useState({ users: [], batches: [], masterclasses: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [acting, setActing] = useState(false);
  
  // Navigation Tabs: "overview" (batch/masterclass metrics dashboard) or "management" (individual user enrollment manager)
  const [activeTab, setActiveTab] = useState("overview");
  
  // Selected dashboard card for detailed view (defaults to first batch or null)
  const [selectedDashboardItem, setSelectedDashboardItem] = useState(null);
  const [dashboardSearch, setDashboardSearch] = useState("");

  // Certificate system state
  const [certificates, setCertificates] = useState([]);
  const [actingCert, setActingCert] = useState(null);
  const [certMessage, setCertMessage] = useState(null);

  const fetchData = async () => {
    const res = await fetch("/api/admin/students");
    const json = await res.json();
    setData(json);

    try {
      const certRes = await fetch("/api/admin/certificates");
      if (certRes.ok) {
        const certData = await certRes.json();
        setCertificates(certData.certificates || []);
      }
    } catch (e) {
      console.error("Failed to load certificates in admin:", e);
    }
    
    setLoading(false);
    
    // Auto-select first batch as default dashboard item once loaded
    if (json.batches?.length > 0 && !selectedDashboardItem) {
      setSelectedDashboardItem({ type: "batch", ...json.batches[0] });
    }
  };

  const handleIssueCertificate = async (userId, masterclassId) => {
    setActingCert(userId);
    setCertMessage(null);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, masterclassId }),
      });
      const result = await res.json();
      if (!res.ok) {
        setCertMessage({ type: "error", text: result.error || "Failed to issue certificate" });
      } else {
        setCertMessage({ type: "success", text: "Certificate issued successfully!" });
        await fetchData();
      }
    } catch (e) {
      console.error(e);
      setCertMessage({ type: "error", text: "Connection error. Failed to issue certificate." });
    } finally {
      setActingCert(null);
    }
  };

  const handleRevokeCertificate = async (certificateId) => {
    setActingCert(certificateId);
    setCertMessage(null);
    try {
      const res = await fetch("/api/admin/certificates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId }),
      });
      const result = await res.json();
      if (!res.ok) {
        setCertMessage({ type: "error", text: result.error || "Failed to revoke certificate" });
      } else {
        setCertMessage({ type: "success", text: "Certificate revoked successfully." });
        await fetchData();
      }
    } catch (e) {
      console.error(e);
      setCertMessage({ type: "error", text: "Connection error. Failed to revoke certificate." });
    } finally {
      setActingCert(null);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

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

  // CSV Sheet Downloader Utility
  const handleDownloadCSV = (title, enrolledStudentIds) => {
    const enrolledStudents = data.users.filter(u => enrolledStudentIds.includes(u._id));
    
    const headers = ["Student Name", "Email Address", "System Role", "Joined Date"];
    const rows = enrolledStudents.map(s => [
      s.name || "—",
      s.email || "—",
      s.role || "student",
      s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"
    ]);
    
    // Add UTF-8 Byte Order Mark (\uFEFF) for seamless Microsoft Excel and Google Sheets parsing
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_students_sheet.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter students for the individual manager tab
  const filtered = data.users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Computations for overall summary statistics card
  const totalBatchEnrollments = data.users.reduce((acc, u) => acc + (u.enrolledBatches?.length || 0), 0);
  const totalMCBookings = data.users.reduce((acc, u) => acc + (u.bookedMasterclasses?.length || 0), 0);

  // Get users belonging to the currently selected dashboard item (Batch or Masterclass)
  const getDashboardStudents = () => {
    if (!selectedDashboardItem) return [];
    
    if (selectedDashboardItem.type === "batch") {
      return data.users.filter(u => u.enrolledBatches?.includes(selectedDashboardItem._id));
    } else {
      return data.users.filter(u => u.bookedMasterclasses?.includes(selectedDashboardItem._id));
    }
  };

  const dashboardStudents = getDashboardStudents();
  const filteredDashboardStudents = dashboardStudents.filter(u => 
    u.name?.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(dashboardSearch.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Title & Total Statistics Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Student Management &amp; Analytics
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
            Monitor dynamic enrollments, analyze learning metrics, and export data sheets.
          </p>
        </div>
      </div>

      {/* Premium Navigation Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1.5px solid var(--color-cream-dark)", paddingBottom: "12px" }}>
        <button
          onClick={() => setActiveTab("overview")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: activeTab === "overview" ? "rgba(45,106,79,0.1)" : "transparent",
            color: activeTab === "overview" ? "var(--color-forest-dark)" : "var(--color-muted)",
            fontSize: "14.5px",
            fontWeight: 700,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <BarChart3 size={16} /> Batch-Wise Dashboard
        </button>
        <button
          onClick={() => setActiveTab("management")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: activeTab === "management" ? "rgba(45,106,79,0.1)" : "transparent",
            color: activeTab === "management" ? "var(--color-forest-dark)" : "var(--color-muted)",
            fontSize: "14.5px",
            fontWeight: 700,
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <Users size={16} /> Individual Enrollment Manager
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "var(--color-muted)" }}>
          <div style={{ fontSize: "18px", fontWeight: 600 }}>Analyzing database...</div>
          <div style={{ fontSize: "13px", marginTop: "8px" }}>Fetching latest enrollment vectors</div>
        </div>
      ) : (
        <>
          {/* TAB 1: BATCH-WISE METRICS & DASHBOARD */}
          {activeTab === "overview" && (
            <div>
              {/* Overall Summary Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "28px" }}>
                <div className="card" style={{ padding: "20px", background: "white", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(244,169,66,0.12)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center", color: "var(--color-saffron-dark)" }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase" }}>Registered Students</span>
                    <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-charcoal)", margin: "2px 0 0" }}>{data.users.length}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: "20px", background: "white", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(45,106,79,0.1)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center", color: "var(--color-forest)" }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase" }}>Total Batch Enrollments</span>
                    <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-charcoal)", margin: "2px 0 0" }}>{totalBatchEnrollments}</h3>
                  </div>
                </div>

                <div className="card" style={{ padding: "20px", background: "white", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "12px", background: "rgba(45,106,79,0.1)", display: "flex", alignItems: "center", justifySelf: "center", justifyContent: "center", color: "var(--color-forest)" }}>
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-muted)", textTransform: "uppercase" }}>Masterclass Bookings</span>
                    <h3 style={{ fontSize: "24px", fontWeight: 800, color: "var(--color-charcoal)", margin: "2px 0 0" }}>{totalMCBookings}</h3>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Layout */}
              <div className="admin-split-grid">
                {/* Left Panel: Batches & Masterclasses Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                      📚 Long-Term Batches
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {data.batches.map((batch) => {
                        const enrolledCount = data.users.filter(u => u.enrolledBatches?.includes(batch._id)).length;
                        const isSelected = selectedDashboardItem?.type === "batch" && selectedDashboardItem._id === batch._id;
                        
                        return (
                          <div 
                            key={batch._id}
                            onClick={() => {
                              setSelectedDashboardItem({ type: "batch", ...batch });
                              setDashboardSearch("");
                            }}
                            className="card"
                            style={{
                              padding: "16px",
                              background: isSelected ? "white" : "rgba(255,255,255,0.6)",
                              border: isSelected ? "2px solid var(--color-forest)" : "1.5px solid var(--color-cream-dark)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow: isSelected ? "var(--shadow-card-hover)" : "none",
                              position: "relative"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(45,106,79,0.1)", color: "var(--color-forest-dark)", padding: "2px 8px", borderRadius: "50px" }}>
                                {batch.status || "active"}
                              </span>
                              <span style={{ fontSize: "12px", color: "var(--color-muted)", fontWeight: 600 }}>
                                {enrolledCount} Student(s)
                              </span>
                            </div>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 6px", color: "var(--color-charcoal)" }}>{batch.title}</h4>
                            <p style={{ fontSize: "11.5px", color: "var(--color-muted)", margin: 0 }}>₹{batch.price} · {batch.duration || "Self-Paced"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                      🎯 Scheduled Masterclasses
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {data.masterclasses.map((mc) => {
                        const bookedCount = data.users.filter(u => u.bookedMasterclasses?.includes(mc._id)).length;
                        const isSelected = selectedDashboardItem?.type === "masterclass" && selectedDashboardItem._id === mc._id;
                        
                        return (
                          <div 
                            key={mc._id}
                            onClick={() => {
                              setSelectedDashboardItem({ type: "masterclass", ...mc });
                              setDashboardSearch("");
                            }}
                            className="card"
                            style={{
                              padding: "16px",
                              background: isSelected ? "white" : "rgba(255,255,255,0.6)",
                              border: isSelected ? "2px solid var(--color-saffron)" : "1.5px solid var(--color-cream-dark)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow: isSelected ? "var(--shadow-card-hover)" : "none",
                              position: "relative"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                              <span style={{ fontSize: "11px", fontWeight: 700, background: "rgba(244,169,66,0.15)", color: "var(--color-saffron-dark)", padding: "2px 8px", borderRadius: "50px" }}>
                                Masterclass
                              </span>
                              <span style={{ fontSize: "12px", color: "var(--color-muted)", fontWeight: 600 }}>
                                {bookedCount} Booked
                              </span>
                            </div>
                            <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 6px", color: "var(--color-charcoal)" }}>{mc.topic}</h4>
                            <p style={{ fontSize: "11.5px", color: "var(--color-muted)", margin: 0 }}>
                              {mc.scheduledAt ? new Date(mc.scheduledAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "TBA"}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Detailed Metrics and Enrolled Students breakdown */}
                <div>
                  {selectedDashboardItem ? (
                    <div className="card" style={{ padding: "28px", background: "white" }}>
                      {/* Dashboard Item Header Info */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px", borderBottom: "1.5px solid var(--color-cream-dark)", paddingBottom: "20px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            {selectedDashboardItem.type === "batch" ? (
                              <BookOpen size={16} color="var(--color-forest)" />
                            ) : (
                              <Calendar size={16} color="var(--color-saffron)" />
                            )}
                            <span style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-muted)" }}>
                              {selectedDashboardItem.type === "batch" ? "Long-Term Course Batch" : "Sunday Masterclass"}
                            </span>
                          </div>
                          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", margin: 0 }}>
                            {selectedDashboardItem.type === "batch" ? selectedDashboardItem.title : selectedDashboardItem.topic}
                          </h2>
                        </div>

                        {/* SHEET DOWNLOAD BUTTON */}
                        <button
                          onClick={() => {
                            const studentIds = dashboardStudents.map(s => s._id);
                            const title = selectedDashboardItem.type === "batch" ? selectedDashboardItem.title : selectedDashboardItem.topic;
                            handleDownloadCSV(title, studentIds);
                          }}
                          disabled={dashboardStudents.length === 0}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 18px",
                            background: dashboardStudents.length === 0 ? "var(--color-cream-dark)" : "var(--color-forest)",
                            color: dashboardStudents.length === 0 ? "var(--color-muted)" : "white",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: "13.5px",
                            cursor: dashboardStudents.length === 0 ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <Download size={15} /> Export Excel Sheet (.csv)
                        </button>
                      </div>

                      {certMessage && (
                        <div
                          style={{
                            padding: "12px 16px",
                            background: certMessage.type === "success" ? "rgba(45,106,79,0.08)" : "rgba(220,38,38,0.08)",
                            border: `1px solid ${certMessage.type === "success" ? "rgba(45,106,79,0.2)" : "rgba(220,38,38,0.2)"}`,
                            color: certMessage.type === "success" ? "var(--color-forest-dark)" : "#B91C1C",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            fontSize: "13px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <span>{certMessage.text}</span>
                          <button
                            onClick={() => setCertMessage(null)}
                            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      {/* Summary Cards */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                        <div style={{ background: "var(--color-cream)", borderRadius: "12px", padding: "16px", border: "1.5px solid var(--color-cream-dark)" }}>
                          <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--color-muted)" }}>Total Enrolled Directory</span>
                          <h4 style={{ fontSize: "22px", fontWeight: 800, color: "var(--color-charcoal)", margin: "4px 0 0" }}>
                            {dashboardStudents.length} Students
                          </h4>
                        </div>
                        <div style={{ background: "var(--color-cream)", borderRadius: "12px", padding: "16px", border: "1.5px solid var(--color-cream-dark)" }}>
                          <span style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--color-muted)" }}>Status</span>
                          <h4 style={{ fontSize: "16px", fontWeight: 800, color: "var(--color-forest)", margin: "8px 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 size={15} /> Active Vector Verified
                          </h4>
                        </div>
                      </div>

                      {/* Students List in selected item */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--color-charcoal)", margin: 0 }}>
                            Enrolled Students Roster ({dashboardStudents.length})
                          </h4>
                          
                          {/* Live Search inside active dashboard breakdown list */}
                          <div style={{ position: "relative", width: "220px" }}>
                            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-muted)" }} />
                            <input
                              className="input-field"
                              style={{ padding: "6px 12px 6px 30px", fontSize: "12.5px" }}
                              placeholder="Search roster..."
                              value={dashboardSearch}
                              onChange={(e) => setDashboardSearch(e.target.value)}
                            />
                          </div>
                        </div>

                        {dashboardStudents.length === 0 ? (
                          <div style={{ padding: "48px 24px", textAlign: "center", background: "var(--color-cream)", borderRadius: "12px", border: "1.5px dashed var(--color-cream-dark)" }}>
                            <p style={{ color: "var(--color-muted)", fontSize: "13.5px", margin: 0 }}>
                              No students are currently enrolled in this {selectedDashboardItem.type === "batch" ? "batch" : "masterclass"}.
                            </p>
                          </div>
                        ) : (
                          <div className="data-table-wrapper" style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <table className="data-table" style={{ width: "100%" }}>
                              <thead>
                                <tr>
                                  <th>Student Details</th>
                                  <th>Status</th>
                                  <th>Enrolled Date</th>
                                  {selectedDashboardItem?.type === "masterclass" && <th>Certificate</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {filteredDashboardStudents.map((s) => (
                                  <tr key={s._id}>
                                    <td>
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                                          {s.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                          <p style={{ fontWeight: 600, fontSize: "12.5px", margin: 0 }}>{s.name}</p>
                                          <p style={{ fontSize: "10.5px", color: "var(--color-muted)", margin: 0 }}>{s.email}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span style={{ padding: "2px 6px", background: "rgba(45,106,79,0.08)", color: "var(--color-forest-dark)", fontSize: "10px", fontWeight: 700, borderRadius: "4px" }}>
                                        Active
                                      </span>
                                    </td>
                                    <td style={{ fontSize: "11.5px", color: "var(--color-muted)" }}>
                                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                    </td>
                                    {selectedDashboardItem?.type === "masterclass" && (
                                      <td>
                                        {(() => {
                                          const cert = certificates.find(
                                            (c) => c.userId === s._id && (c.courseId === selectedDashboardItem._id || c.courseId?.toString() === selectedDashboardItem._id)
                                          );
                                          if (cert) {
                                            return (
                                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-forest-dark)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                  <Award size={12} style={{ color: "var(--color-forest)" }} /> Issued
                                                </span>
                                                <button
                                                  onClick={() => handleRevokeCertificate(cert.certificateId)}
                                                  disabled={actingCert === cert.certificateId}
                                                  style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#DC2626",
                                                    fontSize: "10px",
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    padding: "2px 4px",
                                                    textDecoration: "underline"
                                                  }}
                                                >
                                                  {actingCert === cert.certificateId ? "Revoking..." : "Revoke"}
                                                </button>
                                              </div>
                                            );
                                          }
                                          return (
                                            <button
                                              onClick={() => handleIssueCertificate(s._id, selectedDashboardItem._id)}
                                              disabled={actingCert === s._id}
                                              style={{
                                                padding: "4px 10px",
                                                background: "rgba(244, 169, 66, 0.15)",
                                                color: "var(--color-saffron-dark)",
                                                border: "1.5px solid var(--color-saffron)",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: 700,
                                                cursor: "pointer",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                transition: "all 0.2s"
                                              }}
                                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244, 169, 66, 0.25)" }}
                                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(244, 169, 66, 0.15)" }}
                                            >
                                              {actingCert === s._id ? (
                                                "Issuing..."
                                              ) : (
                                                <>
                                                  <Award size={12} /> Issue Cert
                                                </>
                                              )}
                                            </button>
                                          );
                                        })()}
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "80px 24px", background: "white", borderRadius: "16px", textAlign: "center", border: "2px dashed var(--color-cream-dark)" }}>
                      <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>Select a batch or masterclass card from the left panel to explore metrics.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INDIVIDUAL ENROLLMENT MANAGER (ORIGINAL VIEW) */}
          {activeTab === "management" && (
            <div className="admin-manager-grid">
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

                <div className="data-table-wrapper" style={{ background: "white", boxShadow: "var(--shadow-card)", border: "none" }}>
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
                          const isEnrolled = Array.isArray(selectedUser?.enrolledBatches) && selectedUser.enrolledBatches.includes(batch._id);
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
                            const isBooked = Array.isArray(selectedUser?.bookedMasterclasses) && selectedUser.bookedMasterclasses.includes(mc._id);
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
          )}
        </>
      )}
    </div>
  );
}
