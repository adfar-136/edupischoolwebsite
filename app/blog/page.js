import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";
import { Clock, ArrowRight, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog — EdupiSchool",
  description: "Insights on Full Stack Development, DSA, and Generative AI by Adfar Rasheed from Kashmir.",
};

const CATEGORY_COLORS = {
  FSD: { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8" },
  DSA: { bg: "rgba(45,106,79,0.1)", color: "#2D6A4F" },
  GenAI: { bg: "rgba(244,169,66,0.15)", color: "#D4891E" },
  Personal: { bg: "rgba(168,85,247,0.1)", color: "#7C3AED" },
};

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        style={{
          background: "var(--color-charcoal)",
          padding: "72px 0 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(244,169,66,0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: "rgba(244,169,66,0.15)",
              color: "var(--color-saffron)",
              borderRadius: "50px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            From Adfar's Desk
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "white",
              marginBottom: "16px",
            }}
          >
            Blog & Insights
          </h1>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", maxWidth: "500px" }}>
            Thoughts on Full Stack Development, DSA, Generative AI, and tech education from Kashmir.
          </p>
        </div>
      </section>

      {/* Featured post */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          <Link
            href={`/blog/${featured.slug}`}
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              className="card"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                overflow: "hidden",
                marginBottom: "48px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: "340px",
                  backgroundImage: `url(${featured.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
                  <span
                    className="badge"
                    style={{
                      background: CATEGORY_COLORS[featured.category]?.bg,
                      color: CATEGORY_COLORS[featured.category]?.color,
                    }}
                  >
                    {featured.category}
                  </span>
                  <span className="badge badge-saffron">Featured</span>
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--color-charcoal)",
                    marginBottom: "14px",
                    lineHeight: 1.3,
                  }}
                >
                  {featured.title}
                </h2>
                <p style={{ fontSize: "15px", color: "var(--color-muted)", lineHeight: 1.7, marginBottom: "24px" }}>
                  {featured.excerpt}
                </p>

                <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "var(--color-muted)", marginBottom: "24px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Calendar size={12} />
                    {new Date(featured.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Clock size={12} />
                    {featured.readTime}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-saffron-dark)", fontWeight: 600, fontSize: "14px" }}>
                  Read Article <ArrowRight size={15} />
                </div>
              </div>
            </div>
          </Link>

          {/* Other posts grid */}
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: 700,
              color: "var(--color-charcoal)",
              marginBottom: "24px",
            }}
          >
            More Articles
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card" style={{ cursor: "pointer" }}>
                  <div
                    style={{
                      height: "180px",
                      backgroundImage: `url(${post.coverImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div style={{ padding: "24px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <span
                        className="badge"
                        style={{
                          background: CATEGORY_COLORS[post.category]?.bg,
                          color: CATEGORY_COLORS[post.category]?.color,
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--color-charcoal)",
                        marginBottom: "10px",
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "var(--color-muted)", lineHeight: 1.6, marginBottom: "16px" }}>
                      {post.excerpt}
                    </p>
                    <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--color-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={11} />
                        {new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
