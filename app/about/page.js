import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, BookOpen, Users, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About Adfar Rasheed — EdupiSchool",
  description:
    "Meet Adfar Rasheed — Full Stack Developer, DSA educator, and Generative AI practitioner from Kashmir. Founder of EdupiSchool.",
};

const credentials = [
  { icon: "💻", title: "Full Stack Developer", desc: "Years of experience building production web applications with modern JavaScript stacks." },
  { icon: "🧠", title: "DSA Expert", desc: "Formerly trained thousands of students in coding interviews & competitive programming at College Wallah." },
  { icon: "🤖", title: "Generative AI Practitioner", desc: "Building AI workflows & prompt engineering courses with Claude, ChatGPT, and LangChain." },
  { icon: "🎓", title: "Educator & Mentor", desc: "Former lead educator at PW Skills with 50,000+ tech alumni, now teaching independently." },
];

const teachingPrinciples = [
  { title: "Build real things", desc: "Every concept is demonstrated through production-grade projects, not contrived examples." },
  { title: "Understand, don't memorize", desc: "First principles thinking. You should be able to derive what you've learned, not just recall it." },
  { title: "Community over isolation", desc: "Learning alone is hard. EdupiSchool has a strong student community that helps each other grow." },
  { title: "Ruthless clarity", desc: "I cut jargon. If you don't understand something I said, that's my failure, not yours." },
];

const techStack = [
  "JavaScript / TypeScript", "React & Next.js", "Node.js & Express", "MongoDB & PostgreSQL",
  "Python (for AI)", "OpenAI & Gemini APIs", "LangChain", "Docker & CI/CD",
  "Data Structures & Algorithms", "System Design",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: "var(--color-charcoal)",
          padding: "100px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 60% 40%, rgba(244,169,66,0.1) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  background: "rgba(244,169,66,0.15)",
                  color: "var(--color-saffron)",
                  borderRadius: "50px",
                  fontSize: "12px",
                  fontWeight: 600,
                  marginBottom: "20px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Kashmir's Tech Educator
              </span>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 5vw, 60px)",
                  fontWeight: 800,
                  color: "white",
                  marginBottom: "24px",
                  lineHeight: 1.1,
                }}
              >
                Hi, I'm{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #F4A942, #52B788)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Adfar Rasheed
                </span>
              </h1>
              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                Adfar Rasheed is a Full-Stack Developer and Tech Educator who formerly taught at PW Skills &amp; College Wallah, training 50,000+ students. Today, he brings his signature calm, direct teaching style independently to students through his own cohorts on EdupiSchool.
              </p>

              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <Link href="/batches" className="btn-primary">
                  Join a Batch <ArrowRight size={16} />
                </Link>
                <Link
                  href="/masterclasses"
                  style={{
                    padding: "12px 24px",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    borderRadius: "50px",
                    fontWeight: 600,
                    fontSize: "15px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    transition: "background 0.2s ease",
                  }}
                >
                  Book Masterclass
                </Link>
              </div>
            </div>

            {/* Decorative portrait block */}
            <div
              style={{
                aspectRatio: "1",
                borderRadius: "32px",
                background: "linear-gradient(145deg, rgba(244,169,66,0.2), rgba(45,106,79,0.2))",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
                padding: "40px",
              }}
            >
              <span style={{ fontSize: "90px" }}>👨‍💻</span>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "white" }}>
                  Adfar Rasheed
                </p>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>
                  Kashmir, India 🌸
                </p>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                {["Full Stack", "DSA", "Generative AI"].map((tag) => (
                  <span key={tag} style={{ padding: "4px 12px", background: "rgba(244,169,66,0.15)", color: "var(--color-saffron)", borderRadius: "50px", fontSize: "12px", fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <span className="badge badge-saffron" style={{ marginBottom: "20px", display: "inline-block" }}>
            My Story
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              color: "var(--color-charcoal)",
              marginBottom: "28px",
            }}
          >
            From Kashmir to Full Stack
          </h2>

          <div style={{ fontSize: "16px", color: "var(--color-muted)", lineHeight: 1.9, display: "flex", flexDirection: "column", gap: "28px" }}>
            <p>
              Adfar Rasheed is a Full-Stack Developer, Tech Educator, and content creator based in Kashmir, India. Having previously worked with <strong style={{ color: "var(--color-charcoal)", fontWeight: 600 }}>PW Skills</strong> and <strong style={{ color: "var(--color-charcoal)", fontWeight: 600 }}>College Wallah</strong> as a lead educator, he has trained over <strong style={{ color: "var(--color-saffron-dark)", fontWeight: 800 }}>50,000 students</strong> — establishing himself as one of India's most trusted tech mentors. Today, Adfar hosts his premium upskilling programs independently on **EdupiSchool**.
            </p>

            <div style={{ padding: "28px", background: "white", borderRadius: "16px", border: "1.5px solid var(--color-cream-dark)", boxShadow: "0 4px 20px rgba(28,28,28,0.02)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>💻</span> Core Teaching Domains
              </h3>
              <p style={{ fontSize: "14.5px", marginBottom: "16px" }}>Adfar specializes in end-to-end software engineering and modern AI developer tools. His core domains include:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  "MERN Stack (MongoDB, Express, React, Node)",
                  "React component architecture & state",
                  "Generative AI & Prompt Engineering (Claude, ChatGPT)",
                  "Data Structures & Algorithms (DSA)",
                  "Databases (SQL, MySQL, MongoDB, Mongoose)",
                ].map((d) => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-forest)", flexShrink: 0 }} />
                    {d}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "12px" }}>
                How He Teaches
              </h3>
              <p>
                Adfar now hosts independent live cohort-based batches directly on EdupiSchool, alongside long-form content on YouTube, short-form reels on Instagram, and hands-on college seminars and workshops conducted at campuses across India.
              </p>
              <p>
                His teaching style is calm, practical, and direct — focused on building real understanding rather than surface-level familiarity. Students across the country know him as <strong style={{ color: "var(--color-charcoal)" }}>Adfar Sir</strong> or <strong style={{ color: "var(--color-charcoal)" }}>Adfar Bhai</strong> — a mentor who speaks plainly, explains deeply, and provides honest, grounded guidance like a trusted elder brother.
              </p>
            </div>

            <div style={{ borderLeft: "4px solid var(--color-forest)", paddingLeft: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-forest)", marginBottom: "10px" }}>
                EdupiSchool — Education for Kashmir
              </h3>
              <p>
                Beyond professional EdTech, Adfar founded <strong style={{ color: "var(--color-forest-dark)" }}>EdupiSchool</strong>, a grassroots initiative bringing structured education in Mathematics, English, and Computers to students in Grades 6–9 across Kashmir. The project treats these subjects not as academic checkboxes but as practical life skills — designed specifically for students in underserved regions who deserve the same quality of learning as anyone else.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "12px" }}>
                Industry Presence
              </h3>
              <p>
                Adfar previously served as a recognized faculty member at PW Skillshala — PW's network of offline upskilling centers across India — where he was featured alongside industry leaders at launch events and panel discussions focused on tech education and employability in India. Today, he channels this industry experience to build independent programs and actively creates content around AI tools, developer workflows, and emerging technologies to help students stay ahead of the curve.
              </p>
            </div>

            <div style={{ background: "rgba(244,169,66,0.06)", border: "1.5px dashed rgba(244,169,66,0.3)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "17px", fontWeight: 700, color: "var(--color-charcoal)", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
                &ldquo;Adfar Rasheed is not just a developer who teaches — he is an educator who builds. Whether it is a 50,000-student MERN cohort, a college workshop on Agentic AI, or a classroom in Kashmir learning computers for the first time, the goal remains the same: make technology real, accessible, and meaningful.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="section" style={{ background: "var(--color-cream-dark)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-saffron" style={{ marginBottom: "16px", display: "inline-block" }}>Expertise</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", fontWeight: 700, color: "var(--color-charcoal)" }}>
              What I bring to the table
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {credentials.map((c) => (
              <div key={c.title} className="card" style={{ padding: "28px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>{c.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "19px", fontWeight: 700, marginBottom: "10px", color: "var(--color-charcoal)" }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="section" style={{ background: "var(--color-cream)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>
            <div>
              <span className="badge badge-forest" style={{ marginBottom: "20px", display: "inline-block" }}>
                Teaching Philosophy
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 700,
                  color: "var(--color-charcoal)",
                  marginBottom: "28px",
                  lineHeight: 1.2,
                }}
              >
                How I think about education
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {teachingPrinciples.map((p, i) => (
                  <div key={p.title} style={{ display: "flex", gap: "16px" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--color-saffron), var(--color-saffron-dark))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "white",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 700, marginBottom: "6px", color: "var(--color-charcoal)" }}>
                        {p.title}
                      </h4>
                      <p style={{ fontSize: "14px", color: "var(--color-muted)", lineHeight: 1.7 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <span className="badge badge-saffron" style={{ marginBottom: "20px", display: "inline-block" }}>
                Tech Stack
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 700,
                  color: "var(--color-charcoal)",
                  marginBottom: "28px",
                }}
              >
                What I work with
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      padding: "8px 16px",
                      background: "white",
                      border: "1.5px solid var(--color-cream-dark)",
                      borderRadius: "50px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--color-charcoal)",
                      boxShadow: "0 2px 8px rgba(244,169,66,0.06)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div
                style={{
                  marginTop: "40px",
                  padding: "24px",
                  background: "linear-gradient(135deg, rgba(244,169,66,0.08), rgba(45,106,79,0.06))",
                  borderRadius: "16px",
                  border: "1px solid rgba(244,169,66,0.2)",
                }}
              >
                <div style={{ display: "flex", gap: "20px" }}>
                  {[
                    { value: "50,000+", label: "Alumni Trained" },
                    { value: "100% Live", label: "Independent Cohorts" },
                    { value: "6-9", label: "EdupiSchool Grades" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--color-saffron-dark)" }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-muted)", fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--color-forest)", padding: "72px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 700,
              color: "white",
              marginBottom: "16px",
            }}
          >
            Learn from Kashmir. Build for the world.
          </h2>
          <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", marginBottom: "36px" }}>
            Join hundreds of students who chose EdupiSchool.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
            <Link href="/batches" className="btn-primary" style={{ fontSize: "16px" }}>
              Explore Batches <ArrowRight size={16} />
            </Link>
            <Link
              href="/masterclasses"
              style={{
                padding: "12px 28px",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                borderRadius: "50px",
                fontWeight: 600,
                fontSize: "15px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              Book a ₹199 Masterclass
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
