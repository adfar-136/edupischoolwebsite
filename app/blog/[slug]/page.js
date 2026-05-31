import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBlogPost, blogPosts } from "@/data/blog";
import { Clock, Calendar, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — EdupiSchool Blog`,
    description: post.excerpt,
  };
}

const CATEGORY_COLORS = {
  FSD: { bg: "rgba(59,130,246,0.1)", color: "#1D4ED8" },
  DSA: { bg: "rgba(45,106,79,0.1)", color: "#2D6A4F" },
  GenAI: { bg: "rgba(244,169,66,0.15)", color: "#D4891E" },
  Personal: { bg: "rgba(168,85,247,0.1)", color: "#7C3AED" },
};

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const catColors = CATEGORY_COLORS[post.category] || CATEGORY_COLORS["FSD"];
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Convert simple markdown-like content to paragraphs
  const paragraphs = post.content.split("\n\n");

  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        style={{
          backgroundImage: `linear-gradient(rgba(28,28,28,0.75), rgba(28,28,28,0.9)), url(${post.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "100px 0 80px",
          position: "relative",
        }}
      >
        <div className="container">
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              marginBottom: "24px",
              transition: "color 0.2s ease",
            }}
          >
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          <div style={{ maxWidth: "760px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <span className="badge" style={{ background: catColors.bg, color: catColors.color }}>
                {post.category}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4.5vw, 52px)",
                fontWeight: 800,
                color: "white",
                marginBottom: "20px",
                lineHeight: 1.15,
              }}
            >
              {post.title}
            </h1>

            <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
              <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{post.author}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Calendar size={13} />
                {new Date(post.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <Clock size={13} />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "64px", alignItems: "start" }}>
          <article>
            {/* Excerpt */}
            <p
              style={{
                fontSize: "18px",
                color: "var(--color-charcoal)",
                fontWeight: 400,
                lineHeight: 1.9,
                fontStyle: "italic",
                borderLeft: "4px solid var(--color-saffron)",
                paddingLeft: "20px",
                marginBottom: "36px",
              }}
            >
              {post.excerpt}
            </p>

            {/* Content */}
            <div style={{ fontSize: "16px", color: "var(--color-charcoal-light)", lineHeight: 1.9 }}>
              {paragraphs.map((para, i) => {
                if (para.startsWith("## ")) {
                  return (
                    <h2
                      key={i}
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "26px",
                        fontWeight: 700,
                        color: "var(--color-charcoal)",
                        marginTop: "40px",
                        marginBottom: "16px",
                      }}
                    >
                      {para.replace("## ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("- ")) {
                  const items = para.split("\n").filter(Boolean);
                  return (
                    <ul key={i} style={{ paddingLeft: "20px", marginBottom: "20px" }}>
                      {items.map((item, j) => (
                        <li key={j} style={{ marginBottom: "8px" }}>
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Handle **bold** syntax
                const parts = para.split(/\*\*(.*?)\*\*/g);
                return (
                  <p key={i} style={{ marginBottom: "20px" }}>
                    {parts.map((part, j) =>
                      j % 2 === 0 ? part : (
                        <strong key={j} style={{ color: "var(--color-charcoal)", fontWeight: 600 }}>
                          {part}
                        </strong>
                      )
                    )}
                  </p>
                );
              })}
            </div>

            {/* Author box */}
            <div
              style={{
                marginTop: "56px",
                padding: "28px",
                background: "white",
                borderRadius: "16px",
                border: "1px solid var(--color-cream-dark)",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
              }}
            >
              <img
                src="/adfar.jpg"
                alt="Adfar Rasheed"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "2px solid var(--color-saffron)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}
              />
              <div>
                <p style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>Adfar Rasheed</p>
                <p style={{ fontSize: "13px", color: "var(--color-muted)", marginBottom: "10px" }}>
                  Full Stack Developer & Educator · Kashmir, India
                </p>
                <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)", lineHeight: 1.6 }}>
                  Teaching FSD, DSA, and Generative AI through live Sunday sessions on EdupiSchool.
                </p>
              </div>
            </div>

            {/* Prev/Next */}
            <div style={{ display: "grid", gridTemplateColumns: prevPost && nextPost ? "1fr 1fr" : "1fr", gap: "16px", marginTop: "48px" }}>
              {prevPost && (
                <Link href={`/blog/${prevPost.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ padding: "20px", cursor: "pointer" }}>
                    <p style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <ArrowLeft size={11} /> Previous
                    </p>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-charcoal)", lineHeight: 1.4 }}>
                      {prevPost.title}
                    </p>
                  </div>
                </Link>
              )}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ padding: "20px", cursor: "pointer", textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "var(--color-muted)", marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px" }}>
                      Next <ArrowRight size={11} />
                    </p>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-charcoal)", lineHeight: 1.4 }}>
                      {nextPost.title}
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: "88px" }}>
            {/* CTA card */}
            <div
              className="card"
              style={{
                padding: "28px",
                background: "linear-gradient(135deg, var(--color-charcoal), var(--color-charcoal-light))",
                color: "white",
                marginBottom: "24px",
              }}
            >
              <BookOpen size={28} color="var(--color-saffron)" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>
                Want to learn this live?
              </h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginBottom: "20px", lineHeight: 1.6 }}>
                Join Adfar's Sunday batches and go deep on {post.category} with real projects and mentorship.
              </p>
              <Link href="/batches" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                View Batches <ArrowRight size={15} />
              </Link>
            </div>

            {/* Other posts */}
            <div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, marginBottom: "16px", color: "var(--color-charcoal)" }}>
                More from the Blog
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {blogPosts
                  .filter((p) => p.slug !== slug)
                  .slice(0, 3)
                  .map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                      <div
                        style={{
                          padding: "14px 16px",
                          background: "white",
                          borderRadius: "10px",
                          border: "1px solid var(--color-cream-dark)",
                          transition: "border-color 0.2s ease",
                        }}
                      >
                        <p style={{ fontWeight: 600, fontSize: "13px", color: "var(--color-charcoal)", lineHeight: 1.4, marginBottom: "4px" }}>
                          {p.title}
                        </p>
                        <p style={{ fontSize: "11px", color: "var(--color-muted)" }}>{p.readTime}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </>
  );
}
