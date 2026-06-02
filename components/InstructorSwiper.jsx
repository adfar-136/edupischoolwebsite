"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Inline social icons for compatibility with older lucide-react versions
function Github({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Linkedin({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Twitter({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function Instagram({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Youtube({ size = 15, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
  );
}

// Fallback high-fidelity profiles
const FALLBACK_INSTRUCTORS = [
  {
    name: "Adfar Rasheed",
    title: "Founder & Lead Educator",
    bio: "Tech educator and Full Stack Developer who formerly trained over 50,000 students at PW Skills and College Wallah. Specializes in MERN stack, DSA, and Generative AI workflows.",
    image: "/adfar.jpg",
    linkedin: "https://www.linkedin.com/in/adfar-rasheed/",
    youtube: "https://www.youtube.com/@adfar-rasheed",
    instagram: "https://www.instagram.com/adfarsirofficial",
  },
  {
    name: "Sarah Jenkins",
    title: "Principal Analyst at Google",
    bio: "Data analytics expert with 10+ years of experience. Teaches SQL, Tableau, PowerBI, and data-driven business modeling for high-scale enterprise operations.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  },
  {
    name: "Dr. Alan Turing",
    title: "AI Researcher & Lead Scientist",
    bio: "Specialist in machine learning models, statistical analysis, and deep neural network designs. Mentors students in python modeling and PyTorch aggregation architectures.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
  {
    name: "Alex Stone",
    title: "Certified Ethical Hacker",
    bio: "Lead SecOps specialist specializing in threat hunting, network penetration testing, and security compliance. Passionate about bringing grassroots training to cybersecurity fields.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
  }
];

export default function InstructorSwiper({ instructors = [] }) {
  const data = instructors.length > 0 ? instructors : FALLBACK_INSTRUCTORS;
  const [index, setIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = data.length;
  const maxIndex = Math.max(0, totalSlides - slidesToShow);

  const next = () => {
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", padding: "24px 0" }}>
      {/* Track container */}
      <div
        style={{
          display: "flex",
          transform: `translateX(-${index * (100 / slidesToShow)}%)`,
          transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
          width: `${(totalSlides / slidesToShow) * 100}%`,
        }}
      >
        {data.map((inst, idx) => (
          <div
            key={idx}
            style={{
              width: `${100 / totalSlides}%`,
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          >
            <div
              className="instructor-card"
              style={{
                background: "white",
                borderRadius: "20px",
                border: "1.5px solid var(--color-cream-dark)",
                padding: "24px",
                textAlign: "center",
                boxShadow: "0 8px 30px rgba(28,28,28,0.02)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transition: "all 0.3s ease",
                animation: "fadeSlideUp 0.8s ease-out forwards",
              }}
            >
              {/* Profile Image container with HSL border */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  padding: "4px",
                  background: "linear-gradient(135deg, var(--color-saffron) 0%, var(--color-forest) 100%)",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(28,28,28,0.08)",
                  transition: "transform 0.3s ease",
                }}
                className="profile-img-container"
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "white",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    fontWeight: 800,
                    color: "var(--color-charcoal)",
                  }}
                >
                  {inst.image ? (
                    <img
                      src={inst.image}
                      alt={inst.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                      className="profile-img-hover"
                    />
                  ) : (
                    inst.name.charAt(0)
                  )}
                </div>
              </div>

              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--color-charcoal)",
                  margin: "0 0 4px",
                }}
              >
                {inst.name}
              </h4>
              <p
                style={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "var(--color-saffron-dark)",
                  background: "rgba(244,169,66,0.08)",
                  padding: "4px 12px",
                  borderRadius: "50px",
                  marginBottom: "14px",
                  display: "inline-block",
                }}
              >
                {inst.title}
              </p>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "var(--color-muted)",
                  lineHeight: 1.6,
                  margin: "0 0 20px",
                  flex: 1,
                }}
              >
                {inst.bio}
              </p>

              {/* Social Channels */}
              <div style={{ display: "flex", gap: "10px" }}>
                {inst.github && (
                  <a href={inst.github} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
                    <Github size={15} />
                  </a>
                )}
                {inst.linkedin && (
                  <a href={inst.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                    <Linkedin size={15} />
                  </a>
                )}
                {inst.twitter && (
                  <a href={inst.twitter} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Twitter / X">
                    <Twitter size={15} />
                  </a>
                )}
                {inst.instagram && (
                  <a href={inst.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram">
                    <Instagram size={15} />
                  </a>
                )}
                {inst.youtube && (
                  <a href={inst.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="YouTube">
                    <Youtube size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "white",
              border: "1.5px solid var(--color-cream-dark)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-charcoal)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              zIndex: 10,
              transition: "all 0.2s ease",
            }}
            className="slider-nav-btn"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "white",
              border: "1.5px solid var(--color-cream-dark)",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--color-charcoal)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              zIndex: 10,
              transition: "all 0.2s ease",
            }}
            className="slider-nav-btn"
          >
            <ArrowRight size={18} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? "24px" : "8px",
                height: "8px",
                borderRadius: "50px",
                background: i === index ? "var(--color-forest)" : "rgba(45,106,79,0.2)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes rotateBorder {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .instructor-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
        }
        .instructor-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--color-forest) !important;
          box-shadow: 0 20px 45px rgba(45,106,79,0.12) !important;
        }
        /* Glass card shimmer reflection */
        .instructor-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-25deg);
          transition: 0.75s;
          pointer-events: none;
          z-index: 2;
        }
        .instructor-card:hover::before {
          left: 125%;
        }
        /* Rotating image border on hover */
        .instructor-card:hover .profile-img-container {
          animation: rotateBorder 6s linear infinite;
          transform: scale(1.05);
        }
        /* Keep profile image stationary while border spins */
        .instructor-card:hover .profile-img-hover {
          transform: scale(1.1);
        }
        .slider-nav-btn:hover {
          background: var(--color-charcoal) !important;
          color: white !important;
          border-color: var(--color-charcoal) !important;
          box-shadow: 0 0 15px rgba(28,28,28,0.2) !important;
        }
        .social-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-cream);
          display: flex;
          alignItems: center;
          justifyContent: center;
          color: var(--color-charcoal-light);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .social-icon-btn:hover {
          background: var(--color-forest);
          color: white;
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 4px 10px rgba(45,106,79,0.3);
        }
      `}</style>
    </div>
  );
}
