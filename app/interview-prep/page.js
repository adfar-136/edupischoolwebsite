"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Dynamic inline SVGs for high-impact visual design
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5Z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/></svg>
);

const RotateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const topics = ["All", "DSA", "JavaScript", "React", "Node.js", "MongoDB", "GenAI", "HR"];
const difficulties = ["All", "Easy", "Medium", "Hard"];

// Subjective Local Text Similarity Matcher (Pure JS Word Vector Cosine Similarity)
const calculateSimilarity = (userText, officialText) => {
  if (!userText || !officialText) return 0;
  
  // Tokenize & sanitize: lowercase, strip punctuation, filter stop words
  const clean = (text) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2 && !["the", "and", "for", "with", "this", "that", "from", "you"].includes(word));
        
  const userTokens = clean(userText);
  const officialTokens = clean(officialText);
  
  if (userTokens.length === 0 || officialTokens.length === 0) return 0;
  
  // Build a distinct vocabulary set
  const vocab = new Set([...userTokens, ...officialTokens]);
  
  // Word frequency calculations
  const freqUser = {};
  const freqOfficial = {};
  vocab.forEach(w => {
    freqUser[w] = 0;
    freqOfficial[w] = 0;
  });
  
  userTokens.forEach(w => freqUser[w]++);
  officialTokens.forEach(w => freqOfficial[w]++);
  
  // Dot product and magnitudes
  let dotProduct = 0;
  let magnitudeUser = 0;
  let magnitudeOfficial = 0;
  
  vocab.forEach(w => {
    dotProduct += freqUser[w] * freqOfficial[w];
    magnitudeUser += freqUser[w] * freqUser[w];
    magnitudeOfficial += freqOfficial[w] * freqOfficial[w];
  });
  
  magnitudeUser = Math.sqrt(magnitudeUser);
  magnitudeOfficial = Math.sqrt(magnitudeOfficial);
  
  if (magnitudeUser === 0 || magnitudeOfficial === 0) return 0;
  
  // Raw Cosine Metric
  const score = dotProduct / (magnitudeUser * magnitudeOfficial);
  const cosinePercent = Math.round(score * 100);

  // Boost metrics based on key-token overlaps (since subjective explanations vary)
  const shared = userTokens.filter(w => officialTokens.includes(w));
  const keywordRecall = shared.length / Math.min(officialTokens.length, 12);
  const recallPercent = Math.round(Math.min(keywordRecall, 1) * 100);

  // Weighted score: 35% cosine syntax match + 65% core keyword capture
  let finalPercent = Math.round((cosinePercent * 0.35) + (recallPercent * 0.65));
  
  // Cap values
  if (finalPercent > 100) finalPercent = 100;
  if (finalPercent < 0) finalPercent = 0;
  
  return finalPercent;
};

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Card Mechanics States
  const [flippedCards, setFlippedCards] = useState({});
  const [highlightedCardId, setHighlightedCardId] = useState(null);

  // Subjective Answer Submission States
  const [ratings, setRatings] = useState({}); // { [qId]: 'mastered' | 'review' | 'unsure' }
  const [typedAnswers, setTypedAnswers] = useState({}); // Stores active textarea changes { [qId]: 'text' }
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // Persists grading details { [qId]: { text, score, revealed: bool } }
  
  const isHydrated = useRef(false);

  // Load localStorage data safely
  useEffect(() => {
    isHydrated.current = true;
    
    const savedRatings = localStorage.getItem("interview_ratings");
    if (savedRatings) setRatings(JSON.parse(savedRatings));

    const savedSubmissions = localStorage.getItem("interview_submissions");
    if (savedSubmissions) {
      const parsed = JSON.parse(savedSubmissions);
      setSubmittedAnswers(parsed);
      
      // Seed textarea values with saved text
      const initialText = {};
      Object.keys(parsed).forEach((k) => {
        initialText[k] = parsed[k].text;
      });
      setTypedAnswers(initialText);
    }
  }, []);

  // Filter debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch Questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTopic !== "All") params.append("topic", activeTopic);
      if (activeDifficulty !== "All") params.append("difficulty", activeDifficulty);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    setHighlightedCardId(null);
    setFlippedCards({});
  }, [activeTopic, activeDifficulty, debouncedSearch]);

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Glow randomizer
  const handleRandomQuestion = () => {
    if (questions.length === 0) return;

    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQ = questions[randomIndex];

    setFlippedCards({});
    setHighlightedCardId(selectedQ._id);

    setTimeout(() => {
      const element = document.getElementById(`card-${selectedQ._id}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);

    setTimeout(() => {
      setFlippedCards((prev) => ({
        ...prev,
        [selectedQ._id]: true,
      }));
    }, 600);
  };

  // Self rating controllers
  const handleSetRating = (qId, type) => {
    const updated = { ...ratings, [qId]: type };
    setRatings(updated);
    localStorage.setItem("interview_ratings", JSON.stringify(updated));
  };

  // Subjective text submission grading engine
  const handleSubmitAnswer = (qId, officialAnswer) => {
    const answerText = typedAnswers[qId] || "";
    if (!answerText.trim()) return;

    // Calculate dynamic similarity
    const score = calculateSimilarity(answerText, officialAnswer);
    
    const updatedSubmissions = {
      ...submittedAnswers,
      [qId]: {
        text: answerText,
        score: score,
        revealed: true
      }
    };
    
    setSubmittedAnswers(updatedSubmissions);
    localStorage.setItem("interview_submissions", JSON.stringify(updatedSubmissions));
  };

  // Reset subjective test card so students can rewrite
  const handleResetAnswer = (qId) => {
    const updatedSubmissions = { ...submittedAnswers };
    delete updatedSubmissions[qId];
    setSubmittedAnswers(updatedSubmissions);
    localStorage.setItem("interview_submissions", JSON.stringify(updatedSubmissions));

    setTypedAnswers((prev) => ({ ...prev, [qId]: "" }));
  };

  // Get difficulty styles
  const getDiffBadgeStyles = (diff) => {
    if (diff === "Easy") return { background: "rgba(82, 183, 136, 0.15)", color: "#52B788", border: "1px solid rgba(82,183,136,0.2)" };
    if (diff === "Medium") return { background: "rgba(244, 169, 66, 0.15)", color: "#F4A942", border: "1px solid rgba(244,169,66,0.2)" };
    return { background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" };
  };

  // Segmented stats calculations
  const totalCount = questions.length;
  const masteredCount = Object.keys(ratings).filter(
    (k) => ratings[k] === "mastered" && questions.some((q) => q._id === k)
  ).length;
  const reviewCount = Object.keys(ratings).filter(
    (k) => ratings[k] === "review" && questions.some((q) => q._id === k)
  ).length;
  const unsureCount = Object.keys(ratings).filter(
    (k) => ratings[k] === "unsure" && questions.some((q) => q._id === k)
  ).length;

  return (
    <div style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "#faf7f2", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main style={{ flex: 1, padding: "80px 0 100px 0", position: "relative", overflow: "hidden" }}>
        {/* Glow ambient panels */}
        <div style={{ position: "absolute", top: "15%", right: "10%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244, 169, 66, 0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "15%", left: "10%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(82, 183, 136, 0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header Block */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-saffron" style={{ marginBottom: "12px", background: "rgba(244, 169, 66, 0.1)", color: "#F4A942", border: "1px solid rgba(244,169,66,0.2)" }}>
              Subjective Testing Sandbox v5.0
            </span>
            <h1 className="font-display" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAF7F2", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "16px" }}>
              Technical Flip-Card Trainer
            </h1>
            <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto", fontSize: "16px", color: "#a59e95" }}>
              Submit your subjective answers first. Score your correctness percentage dynamically against key terms, review the solution key, and rate your confidence!
            </p>
          </div>

          {/* Prep Stats Panel */}
          {totalCount > 0 && (
            <div className="glass-card" style={{ padding: "20px 24px", borderRadius: "18px", marginBottom: "30px", borderLeft: "4px solid var(--color-saffron)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#FAF7F2", fontFamily: "var(--font-sans)" }}>
                  Subjective Preparation Performance Stats
                </span>
                <div style={{ display: "flex", gap: "15px", fontSize: "12px", color: "#a59e95" }}>
                  <span>🟢 Mastered: <strong>{masteredCount}</strong></span>
                  <span>🟡 Reviewing: <strong>{reviewCount}</strong></span>
                  <span>🔴 Unsure: <strong>{unsureCount}</strong></span>
                </div>
              </div>

              {/* Multi-segmented color indicator tracking */}
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", display: "flex", overflow: "hidden" }}>
                <div style={{ width: `${totalCount > 0 ? (masteredCount / totalCount) * 100 : 0}%`, background: "#52B788", height: "100%", transition: "all 0.3s" }} />
                <div style={{ width: `${totalCount > 0 ? (reviewCount / totalCount) * 100 : 0}%`, background: "#F4A942", height: "100%", transition: "all 0.3s" }} />
                <div style={{ width: `${totalCount > 0 ? (unsureCount / totalCount) * 100 : 0}%`, background: "#EF4444", height: "100%", transition: "all 0.3s" }} />
              </div>
            </div>
          )}

          {/* Filtering & Operations Console */}
          <div className="glass-card" style={{ padding: "24px", borderRadius: "20px", marginBottom: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* TOP ROW: Search & Randomizer */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center", justifyContent: "space-between" }}>
                {/* Keyword search input */}
                <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
                  <span style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#a59e95", display: "flex" }}>
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="Search keywords in questions or answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 45px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1.5px solid rgba(255,255,255,0.08)",
                      borderRadius: "50px",
                      color: "#faf7f2",
                      fontSize: "14px",
                      outline: "none",
                      transition: "all 0.25s ease",
                    }}
                    className="search-input-field"
                  />
                </div>

                {/* Randomizer Button */}
                <button
                  onClick={handleRandomQuestion}
                  disabled={questions.length === 0}
                  className="btn-primary glow-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 28px",
                    fontSize: "14px",
                    fontWeight: 700,
                    opacity: questions.length === 0 ? 0.5 : 1,
                    cursor: questions.length === 0 ? "not-allowed" : "pointer"
                  }}
                >
                  <SparklesIcon />
                  Random Question
                </button>
              </div>

              {/* SECOND ROW: Topic filter pills */}
              <div>
                <span style={{ display: "block", fontSize: "12px", textTransform: "uppercase", fontWeight: 600, color: "#a59e95", marginBottom: "10px", letterSpacing: "0.05em" }}>
                  Filter by Topic
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {topics.map((t) => {
                    const isSelected = activeTopic === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setActiveTopic(t)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "50px",
                          border: isSelected ? "1.5px solid #F4A942" : "1.5px solid rgba(255,255,255,0.08)",
                          background: isSelected ? "rgba(244,169,66,0.12)" : "rgba(255,255,255,0.02)",
                          color: isSelected ? "#F4A942" : "#d1cac0",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all 0.25s ease"
                        }}
                        className="topic-pill-btn"
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* THIRD ROW: Difficulty toggle */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "15px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#a59e95" }}>Difficulty:</span>
                  <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "50px", border: "1.5px solid rgba(255,255,255,0.06)" }}>
                    {difficulties.map((diff) => {
                      const isSelected = activeDifficulty === diff;
                      return (
                        <button
                          key={diff}
                          onClick={() => setActiveDifficulty(diff)}
                          style={{
                            padding: "6px 14px",
                            border: "none",
                            borderRadius: "50px",
                            background: isSelected ? "#FAF7F2" : "transparent",
                            color: isSelected ? "#1C1C1C" : "#a59e95",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.25s ease"
                          }}
                        >
                          {diff}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ fontSize: "13px", color: "#a59e95" }}>
                  Showing <strong style={{ color: "#F4A942" }}>{questions.length}</strong> verified questions
                </div>
              </div>

            </div>
          </div>

          {/* Cards Loading Grid */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", gap: "16px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(244,169,66,0.1)", borderTopColor: "#F4A942", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "#a59e95", fontSize: "14px" }}>Fetching premium questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "300px", padding: "40px", borderRadius: "20px", textAlign: "center" }}>
              <span style={{ fontSize: "40px", marginBottom: "15px" }}>🔍</span>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: 700 }}>No Questions Found</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#a59e95", maxWidth: "450px" }}>
                We couldn't find any questions matching your current filters. Try resetting search queries or pills!
              </p>
            </div>
          ) : (
            /* Flip Card Grid */
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
              {questions.map((q) => {
                const isFlipped = !!flippedCards[q._id];
                const isHighlighted = highlightedCardId === q._id;
                const diffStyle = getDiffBadgeStyles(q.difficulty);
                const qRating = ratings[q._id] || "";
                
                // Submission variables
                const subDetails = submittedAnswers[q._id];
                const isSubmitted = !!subDetails;
                const score = subDetails?.score || 0;

                return (
                  <div
                    key={q._id}
                    id={`card-${q._id}`}
                    onClick={() => toggleFlip(q._id)}
                    className={`flip-card ${isFlipped ? "flipped" : ""}`}
                    style={{ height: "440px" }} // Expanded height for clean subjective testing frames
                  >
                    <div className="flip-card-inner">
                      {/* CARD FRONT CONTAINER */}
                      <div
                        className="flip-card-front"
                        style={{
                          border: isHighlighted
                            ? "2px solid #F4A942"
                            : isCompletedBorder(qRating),
                          boxShadow: isHighlighted
                            ? "0 0 25px rgba(244,169,66,0.4)"
                            : "0 8px 32px 0 rgba(0,0,0,0.2)",
                          background: "rgba(20, 20, 20, 0.85)"
                        }}
                      >
                        {/* Front Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <span className="badge" style={{ background: "rgba(255,255,255,0.06)", color: "#FAF7F2", border: "1px solid rgba(255,255,255,0.1)", fontSize: "11px", padding: "2px 8px" }}>
                            {q.topic}
                          </span>
                          
                          {/* Rating display */}
                          {qRating && (
                            <span style={{ fontSize: "11px", color: qRating === "mastered" ? "#52B788" : qRating === "review" ? "#F4A942" : "#EF4444" }}>
                              {qRating === "mastered" ? "🟢 Mastered" : qRating === "review" ? "🟡 Review" : "🔴 Unsure"}
                            </span>
                          )}

                          <span className="badge" style={{ ...diffStyle, fontSize: "11px", padding: "2px 8px" }}>
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Front Body */}
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0" }}>
                          <p style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.5, margin: 0, textAlign: "center", color: "#faf7f2" }}>
                            {q.question}
                          </p>
                        </div>

                        {/* Front Footer */}
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", width: "100%", fontSize: "12px", color: "#F4A942", fontWeight: 600 }}>
                          <span>Subjective Answer Sandbox</span>
                          <span style={{ display: "flex" }} className="reveal-sparkle">✍️</span>
                        </div>
                      </div>

                      {/* CARD BACK CONTAINER (Testing Sandbox) */}
                      <div
                        className="flip-card-back"
                        style={{
                          border: isHighlighted
                            ? "2px solid #F4A942"
                            : isCompletedBorder(qRating)
                        }}
                      >
                        {/* Back Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "8px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#F4A942" }}>Subjective Terminal</span>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlip(q._id);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#a59e95",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11px"
                            }}
                          >
                            <RotateIcon />
                            Flip Front
                          </button>
                        </div>

                        {/* PHASE 1: Write subjective answer first */}
                        {!isSubmitted ? (
                          <div 
                            style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, padding: "12px 0 0 0" }}
                            onClick={(e) => e.stopPropagation()} // Stop dynamic flip triggers
                          >
                            <span style={{ fontSize: "12px", color: "#faf7f2", fontWeight: 600 }}>
                              Q: {q.question.length > 70 ? `${q.question.substring(0, 70)}...` : q.question}
                            </span>
                            
                            <textarea
                              placeholder="Write your subjective answer details here... (Note: Where code is required, please write clear PSEUDOCODE instead!)"
                              value={typedAnswers[q._id] || ""}
                              onChange={(e) => setTypedAnswers({ ...typedAnswers, [q._id]: e.target.value })}
                              style={{
                                flex: 1,
                                width: "100%",
                                minHeight: "150px",
                                background: "rgba(0,0,0,0.25)",
                                border: "1.5px solid rgba(255,255,255,0.06)",
                                borderRadius: "12px",
                                color: "#FAF7F2",
                                padding: "12px",
                                fontSize: "12.5px",
                                outline: "none",
                                resize: "none",
                                lineHeight: "1.5",
                                fontFamily: "var(--font-sans)"
                              }}
                              className="note-scratchpad"
                            />
                            
                            <button
                              type="button"
                              onClick={() => handleSubmitAnswer(q._id, q.answer)}
                              disabled={!(typedAnswers[q._id] || "").trim()}
                              className="btn-primary glow-btn"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                padding: "12px",
                                fontSize: "13px",
                                fontWeight: 700,
                                opacity: (typedAnswers[q._id] || "").trim() ? 1 : 0.4,
                                cursor: (typedAnswers[q._id] || "").trim() ? "pointer" : "not-allowed"
                              }}
                            >
                              <SendIcon />
                              Analyze & Grade Correctness
                            </button>
                          </div>
                        ) : (
                          /* PHASE 2: Submit matches, score gauge & reveal official answer key */
                          <div 
                            style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, overflowY: "auto", padding: "12px 0 0 0" }}
                            className="card-back-scrollable"
                            onClick={(e) => e.stopPropagation()} // Stop click flip propagation
                          >
                            {/* Similarity scoring gauge display */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: score >= 75 ? "rgba(82,183,136,0.08)" : score >= 40 ? "rgba(244,169,66,0.08)" : "rgba(239,68,68,0.08)", border: `1.5px solid ${score >= 75 ? "#52B788" : score >= 40 ? "#F4A942" : "#EF4444"}`, borderRadius: "12px", padding: "10px 14px" }}>
                              <div>
                                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#a59e95", textTransform: "uppercase", marginBottom: "2px" }}>
                                  Correctness Match Rate
                                </span>
                                <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: score >= 75 ? "#52B788" : score >= 40 ? "#F4A942" : "#EF4444" }}>
                                  {score}% Match
                                </h4>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleResetAnswer(q._id)}
                                style={{
                                  background: "rgba(255,255,255,0.04)",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "#FAF7F2",
                                  cursor: "pointer",
                                  padding: "5px 10px",
                                  borderRadius: "6px",
                                  fontSize: "11px"
                                }}
                              >
                                Try Again ↩
                              </button>
                            </div>

                            {/* Revealed Official Key */}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
                              <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#F4A942", textTransform: "uppercase", marginBottom: "6px" }}>
                                Official Answer Key
                              </span>
                              <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#e1dacb", background: "rgba(0,0,0,0.15)", padding: "10px", borderRadius: "10px" }}>
                                {q.answer.split("\n").map((para, pIdx) => (
                                  <p key={pIdx} style={{ margin: "0 0 6px 0" }}>{para}</p>
                                ))}
                              </div>
                            </div>

                            {/* Confidence rating selector */}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#a59e95" }}>Review Confidence:</span>
                              <div style={{ display: "flex", gap: "6px" }}>
                                {[
                                  { type: "unsure", label: "Unsure", color: "#EF4444" },
                                  { type: "review", label: "Review", color: "#F4A942" },
                                  { type: "mastered", label: "Mastered", color: "#52B788" }
                                ].map((btn) => {
                                  const isRated = qRating === btn.type;
                                  return (
                                    <button
                                      key={btn.type}
                                      type="button"
                                      onClick={() => handleSetRating(q._id, btn.type)}
                                      style={{
                                        padding: "3px 8px",
                                        border: isRated ? `1.5px solid ${btn.color}` : "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "4px",
                                        background: isRated ? `${btn.color}15` : "rgba(255,255,255,0.02)",
                                        color: isRated ? btn.color : "#a59e95",
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.25s ease"
                                      }}
                                    >
                                      {btn.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Embedded Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .search-input-field:focus {
          border-color: #F4A942 !important;
          background: rgba(255,255,255,0.05) !important;
          box-shadow: 0 0 15px rgba(244,169,66,0.15);
        }

        .topic-pill-btn:hover {
          border-color: #F4A942 !important;
          color: #F4A942 !important;
        }

        .reveal-sparkle {
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .note-scratchpad:focus {
          border-color: #F4A942 !important;
          background: rgba(0,0,0,0.2) !important;
        }

        .card-back-scrollable::-webkit-scrollbar {
          width: 4px;
        }
        .card-back-scrollable::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .card-back-scrollable::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .card-back-scrollable::-webkit-scrollbar-thumb:hover {
          background: rgba(244,169,66,0.3);
        }
      `}</style>
    </div>
  );
}

function isCompletedBorder(rating) {
  if (rating === "mastered") return "1.5px solid rgba(82, 183, 136, 0.4)";
  if (rating === "review") return "1.5px solid rgba(244, 169, 66, 0.4)";
  if (rating === "unsure") return "1.5px solid rgba(239, 68, 68, 0.4)";
  return "1px solid rgba(255, 255, 255, 0.08)";
}
