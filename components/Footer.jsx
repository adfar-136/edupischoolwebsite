import Link from "next/link";
import { Mail } from "lucide-react";

// Inline social icons for compatibility with older lucide-react versions
function YoutubeIcon({ size = 16, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ size = 16, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-charcoal)",
        color: "rgba(255,255,255,0.7)",
        padding: "64px 0 32px",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", marginBottom: "16px" }}>
              <img src="/logo.svg" alt="EdupiSchool" style={{ height: "42px", width: "auto" }} />
            </Link>
            <p style={{ fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
              EduPiS School is a premium tech academy offering live upskilling cohorts in Full Stack, DSA, Data Science, Cyber Security, and more, led by Adfar Rasheed and industry professionals.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { icon: YoutubeIcon, href: "https://www.youtube.com/@adfar-rasheed", label: "YouTube" },
                { icon: LinkedinIcon, href: "https://www.linkedin.com/in/adfar-rasheed/", label: "LinkedIn" },
                { icon: TwitterIcon, href: "https://twitter.com/adfarrasheed", label: "Twitter" },
                { icon: InstagramIcon, href: "https://www.instagram.com/adfarsirofficial?igsh=ZGU2ZDVlOXlqbDdx&utm_source=qr", label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              Learn
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { href: "/batches", label: "All Batches" },
                { href: "/batches?category=FSD", label: "Full Stack Dev" },
                { href: "/batches?category=DSA", label: "DSA" },
                { href: "/masterclasses", label: "Sunday Masterclasses" },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="footer-nav-link"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { href: "/about", label: "About the Founder" },
                { href: "/blog", label: "Blog" },
                { href: "/login", label: "Student Login" },
                { href: "/signup", label: "Join EdupiSchool" },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="footer-nav-link"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                color: "white",
                fontFamily: "var(--font-display)",
                fontSize: "16px",
                marginBottom: "20px",
                fontWeight: 600,
              }}
            >
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <a
                href="mailto:adfar@edupischool.com"
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Mail size={14} />
                adfar@edupischool.com
              </a>
              <p style={{ fontSize: "14px" }}>
                Kashmir, India
              </p>
              <p style={{ fontSize: "13px", marginTop: "8px", lineHeight: 1.6 }}>
                3 live sessions every week.<br />
                Reach out for batch queries and partnerships.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "13px" }}>
            © {new Date().getFullYear()} EdupiSchool. All rights reserved.
          </p>
          <p style={{ fontSize: "13px" }}>
            Made with ♥ from{" "}
            <span style={{ color: "#F4A942" }}>Kashmir 🌸</span>
          </p>
        </div>
      </div>


    </footer>
  );
}
