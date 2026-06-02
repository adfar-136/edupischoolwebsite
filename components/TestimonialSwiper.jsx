"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Bilal Ahmad",
    location: "Srinagar, Kashmir",
    text: "Adfar's teaching style is completely different. He doesn't just show code — he explains *why* you're writing it. My understanding of Full Stack jumped 10x in the first month.",
    avatar: "B",
    batch: "FSD Batch",
    rating: 5,
  },
  {
    name: "Rukhsar Nazir",
    location: "Anantnag, Kashmir",
    text: "I had tried multiple online platforms before. Nothing clicked until I joined EdupiSchool. The Sunday sessions are genuinely the best 3 hours of my week.",
    avatar: "R",
    batch: "DSA Batch",
    rating: 5,
  },
  {
    name: "Aaqib Hussain",
    location: "Baramulla, Kashmir",
    text: "The GenAI batch changed my perspective on what's possible. I've already built two side projects using AI APIs — things I couldn't have imagined six months ago.",
    avatar: "A",
    batch: "GenAI Batch",
    rating: 5,
  },
  {
    name: "Nida Shah",
    location: "Sopore, Kashmir",
    text: "The community here is unlike anything else. Adfar is responsive, motivating, and genuinely cares about student progress. Not just a teacher — a mentor.",
    avatar: "N",
    batch: "FSD Batch",
    rating: 5,
  },
];

export default function TestimonialSwiper({ testimonials = [] }) {
  const data = testimonials.length > 0 ? testimonials.filter((t) => t.status !== "draft") : FALLBACK_TESTIMONIALS;
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const total = data.length;

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => {
    setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [index, total]);

  if (total === 0) return null;

  // Calculate position and 3D properties dynamically
  const getCardStyleAndDiff = (idx) => {
    let diff = idx - index;
    // Handle modular wrap-around for endless circular slider
    if (diff < -1 && diff < -total / 2) diff += total;
    if (diff > 1 && diff > total / 2) diff -= total;
    return diff;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 0",
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      {/* 3D Viewport container */}
      <div
        style={{
          position: "relative",
          height: isMobile ? "380px" : "320px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1200px",
          transformStyle: "preserve-3d",
          overflow: "visible",
        }}
      >
        {data.map((item, idx) => {
          const diff = getCardStyleAndDiff(idx);
          const isActive = diff === 0;
          const isLeft = diff === -1;
          const isRight = diff === 1;
          const isVisible = isActive || (!isMobile && (isLeft || isRight));

          // Compute absolute transform styles for 3D stack
          let transform = "translateX(0) scale(0.7) translateZ(-200px)";
          let opacity = 0;
          let zIndex = 1;
          let filter = "blur(4px)";
          let cursor = "default";

          if (isActive) {
            transform = "translateX(0) scale(1) translateZ(0px) rotateY(0deg)";
            opacity = 1;
            zIndex = 10;
            filter = "blur(0px)";
          } else if (isLeft && !isMobile) {
            transform = "translateX(-45%) scale(0.85) translateZ(-100px) rotateY(25deg)";
            opacity = 0.5;
            zIndex = 5;
            filter = "blur(1.5px)";
            cursor = "pointer";
          } else if (isRight && !isMobile) {
            transform = "translateX(45%) scale(0.85) translateZ(-100px) rotateY(-25deg)";
            opacity = 0.5;
            zIndex = 5;
            filter = "blur(1.5px)";
            cursor = "pointer";
          } else {
            // Hidden cards
            transform = diff > 0 
              ? "translateX(100%) scale(0.6) translateZ(-300px) rotateY(-35deg)" 
              : "translateX(-100%) scale(0.6) translateZ(-300px) rotateY(35deg)";
          }

          return (
            <div
              key={idx}
              onClick={() => {
                if (isLeft) prev();
                if (isRight) next();
              }}
              style={{
                position: "absolute",
                width: "90%",
                maxWidth: "580px",
                opacity,
                transform,
                zIndex,
                filter,
                cursor,
                transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                pointerEvents: isVisible ? "auto" : "none",
              }}
              className={`testimonial-card-3d ${isActive ? "active" : ""}`}
            >
              <div
                style={{
                  background: isActive
                    ? "rgba(255, 255, 255, 0.07)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: isActive
                    ? "1px solid rgba(244, 169, 66, 0.4)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "24px",
                  padding: isMobile ? "24px 28px" : "36px 40px",
                  boxSizing: "border-box",
                  backdropFilter: "blur(12px)",
                  boxShadow: isActive
                    ? "0 20px 50px rgba(244, 169, 66, 0.08), 0 0 30px rgba(255,255,255,0.02)"
                    : "0 10px 30px rgba(0,0,0,0.15)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Accent lights inside active cards */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "4px",
                      background: "linear-gradient(90deg, var(--color-saffron) 0%, var(--color-forest) 100%)",
                      borderTopLeftRadius: "24px",
                      borderTopRightRadius: "24px",
                    }}
                  />
                )}

                {/* Quote Icon */}
                <Quote
                  size={42}
                  style={{
                    position: "absolute",
                    right: "28px",
                    top: "24px",
                    opacity: isActive ? 0.15 : 0.05,
                    color: "var(--color-saffron)",
                    pointerEvents: "none",
                    transition: "opacity 0.3s ease",
                  }}
                />

                <div>
                  {/* Rating stars */}
                  <div style={{ display: "flex", gap: "4px", marginBottom: "16px" }}>
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} color="var(--color-saffron)" fill="var(--color-saffron)" />
                    ))}
                  </div>

                  {/* Testimonial content */}
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: isMobile ? "14.5px" : "16.5px",
                      color: isActive ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.5)",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                      marginBottom: "24px",
                      fontWeight: 400,
                      transition: "color 0.3s ease",
                    }}
                  >
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Profile details */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "linear-gradient(135deg, var(--color-saffron), var(--color-forest))",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    {item.avatar && item.avatar.startsWith("http") ? (
                      <img src={item.avatar} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      item.avatar || item.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h5
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "14.5px",
                        margin: 0,
                        opacity: isActive ? 1 : 0.6,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {item.name}
                    </h5>
                    <p
                      style={{
                        color: isActive ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)",
                        fontSize: "12px",
                        margin: "2px 0 0",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {item.location} · <span style={{ color: isActive ? "var(--color-saffron)" : "rgba(244, 169, 66, 0.4)", transition: "color 0.3s ease" }}>{item.batch}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          marginTop: "16px",
          position: "relative",
          zIndex: 20,
        }}
      >
        <button
          onClick={prev}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            transition: "all 0.2s ease",
            backdropFilter: "blur(4px)",
          }}
          className="nav-btn-testimonial"
          title="Previous Testimonial"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={next}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "white",
            transition: "all 0.2s ease",
            backdropFilter: "blur(4px)",
          }}
          className="nav-btn-testimonial"
          title="Next Testimonial"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px", position: "relative", zIndex: 20 }}>
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? "24px" : "8px",
              height: "8px",
              borderRadius: "50px",
              background: i === index ? "var(--color-saffron)" : "rgba(255,255,255,0.15)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        .testimonial-card-3d:hover {
          transform: translateY(-5px);
        }
        .testimonial-card-3d.active:hover div {
          border-color: var(--color-saffron) !important;
          box-shadow: 0 25px 60px rgba(244, 169, 66, 0.12), 0 0 35px rgba(255,255,255,0.04) !important;
        }
        .nav-btn-testimonial:hover {
          background: var(--color-saffron) !important;
          color: var(--color-charcoal) !important;
          border-color: var(--color-saffron) !important;
          transform: scale(1.08);
          box-shadow: 0 0 15px rgba(244, 169, 66, 0.3);
        }
      `}</style>
    </div>
  );
}
