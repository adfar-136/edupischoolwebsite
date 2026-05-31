"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import roadmapsData from "@/data/roadmaps.json";

// Inline Dynamic SVGs for premium rendering
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
);

const FsdIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/><line x1="5" y1="20" x2="5" y2="16"/><line x1="19" y1="20" x2="19" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/></svg>
);

const DsaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
);

const AiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 7.54 16.59c-.24.25-.39.58-.39.93v1.98a2 2 0 0 1-2 2h-6.3a2 2 0 0 1-2-2v-1.98c0-.35-.15-.68-.39-.93A10 10 0 0 1 12 2z"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="12" y1="6" x2="12" y2="18"/></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default function RoadmapPage() {
  // Step Selector States
  const [step, setStep] = useState(1);
  const [focusArea, setFocusArea] = useState("");
  const [level, setLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");

  // Result Roadmap State
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [timelineWeeks, setTimelineWeeks] = useState([]);
  const [roadmapId, setRoadmapId] = useState("");
  const [adfarGlobalTip, setAdfarGlobalTip] = useState("");
  
  // Progress & Checkbox State
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Safe window-load hydration checking
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch or regenerate roadmap from localStorage if matching selections exist
  useEffect(() => {
    if (!isHydrated) return;
    const savedFocus = localStorage.getItem("roadmap_focus");
    const savedLevel = localStorage.getItem("roadmap_level");
    const savedGoal = localStorage.getItem("roadmap_goal");
    const savedTime = localStorage.getItem("roadmap_time");
    
    if (savedFocus && savedLevel && savedGoal && savedTime) {
      setFocusArea(savedFocus);
      setLevel(savedLevel);
      setGoal(savedGoal);
      setTime(savedTime);
      buildRoadmap(savedFocus, savedLevel, savedGoal, savedTime);
      setStep(5); // Skip to roadmap view
    }
  }, [isHydrated]);

  // Dynamic Syllabus Builder Algorithm
  const buildRoadmap = (selectedFocus, selectedLevel, selectedGoal, selectedTime) => {
    const focusData = roadmapsData.focusAreas[selectedFocus];
    if (!focusData) return;

    // Assemble the baseline weeks array
    let weeksArray = JSON.parse(JSON.stringify(focusData.baseWeeks));

    // DYNAMIC CUSTOMIZATION: If Level is Advanced, append microservice/scale weeks
    if (selectedLevel === "Advanced") {
      const advancedWeeks = roadmapsData.extraAdvancedWeeks;
      weeksArray = [...weeksArray, ...advancedWeeks];
    }

    // Dynamic alternate quest generator (for 'not same roadmap everytime' requirement)
    const seed = selectedGoal.length + selectedTime.length;
    weeksArray = weeksArray.map((wk, wIdx) => {
      const modifiedWeek = { ...wk };
      
      // Select dynamic project based on selected Goal (Job, Freelancing, Build Projects)
      const mappedGoalKey = selectedGoal; // matches 'Job', 'Freelancing', 'Build Projects' exactly
      const targetProject = wk.projects[mappedGoalKey] || wk.projects["Job"];
      modifiedWeek.dynamicProject = targetProject;

      // Extract a randomized side quest based on seed index
      if (wk.alternativeQuests && wk.alternativeQuests.length > 0) {
        const questIdx = (wIdx + seed) % wk.alternativeQuests.length;
        modifiedWeek.dynamicQuest = wk.alternativeQuests[questIdx];
      }

      return modifiedWeek;
    });

    // Generate a contextual roadmap unique ID
    const roadmapKey = `${selectedFocus.toLowerCase()}_${selectedLevel.toLowerCase()}_${selectedGoal.replace(/\s+/g, "").toLowerCase()}`;

    // Select a randomized global mentorship tip from Adfar Sir
    const randomTipIndex = seed % roadmapsData.globalTips.length;
    setAdfarGlobalTip(roadmapsData.globalTips[randomTipIndex]);

    setTimelineWeeks(weeksArray);
    setActiveRoadmap({
      title: `${selectedLevel} ${focusData.title}`,
      description: focusData.description
    });
    setRoadmapId(roadmapKey);

    // Load completed weeks progress from localStorage for this specific key
    const storedProgress = localStorage.getItem(`roadmap_progress_${roadmapKey}`);
    if (storedProgress) {
      setCompletedWeeks(JSON.parse(storedProgress));
    } else {
      setCompletedWeeks([]);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && focusArea) setStep(2);
    else if (step === 2 && level) setStep(3);
    else if (step === 3 && goal) setStep(4);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (focusArea && level && goal && time) {
      localStorage.setItem("roadmap_focus", focusArea);
      localStorage.setItem("roadmap_level", level);
      localStorage.setItem("roadmap_goal", goal);
      localStorage.setItem("roadmap_time", time);
      
      buildRoadmap(focusArea, level, goal, time);
      setStep(5);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("roadmap_focus");
    localStorage.removeItem("roadmap_level");
    localStorage.removeItem("roadmap_goal");
    localStorage.removeItem("roadmap_time");
    
    setFocusArea("");
    setLevel("");
    setGoal("");
    setTime("");
    setActiveRoadmap(null);
    setTimelineWeeks([]);
    setRoadmapId("");
    setCompletedWeeks([]);
    setStep(1);
  };

  // Toggle week checkbox checks
  const handleToggleWeek = (weekName) => {
    let updated;
    if (completedWeeks.includes(weekName)) {
      updated = completedWeeks.filter((w) => w !== weekName);
    } else {
      updated = [...completedWeeks, weekName];
    }
    setCompletedWeeks(updated);
    localStorage.setItem(`roadmap_progress_${roadmapId}`, JSON.stringify(updated));
  };

  // Progress Calculations
  const totalWeeks = timelineWeeks.length;
  const completedCount = completedWeeks.length;
  const progressPercent = totalWeeks > 0 ? Math.round((completedCount / totalWeeks) * 100) : 0;

  // Custom study scheduling guide based on hour commitment
  const getStudyPacingTip = () => {
    if (time === "5 hours") {
      return "📅 Recommended pace: 45-60 mins of daily micro-study. Ideal for active jobholders or university students pacing themselves carefully.";
    }
    if (time === "10 hours") {
      return "📅 Recommended pace: 1.5 - 2 hours of daily study. Accelerated growth path designed to maximize retention and code execution.";
    }
    return "🚀 Recommended pace: 2.5+ hours of daily deep-dive study. Immersive track engineered for rapid portfolio scaling.";
  };

  // DYNAMIC BATCH ENROLLMENT SUGGESTION CONTENT
  const getRecommendedBatchDetails = () => {
    if (focusArea === "FSD") {
      return {
        title: "Live Full Stack Development (MERN) Cohort",
        description: "Master React, Next.js 15, Node.js, and MongoDB in a live 8-month cohort with 3 interactive classes every week led directly by Adfar Rasheed.",
        link: "/batches/full-stack-development",
        badge: "FSD LIVE BATCH"
      };
    }
    if (focusArea === "DSA") {
      return {
        title: "Live Data Structures & Algorithms Cohort",
        description: "Scale your problem-solving capabilities. A structured approach covering arrays, linked lists, trees, graphs, and dynamic programming built for premium tech interview placements.",
        link: "/batches/data-structures-algorithms",
        badge: "DSA LIVE BATCH"
      };
    }
    // Default fallback / GenAI masterclass enroll path
    return {
      title: "Generative AI & LLM Engineering Masterclass",
      description: "Learn to build semantic retrieval-augmented generation (RAG) models, vector indexing pipelines, and autonomous AI agents in live specialized weekend cohorts.",
      link: "/batches",
      badge: "GEN AI COHORT"
    };
  };

  const recommendedBatch = getRecommendedBatchDetails();

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#faf7f2", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "80px 0 100px 0", position: "relative", overflow: "hidden" }}>
        {/* Glow ambient background assets */}
        <div style={{ position: "absolute", top: "8%", left: "4%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244, 169, 66, 0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "8%", right: "4%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(82, 183, 136, 0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Page Heading */}
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <span className="badge badge-saffron" style={{ marginBottom: "12px", background: "rgba(244, 169, 66, 0.1)", color: "#F4A942", border: "1px solid rgba(244,169,66,0.2)" }}>
              Cohort Engine v3.0
            </span>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAF7F2", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Dynamic Syllabus Roadmap
            </h1>
            <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "16px", color: "#a59e95" }}>
              Design a fully personalized week-by-week interactive syllabus detailing core modules, target projects, and specific feedback from Adfar Sir.
            </p>
          </div>

          {/* STEP 1: Focus Area Path Selector */}
          {step === 1 && (
            <div className="glass-card" style={{ maxWidth: "750px", margin: "0 auto", padding: "40px 30px", borderRadius: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 600 }}>Step 1: Choose Your Primary Focus</h3>
                <span style={{ fontSize: "14px", color: "var(--color-saffron)" }}>Page 1 of 4</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                {[
                  { id: "FSD", title: "Full Stack (MERN)", desc: "Build highly-responsive web designs, REST APIs, databases, and secure web integrations.", icon: <FsdIcon /> },
                  { id: "DSA", title: "Data Structures & Algos", desc: "Master algorithmic problem solving, binary trees, dynamic programming, and interview codes.", icon: <DsaIcon /> },
                  { id: "GenAI", title: "Generative AI", desc: "Build LLM API wrappers, vector databases, semantic RAG systems, and autonomous agent loops.", icon: <AiIcon /> }
                ].map((area) => {
                  const isSelected = focusArea === area.id;
                  
                  return (
                    <button
                      key={area.id}
                      onClick={() => setFocusArea(area.id)}
                      style={{
                        background: isSelected ? "rgba(244, 169, 66, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "2px solid #F4A942" : "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "24px 20px",
                        color: "#FAF7F2",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                      className="step-card"
                    >
                      <div style={{ color: isSelected ? "#F4A942" : "#a59e95" }}>{area.icon}</div>
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700 }}>{area.title}</h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "#a59e95", lineHeight: "1.4" }}>{area.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  disabled={!focusArea}
                  onClick={handleNextStep}
                  className="btn-primary"
                  style={{
                    opacity: focusArea ? 1 : 0.5,
                    cursor: focusArea ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Level Selector */}
          {step === 2 && (
            <div className="glass-card" style={{ maxWidth: "750px", margin: "0 auto", padding: "40px 30px", borderRadius: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 600 }}>Step 2: Choose Your Current Level</h3>
                <span style={{ fontSize: "14px", color: "var(--color-saffron)" }}>Page 2 of 4</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                {["Beginner", "Intermediate", "Advanced"].map((lvl) => {
                  const isSelected = level === lvl;
                  const desc = lvl === "Beginner" ? "Absolute beginner. Build core foundational steps from first-principles." : lvl === "Intermediate" ? "Knows fundamental syntax. Ready for structured frameworks and API builds." : "Experienced builder. Scale architectures into high-concurrency loops.";
                  const emoji = lvl === "Beginner" ? "🌱" : lvl === "Intermediate" ? "⚙️" : "🚀";
                  
                  return (
                    <button
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      style={{
                        background: isSelected ? "rgba(244, 169, 66, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "2px solid #F4A942" : "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "24px 20px",
                        color: "#FAF7F2",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                      className="step-card"
                    >
                      <span style={{ fontSize: "32px" }}>{emoji}</span>
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700 }}>{lvl}</h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "#a59e95", lineHeight: "1.4" }}>{desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={handlePrevStep} className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.15)", color: "#FAF7F2" }}>
                  Back
                </button>
                <button
                  disabled={!level}
                  onClick={handleNextStep}
                  className="btn-primary"
                  style={{
                    opacity: level ? 1 : 0.5,
                    cursor: level ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Goal Selector */}
          {step === 3 && (
            <div className="glass-card" style={{ maxWidth: "750px", margin: "0 auto", padding: "40px 30px", borderRadius: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 600 }}>Step 3: Choose Your Primary Goal</h3>
                <span style={{ fontSize: "14px", color: "var(--color-saffron)" }}>Page 3 of 4</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                {[
                  { id: "Job", title: "Get a Job", desc: "Build enterprise structures and prepare extensive mock interview files.", emoji: "👔" },
                  { id: "Freelancing", title: "Freelancing", desc: "Design bespoke customer landing screens, integrate Stripe, and target clients.", emoji: "🌍" },
                  { id: "Build Projects", title: "Build Projects", desc: "Zero dry concepts. Launch extensive interactive apps and games.", emoji: "💻" }
                ].map((item) => {
                  const isSelected = goal === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setGoal(item.id)}
                      style={{
                        background: isSelected ? "rgba(244, 169, 66, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "2px solid #F4A942" : "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "24px 20px",
                        color: "#FAF7F2",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                      className="step-card"
                    >
                      <span style={{ fontSize: "32px" }}>{item.emoji}</span>
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700 }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "#a59e95", lineHeight: "1.4" }}>{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={handlePrevStep} className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.15)", color: "#FAF7F2" }}>
                  Back
                </button>
                <button
                  disabled={!goal}
                  onClick={handleNextStep}
                  className="btn-primary"
                  style={{
                    opacity: goal ? 1 : 0.5,
                    cursor: goal ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  Continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Weekly Hour Allocation */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: "750px", margin: "0 auto", padding: "40px 30px", borderRadius: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
                <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 600 }}>Step 4: Weekly Hour Commitment</h3>
                <span style={{ fontSize: "14px", color: "var(--color-saffron)" }}>Page 4 of 4</span>
              </div>

              <p style={{ fontSize: "14px", color: "#a59e95", marginBottom: "24px" }}>
                Specify how many dedicated hours you can allocate weekly to write code, review logs, and execute milestones.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                {[
                  { id: "5 hours", title: "5 Hours / Week", desc: "Designed for part-time pacing, focusing on 1 primary task daily." },
                  { id: "10 hours", title: "10 Hours / Week", desc: "Balanced pacing, dedicating solid evening blocks to coding cycles." },
                  { id: "15 hours+", title: "15+ Hours / Week", desc: "High-intensity immersion pacing. Speedrun deployment ready setups." }
                ].map((item) => {
                  const isSelected = time === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTime(item.id)}
                      style={{
                        background: isSelected ? "rgba(244, 169, 66, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "2px solid #F4A942" : "1.5px solid rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "24px 20px",
                        color: "#FAF7F2",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                      className="step-card"
                    >
                      <div style={{ color: isSelected ? "#F4A942" : "#a59e95" }}>{ClockIcon()}</div>
                      <div>
                        <h4 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: 700 }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: "13px", color: "#a59e95", lineHeight: "1.4" }}>{item.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" onClick={handlePrevStep} className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.15)", color: "#FAF7F2" }}>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!time}
                  className="btn-primary glow-btn"
                  style={{
                    opacity: time ? 1 : 0.5,
                    cursor: time ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 32px"
                  }}
                >
                  <SparklesIcon />
                  Assemble Custom Roadmap
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Render Custom Timeline */}
          {step === 5 && activeRoadmap && (
            <div style={{ maxWidth: "950px", margin: "0 auto" }}>
              {/* Reset Control Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "35px", flexWrap: "wrap", gap: "15px" }}>
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#faf7f2",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px"
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
                  Reset Generator
                </button>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <span className="badge badge-saffron" style={{ background: "rgba(244, 169, 66, 0.15)", color: "#F4A942", border: "1px solid rgba(244, 169, 66, 0.2)" }}>
                    Focus: {focusArea === "FSD" ? "Full Stack" : focusArea === "DSA" ? "DSA" : "Gen AI"}
                  </span>
                  <span className="badge badge-forest" style={{ background: "rgba(82, 183, 136, 0.15)", color: "#52B788", border: "1px solid rgba(82, 183, 136, 0.2)" }}>
                    Level: {level}
                  </span>
                  <span className="badge badge-blue" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                    Goal: {goal === "Job" ? "Get a Job" : goal === "Freelancing" ? "Freelancing" : "Build Projects"}
                  </span>
                  <span className="badge badge-red" style={{ background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    Time: {time}
                  </span>
                </div>
              </div>

              {/* NEW FEATURE: Recommended live batch enrollment suggestion card */}
              <div 
                className="glass-card" 
                style={{ 
                  padding: "26px", 
                  borderRadius: "20px", 
                  marginBottom: "30px", 
                  border: "2px solid rgba(244, 169, 66, 0.22)", 
                  background: "linear-gradient(135deg, rgba(28, 28, 28, 0.8) 0%, rgba(20, 20, 20, 0.8) 100%)",
                  boxShadow: "0 8px 30px rgba(244, 169, 66, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "20px"
                }}
              >
                <div style={{ flex: 1, minWidth: "280px" }}>
                  <span className="badge" style={{ background: "rgba(244, 169, 66, 0.15)", color: "var(--color-saffron)", fontSize: "11px", fontWeight: 700, padding: "3px 10px", marginBottom: "10px", border: "1px solid rgba(244, 169, 66, 0.25)" }}>
                    🔥 RECOMMENDED {recommendedBatch.badge}
                  </span>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 800, color: "#FAF7F2", fontFamily: "var(--font-sans)" }}>
                    {recommendedBatch.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#a59e95", lineHeight: "1.5" }}>
                    {recommendedBatch.description}
                  </p>
                </div>
                <div>
                  <Link 
                    href={recommendedBatch.link} 
                    className="btn-primary glow-btn"
                    style={{ 
                      padding: "12px 28px", 
                      fontSize: "14px", 
                      fontWeight: 700, 
                      textDecoration: "none", 
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    Enroll In Active Cohort
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              </div>

              {/* Progress Panel */}
              <div className="glass-card" style={{ padding: "30px", borderRadius: "20px", marginBottom: "40px", borderLeft: "4px solid #52B788" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "15px" }}>
                  <div>
                    <h2 style={{ margin: "0 0 6px 0", fontSize: "24px", fontFamily: "var(--font-sans)", fontWeight: 800, color: "#FAF7F2" }}>
                      {activeRoadmap.title}
                    </h2>
                    <p style={{ margin: 0, fontSize: "14px", color: "#a59e95" }}>{activeRoadmap.description}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "32px", fontWeight: 800, color: "#52B788" }}>{progressPercent}%</span>
                    <p style={{ margin: 0, fontSize: "12px", color: "#a59e95" }}>{completedCount} of {totalWeeks} weeks completed</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="progress-bar-container" style={{ marginBottom: "25px" }}>
                  <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {/* Pacing Advice */}
                  <div style={{ fontSize: "13px", color: "#F4A942", display: "flex", alignItems: "center", gap: "8px", background: "rgba(244, 169, 66, 0.05)", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(244,169,66,0.1)" }}>
                    <span style={{ flexShrink: 0 }}>📅</span>
                    <span>{getStudyPacingTip()}</span>
                  </div>

                  {/* Adfar Sir's Global Mentorship Callout */}
                  {adfarGlobalTip && (
                    <div style={{ display: "flex", gap: "15px", alignItems: "center", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "14px", padding: "16px 20px" }}>
                      <img 
                        src="/adfar.jpg" 
                        alt="Adfar Rasheed" 
                        style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px solid var(--color-saffron)", objectFit: "cover", flexShrink: 0 }} 
                      />
                      <div>
                        <span style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "var(--color-saffron)", marginBottom: "3px" }}>
                          Adfar Sir's Dynamic Guidance
                        </span>
                        <p style={{ margin: 0, fontSize: "13px", fontStyle: "italic", color: "#e1dacb", lineHeight: "1.5" }}>
                          "{adfarGlobalTip}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TIMELINE */}
              <div className="timeline-container">
                {timelineWeeks.map((wk, idx) => {
                  const isCompleted = completedWeeks.includes(wk.week);
                  
                  return (
                    <div
                      key={idx}
                      className={`timeline-item ${isCompleted ? "completed" : ""}`}
                      style={{ transform: "translateZ(0)" }}
                    >
                      {/* Timeline Badge dot */}
                      <div className="timeline-badge">
                        {isCompleted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fff" }}><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#a59e95" }}>{idx + 1}</span>
                        )}
                      </div>

                      {/* Timeline content card */}
                      <div
                        className="glass-card"
                        style={{
                          padding: "24px",
                          borderRadius: "20px",
                          border: isCompleted ? "1.5px solid rgba(82, 183, 136, 0.25)" : "1px solid rgba(255, 255, 255, 0.08)",
                          boxShadow: isCompleted ? "0 4px 20px rgba(82, 183, 136, 0.04)" : "none",
                          transition: "all 0.3s ease",
                          background: isCompleted ? "rgba(20, 30, 25, 0.45)" : "rgba(28, 28, 28, 0.65)"
                        }}
                      >
                        {/* Card Header row */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", marginBottom: "15px", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "12px" }}>
                          <div>
                            <span className="badge" style={{ background: isCompleted ? "rgba(82, 183, 136, 0.15)" : "rgba(244, 169, 66, 0.1)", color: isCompleted ? "#52B788" : "#F4A942", fontSize: "11px", padding: "2px 8px", marginBottom: "6px" }}>
                              {wk.week}
                            </span>
                            <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#FAF7F2", margin: 0, fontFamily: "var(--font-sans)" }}>
                              {wk.topic}
                            </h3>
                          </div>

                          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", select: "none" }}>
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleToggleWeek(wk.week)}
                              style={{
                                width: "20px",
                                height: "20px",
                                accentColor: "#52B788",
                                cursor: "pointer",
                                borderRadius: "4px"
                              }}
                            />
                            <span style={{ fontSize: "12px", color: isCompleted ? "#52B788" : "#a59e95", fontWeight: 600 }}>
                              {isCompleted ? "Completed" : "Mark Complete"}
                            </span>
                          </label>
                        </div>

                        {/* Middle block grid splitting tasks & projects */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginBottom: "20px" }}>
                          {/* Core weekly checklist */}
                          <div>
                            <h5 style={{ margin: "0 0 8px 0", fontSize: "13px", textTransform: "uppercase", color: "#F4A942", fontWeight: 700, letterSpacing: "0.05em" }}>
                              Weekly Study Deliverables
                            </h5>
                            <ul style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                              {wk.tasks.map((task, tIdx) => (
                                <li
                                  key={tIdx}
                                  style={{
                                    fontSize: "14px",
                                    color: isCompleted ? "#8a948e" : "#d1cac0",
                                    textDecoration: isCompleted ? "line-through" : "none",
                                    transition: "all 0.3s ease",
                                    lineHeight: "1.5"
                                  }}
                                >
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Dynamic weekly project & side quest (NEVER the same layout) */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }}>
                            {/* Targeted goal project */}
                            {wk.dynamicProject && (
                              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 16px", borderLeft: "3.5px solid var(--color-saffron)" }}>
                                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--color-saffron)", textTransform: "uppercase", marginBottom: "4px" }}>
                                  🎯 Core Project Target
                                </span>
                                <p style={{ margin: 0, fontSize: "13px", color: isCompleted ? "#8a948e" : "#FAF7F2", lineHeight: "1.4" }}>
                                  {wk.dynamicProject}
                                </p>
                              </div>
                            )}

                            {/* Randomized Side Quest */}
                            {wk.dynamicQuest && (
                              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 16px", borderLeft: "3.5px solid #3B82F6" }}>
                                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#3B82F6", textTransform: "uppercase", marginBottom: "4px" }}>
                                  ⚡ Alternate Side Quest
                                </span>
                                <p style={{ margin: 0, fontSize: "13px", color: isCompleted ? "#8a948e" : "#FAF7F2", lineHeight: "1.4" }}>
                                  {wk.dynamicQuest}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Adfar Sir's Weekly Mentorship Tip Bubble */}
                        {wk.adfarTip && (
                          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(244, 169, 66, 0.04)", border: "1px solid rgba(244, 169, 66, 0.08)", borderRadius: "12px", padding: "12px 16px", marginTop: "15px" }}>
                            <img 
                              src="/adfar.jpg" 
                              alt="Adfar Sir" 
                              style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid var(--color-saffron)", objectFit: "cover", flexShrink: 0 }} 
                            />
                            <div>
                              <span style={{ display: "block", fontSize: "10px", textTransform: "uppercase", fontWeight: 700, color: "var(--color-saffron)", marginBottom: "2px" }}>
                                Adfar Sir's Weekly Tip
                              </span>
                              <p style={{ margin: 0, fontSize: "13px", fontStyle: "italic", color: "#e1dacb", lineHeight: "1.4" }}>
                                "{wk.adfarTip}"
                              </p>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      
      <style jsx>{`
        .step-card:hover {
          border-color: #F4A942 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(244, 169, 66, 0.08);
        }
      `}</style>
    </div>
  );
}
