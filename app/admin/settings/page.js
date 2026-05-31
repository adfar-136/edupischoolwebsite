"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  ExternalLink,
  Globe
} from "lucide-react";

// Inline brand SVGs for maximum robustness across different environments
function InstagramIcon({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

export default function AdminSettingsPage() {
  const [links, setLinks] = useState({
    instagram: "",
    linkedin: "",
    youtube: "",
    twitter: "",
    customLinks: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // New Custom Link State Form
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newIcon, setNewIcon] = useState("🔗");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (!json.error) {
          setLinks({
            instagram: json.instagram || "",
            linkedin: json.linkedin || "",
            youtube: json.youtube || "",
            twitter: json.twitter || "",
            customLinks: json.customLinks || []
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links)
      });
      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        setMessage({ type: "error", text: json.error || "Failed to save settings." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setSaving(false);
      // Auto-clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddCustomLink = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    setLinks((prev) => ({
      ...prev,
      customLinks: [
        ...prev.customLinks,
        {
          title: newTitle.trim(),
          url: newUrl.trim(),
          icon: newIcon.trim() || "🔗"
        }
      ]
    }));

    // Reset custom form state
    setNewTitle("");
    setNewUrl("");
    setNewIcon("🔗");
  };

  const handleDeleteCustomLink = (indexToDelete) => {
    setLinks((prev) => ({
      ...prev,
      customLinks: prev.customLinks.filter((_, idx) => idx !== indexToDelete)
    }));
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: "800px" }}>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "4px" }}>
            Settings &amp; Branding
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>
            Manage your social media channels and append dynamic link cards for your website.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "var(--color-forest)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "14px",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {message && (
        <div 
          style={{
            padding: "14px 20px",
            borderRadius: "8px",
            marginBottom: "24px",
            fontSize: "14px",
            fontWeight: 600,
            background: message.type === "success" ? "rgba(45,106,79,0.1)" : "rgba(220,38,38,0.08)",
            color: message.type === "success" ? "var(--color-forest-dark)" : "#B91C1C",
            border: message.type === "success" ? "1px solid rgba(45,106,79,0.2)" : "1px solid rgba(220,38,38,0.15)"
          }}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>Loading settings...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* Section 1: Standard Social Channels */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Settings size={18} color="var(--color-forest)" /> Primary Social Links
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--color-charcoal-light)", marginBottom: "6px" }}>
                  <InstagramIcon size={15} style={{ color: "#E1306C" }} /> Instagram Link
                </label>
                <input
                  className="input-field"
                  placeholder="https://instagram.com/yourusername"
                  value={links.instagram}
                  onChange={(e) => setLinks({ ...links, instagram: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--color-charcoal-light)", marginBottom: "6px" }}>
                  <LinkedinIcon size={15} style={{ color: "#0A66C2" }} /> LinkedIn Link
                </label>
                <input
                  className="input-field"
                  placeholder="https://linkedin.com/in/yourusername"
                  value={links.linkedin}
                  onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--color-charcoal-light)", marginBottom: "6px" }}>
                  <YoutubeIcon size={15} style={{ color: "#FF0000" }} /> YouTube Channel
                </label>
                <input
                  className="input-field"
                  placeholder="https://youtube.com/@yourchannel"
                  value={links.youtube}
                  onChange={(e) => setLinks({ ...links, youtube: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, color: "var(--color-charcoal-light)", marginBottom: "6px" }}>
                  <TwitterIcon size={15} style={{ color: "#1DA1F2" }} /> Twitter / X Link
                </label>
                <input
                  className="input-field"
                  placeholder="https://twitter.com/yourusername"
                  value={links.twitter}
                  onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Custom Site Sections / Link Cards */}
          <div className="card" style={{ padding: "28px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} color="var(--color-forest)" /> Custom Link Cards
            </h3>
            <p style={{ fontSize: "12.5px", color: "var(--color-muted)", margin: "0 0 20px" }}>
              Add secondary sections or directories dynamically (e.g. GitHub, Telegram groups, WhatsApp community).
            </p>

            {/* List of active custom links */}
            {links.customLinks.length === 0 ? (
              <div style={{ padding: "24px", background: "var(--color-cream)", borderRadius: "10px", border: "1.5px dashed var(--color-cream-dark)", textAlign: "center", marginBottom: "24px" }}>
                <span style={{ fontSize: "13px", color: "var(--color-muted)" }}>No custom link cards added yet. Add one below!</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                {links.customLinks.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "white",
                      border: "1.5px solid var(--color-cream-dark)",
                      borderRadius: "10px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "20px" }}>{item.icon}</span>
                      <div>
                        <p style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--color-charcoal)", margin: 0 }}>
                          {item.title}
                        </p>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={{ fontSize: "11px", color: "var(--color-muted)", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none" }}
                        >
                          {item.url} <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteCustomLink(index)}
                      style={{
                        background: "rgba(220,38,38,0.08)",
                        color: "#B91C1C",
                        border: "none",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Form to add a new custom card */}
            <form onSubmit={handleAddCustomLink} style={{ background: "var(--color-cream)", padding: "20px", borderRadius: "12px", border: "1px solid var(--color-cream-dark)" }}>
              <h4 style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--color-charcoal)", margin: "0 0 16px" }}>
                ➕ Create a New Link Card
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "80px 1.5fr 2fr", gap: "12px", marginBottom: "16px", alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Icon</label>
                  <input
                    className="input-field"
                    style={{ textAlign: "center", fontSize: "18px" }}
                    placeholder="🔗"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Card Title</label>
                  <input
                    className="input-field"
                    placeholder="GitHub Profile"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Target URL</label>
                  <input
                    className="input-field"
                    placeholder="https://github.com/..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!newTitle.trim() || !newUrl.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  background: (!newTitle.trim() || !newUrl.trim()) ? "var(--color-cream-dark)" : "var(--color-forest)",
                  color: (!newTitle.trim() || !newUrl.trim()) ? "var(--color-muted)" : "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: (!newTitle.trim() || !newUrl.trim()) ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <Plus size={14} /> Add Card
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
