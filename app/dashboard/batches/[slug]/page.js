"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Circle,
  Lock,
  Play,
  ExternalLink,
  FileText,
  Video,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  AlertCircle,
  Star,
  Copy,
  Check
} from "lucide-react";

// Curated study guides and notes keyed by batch category and lectureNumber
const STUDY_NOTES = {
  FSD: {
    1: {
      module: "Web Development & JS Basics",
      takeaways: [
        "Client-Server Model: Web browsers (clients) request HTML/CSS/JS resources via HTTP/HTTPS. Servers process logic and respond with status codes.",
        "HTTP Methods: GET (fetch data), POST (create data), PUT/PATCH (update data), DELETE (remove data).",
        "HTTP Status Codes: 200 OK (success), 301/302 (redirect), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error).",
        "Terminal Navigation: navigate paths using 'cd <dir>', list contents using 'ls' (mac/linux) or 'dir' (windows), and make folders with 'mkdir <name>'.",
        "Git Essentials: Initialize using 'git init', stage files using 'git add .', commit snapshots using 'git commit -m \"msg\"', and push using 'git push'."
      ]
    },
    2: {
      module: "Web Development & JS Basics",
      takeaways: [
        "JS Compilation: JavaScript runs inside an Execution Context containing Memory Creation (hoisting) and Code Execution phases.",
        "Hoisting Mechanics: Variables declared with 'var' are initialized as undefined; function declarations are fully stored. 'let' and 'const' are hoisted into a Temporal Dead Zone.",
        "Scope Chain: Resolves variable access lexically. Functions reference their parent scopes, traveling up to the Global Scope.",
        "Closures Concept: A closure is the bundle of a function combined with references to its lexical environment, preserving outer variables even after execution finishes."
      ]
    },
    3: {
      module: "Web Development & JS Basics",
      takeaways: [
        "JS Concurrency: JavaScript is single-threaded, running async actions via Web APIs, Callback Queue, and the Event Loop.",
        "Promises Structure: Handles deferred operations, transitioning between Pending, Fulfilled, or Rejected states.",
        "Microtask vs Callback Queue: Event loop prioritizes the Microtask queue (Promises, queueMicrotask) over the Callback queue (setTimeout, DOM events).",
        "Async/Await Flow: Syntactic sugar built over promises, enabling sequential, synchronous-like code blocks using try/catch."
      ]
    },
    4: {
      module: "Modern Frontend with React & Next.js",
      takeaways: [
        "Virtual DOM Architecture: React maintains an in-memory JSON snapshot of the real browser DOM, optimizing costly paint operations.",
        "Reconciliation Algorithm: React's Fiber engine reconciles components by comparing Virtual DOM states, applying minimal path changes to the true DOM.",
        "JSX Compilation: Compiles JSX elements into raw React.createElement JavaScript calls under the hood.",
        "Key Attribute Importance: React uses key properties to uniquely track, move, update, or remove dynamic list elements efficiently during diffing."
      ]
    },
    5: {
      module: "Modern Frontend with React & Next.js",
      takeaways: [
        "Hook Rules: Hooks must be invoked only at the top level of React functions, not inside loops, conditions, or nested functions.",
        "State Batching: State update calls are batched by React for performance, re-rendering elements only once at the end of the execution block.",
        "useRef Utility: Retains persistent mutable references across render cycles without triggering a repaint or re-render when the value changes.",
        "useEffect Cleanup: Always return a cleanup function inside useEffect to dismantle event listeners, timers, or active web sockets."
      ]
    },
    6: {
      module: "Modern Frontend with React & Next.js",
      takeaways: [
        "React Server Components: RSCs render exclusively on the server, loading page details directly from database queries with 0KB shipped to client bundles.",
        "Client Components Paradigm: Enable interactivity (onClick, hooks) by explicitly declaring 'use client' at the top of the file.",
        "Data Fetching Optimizations: Next.js extends fetch to cache requests, automatically memoizing duplicated server fetches.",
        "Metadata Integration: Next.js parses structural metadata objects to dynamically serve SEO title and OpenGraph tags to browser engines."
      ]
    },
    7: {
      module: "Modern Frontend with React & Next.js",
      takeaways: [
        "Global State Challenges: Prop drilling creates unneeded component re-renders. Standardize stores for high-complexity shared states.",
        "React Context Limits: Context is optimized for low-frequency updates (themes, auth). High-frequency context updates re-render all subscribers.",
        "Zustand Framework: A highly performant, lightweight state management framework utilizing hooks and external store states.",
        "Slice Pattern: Break large Zustand stores into focused individual slices (e.g. auth slice, cart slice) to maintain clarity."
      ]
    },
    8: {
      module: "Backend, REST APIs & Databases",
      takeaways: [
        "Node.js Server Lifecycle: Exposes HTTP listeners. Event-driven architecture executes callback hooks as requests stream in.",
        "Express Router: Defines neat endpoints grouped by resources, supporting standard HTTP requests (GET, POST, etc.).",
        "Middleware Paradigm: Intercepts request-response streams. Enables parsing payloads, logging requests, and authenticating sessions.",
        "Error-Handling Middlewares: Must contain four arguments (err, req, res, next) as the final route in the Express configuration."
      ]
    },
    9: {
      module: "Backend, REST APIs & Databases",
      takeaways: [
        "Database Driver Connections: Raw connection requests trigger high CPU latency. Implement connection pools to reuse active socket streams.",
        "Singleton Promise Pattern: Instantiates the database client once, exposing a single connection instance across concurrent serverless routes.",
        "Aggregation Pipelines: MongoDB pipelines process, filter, group, and project collections using consecutive stages ($match, $group, $sort).",
        "Cursor Methods: Methods like find() return database cursor pointers. Convert cursors to arrays using toArray() to read records."
      ]
    },
    10: {
      module: "Backend, REST APIs & Databases",
      takeaways: [
        "SQL Relational Databases: SQL enforces structured schemas, foreign keys, and ACID transactions across tables.",
        "NoSQL Document Databases: Flexible, schema-less models optimized for fast horizontal scaling and hierarchical documents.",
        "Relationship Types: Represent relationships by embedding child records (ideal for 1-to-few) or referencing ObjectIds (ideal for 1-to-many).",
        "Database Indexing: Speeds up queries dramatically by creating search b-trees, reducing raw collection scan times."
      ]
    },
    11: {
      module: "Auth, Advanced Patterns & Cloud Deployment",
      takeaways: [
        "Session Token Integrity: BetterAuth uses a secure sessions database collection, linking cookie tokens to user indices on each server call.",
        "OAuth 2.0 Flow: Standard token handshake between Google, the client application, and the database for secure social logins.",
        "Secure Cookie Standards: Stores tokens in HTTP-only, Secure, SameSite=Lax cookies to prevent XSS (Cross-Site Scripting) theft.",
        "Route Protection: Exposes layout guards on the server to prevent unauthorized client rendering and route tampering."
      ]
    },
    12: {
      module: "Auth, Advanced Patterns & Cloud Deployment",
      takeaways: [
        "Docker Containerization: Docker packages the system libraries, node modules, and code configurations into an isolated runtime image.",
        "Production Hosting: Railways deploys containerized instances directly. Vercel hosts frontend routes statically on edge networks.",
        "CI/CD Pipeline: Automates building, linting, testing, and shipping directly upon git push operations to master branches.",
        "Secure Configuration Management: Never commit environment variables. Inject secrets securely at the platform orchestration layer."
      ]
    }
  },
  DSA: {
    1: {
      takeaways: [
        "Two-Pointer Pattern: Tracks array items using left and right pointer bounds, reducing search times from O(N^2) brute force to O(N) linear time.",
        "Convergence Conditions: Shift pointers toward the center depending on the current sum, sorting state, or boundary rules.",
        "Common Problems: Two Sum II, Valid Palindrome, Container With Most Water, 3Sum."
      ]
    },
    2: {
      takeaways: [
        "Hash Map Frequency Tracking: Stores key-value pairings allowing O(1) constant-time lookup, insert, and delete operations.",
        "Collision Resolution: Handled internally by hashing buckets using chaining or open addressing models.",
        "Common Problems: Contains Duplicate, Two Sum, Group Anagrams, Top K Frequent Elements."
      ]
    },
    3: {
      takeaways: [
        "Sliding Window Technique: Maintains a contiguous subsegment window, sliding boundaries dynamically to calculate subset stats.",
        "Static vs Dynamic Window: Static windows maintain fixed sizes. Dynamic windows grow or shrink based on constraints.",
        "Common Problems: Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters."
      ]
    },
    4: {
      takeaways: [
        "Binary Search Concept: Divides sorted search ranges by half in O(log N) logarithmic time, bypassing linear O(N) array scans.",
        "Loop Constraints: Ensure boundary loop checks use while(left <= right) to avoid off-by-one errors and infinite loops.",
        "Common Problems: Binary Search, Search a 2D Matrix, Find Minimum in Rotated Sorted Array."
      ]
    },
    5: {
      takeaways: [
        "Linked List Node Model: Represents node structures storing value keys and next pointer references.",
        "Pointer Reassignment: Mutate pointer addresses carefully to reverse, slice, or merge lists without losing list head anchors.",
        "Common Problems: Reverse Linked List, Merge Two Sorted Lists, Linked List Cycle."
      ]
    },
    6: {
      takeaways: [
        "Binary Tree Traversal: Node traversal models: Pre-order (root-left-right), In-order (left-root-right), and Post-order (left-right-root).",
        "Level Order (BFS): Leverages queues to traverse tree levels sequentially.",
        "Common Problems: Invert Binary Tree, Maximum Depth of Binary Tree, Binary Tree Level Order Traversal."
      ]
    },
    7: {
      takeaways: [
        "Graph Traversal BFS vs DFS: Depth First Search uses recursion/stacks. Breadth First Search uses queues.",
        "Union Find Algorithm: Group nodes dynamically to check connectivity in near-constant time.",
        "Common Problems: Number of Islands, Clone Graph, Course Schedule, Redundant Connection."
      ]
    },
    8: {
      takeaways: [
        "Dynamic Programming: Solves overlapping subproblems by memoizing subresults (Top-Down) or building tabulation charts (Bottom-Up).",
        "State Transition: Identify recurrence equations mapping larger problems back to base states.",
        "Common Problems: Climbing Stairs, House Robber, Coin Change, Longest Common Subsequence."
      ]
    },
    9: {
      takeaways: [
        "Greedy Choice Property: Greedy algorithms make locally optimal decisions at each stage, aiming for a global optimum.",
        "Interval Scheduling: Sort arrays by endpoint times to maximize concurrent scheduled items.",
        "Common Problems: Jump Game, Merge Intervals, Non-overlapping Intervals."
      ]
    },
    10: {
      takeaways: [
        "Technical Interview Structure: Reviewing performance complexity, explaining logic, dry running edge cases, and writing clean syntax.",
        "Mock Dry Run Rules: Always trace inputs line-by-line using variables mapping tables before committing code.",
        "Common Strategy: Speak out loud, structure base assumptions, and code modularly."
      ]
    }
  }
};

// Beautiful Star Rating Component
function StarRating({ currentRating, onSelect, disabled }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = hoverRating ? star <= hoverRating : star <= currentRating;
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(0)}
            style={{
              background: "none",
              border: "none",
              cursor: disabled ? "default" : "pointer",
              padding: "4px 2px",
              display: "flex",
              transition: "transform 0.15s ease",
            }}
          >
            <Star
              size={20}
              color={isActive ? "#F4A942" : "#D1D5DB"}
              fill={isActive ? "#F4A942" : "none"}
              strokeWidth={isActive ? 2 : 1.5}
            />
          </button>
        );
      })}
    </div>
  );
}

function JoinLiveButton({ scheduledAt, joinLink }) {
  const [status, setStatus] = useState("not_started");

  useEffect(() => {
    const check = () => {
      const now = Date.now();
      const start = new Date(scheduledAt).getTime();
      const diffMins = (now - start) / 60000;

      if (diffMins >= -30 && diffMins <= 180) {
        setStatus("live");
      } else if (diffMins > 180) {
        setStatus("ended");
      } else {
        setStatus("not_started");
      }
    };
    check();
    const timer = setInterval(check, 30000); // check every 30s
    return () => clearInterval(timer);
  }, [scheduledAt]);

  if (status === "live" && joinLink) {
    return (
      <a
        href={joinLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          background: "linear-gradient(135deg, #EF4444, #DC2626)",
          color: "white",
          borderRadius: "50px",
          fontWeight: 600,
          fontSize: "14px",
          textDecoration: "none",
          boxShadow: "0 4px 16px rgba(239,68,68,0.35)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white", flexShrink: 0 }} />
        Join Live Session
        <ExternalLink size={14} />
      </a>
    );
  }

  return null;
}

export default function BatchLecturePage() {
  const params = useParams();
  const { slug } = params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedLecture, setExpandedLecture] = useState(null);
  const [completing, setCompleting] = useState(null);
  
  // Rating and Taking Notes state
  const [ratingLoading, setRatingLoading] = useState({});
  const [ratingSuccess, setRatingSuccess] = useState({});
  const [feedbackComment, setFeedbackComment] = useState({});
  const [copiedState, setCopiedState] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/dashboard/batch/${slug}`);
        if (!res.ok) throw new Error("Failed to load batch data");
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const toggleComplete = async (lectureId) => {
    setCompleting(lectureId);
    try {
      const res = await fetch("/api/dashboard/complete-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSlug: slug, lectureId }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => ({
          ...prev,
          enrollment: {
            ...prev.enrollment,
            completedLectures: json.completedLectures,
          },
        }));
      }
    } catch {
      // silent fail
    } finally {
      setCompleting(null);
    }
  };

  const submitRating = async (lectureId, ratingValue) => {
    const commentText = feedbackComment[lectureId] || "";
    setRatingLoading((prev) => ({ ...prev, [lectureId]: true }));
    try {
      const res = await fetch("/api/dashboard/rate-lecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lectureId, rating: ratingValue, comment: commentText }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => ({
          ...prev,
          ratings: {
            ...prev.ratings,
            [lectureId]: { rating: ratingValue, comment: commentText },
          },
        }));
        setRatingSuccess((prev) => ({ ...prev, [lectureId]: true }));
        setTimeout(() => {
          setRatingSuccess((prev) => ({ ...prev, [lectureId]: false }));
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRatingLoading((prev) => ({ ...prev, [lectureId]: false }));
    }
  };

  const copyTakeaways = (lectureId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedState((prev) => ({ ...prev, [lectureId]: true }));
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [lectureId]: false }));
    }, 2500);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "3px solid var(--color-cream-dark)", borderTopColor: "var(--color-saffron)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--color-muted)" }}>Loading batch…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <AlertCircle size={36} style={{ color: "var(--color-muted)", margin: "0 auto 16px", display: "block" }} />
        <p style={{ color: "var(--color-charcoal)", fontWeight: 600, marginBottom: "8px" }}>Failed to load batch</p>
        <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{error}</p>
        <Link href="/dashboard" className="btn-primary" style={{ marginTop: "20px", display: "inline-flex" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const { batch, lectures, enrollment, announcements, ratings = {} } = data;
  const completedSet = new Set(enrollment?.completedLectures || []);
  const totalLectures = lectures.length;
  const completedCount = completedSet.size;
  const progress = totalLectures ? Math.round((completedCount / totalLectures) * 100) : 0;
  const now = new Date();

  // Dynamic motivators based on progress score
  let motivator = "Welcome to the valley of engineering! Let's make this week count! 🌸";
  if (progress > 0 && progress <= 30) {
    motivator = "Excellent start! Every concept mastered is a step closer to your first internship or job. 🏔️";
  } else if (progress > 30 && progress <= 70) {
    motivator = "You are scaling the peaks of engineering now! Keep the momentum! 🚀";
  } else if (progress > 70 && progress < 100) {
    motivator = "Incredible strength! Your dream tech role is within arm's reach! ✨";
  } else if (progress === 100) {
    motivator = "Congratulations! You have completed every single lecture in this batch! 🎓🌟";
  }

  return (
    <div className="dashboard-container" style={{ maxWidth: "900px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <Link href="/dashboard" style={{ fontSize: "13px", color: "var(--color-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "16px" }}>
          ← My Batches
        </Link>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "6px" }}>
          {batch.title}
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: "14px" }}>{batch.category} · {batch.duration} months</p>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: "24px", marginBottom: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: 42, height: 42, borderRadius: "10px", background: "rgba(244,169,66,0.12)", display: "flex", alignItems: "center", justifyCenter: "center", flexShrink: 0 }}>
            <BookOpen size={20} color="var(--color-saffron-dark)" style={{ margin: "0 auto" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-charcoal)" }}>
                {completedCount} of {totalLectures} lectures completed
              </span>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--color-saffron-dark)" }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--color-cream-dark)", paddingTop: "12px", fontSize: "13px", color: "var(--color-muted)", fontWeight: 500, fontStyle: "italic", display: "flex", alignItems: "center", gap: "6px" }}>
          <span>🌸</span> {motivator}
        </div>
      </div>

      {/* Batch announcements */}
      {announcements?.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          {announcements.map((ann) => (
            <div key={ann._id} className="announcement-pinned" style={{ marginBottom: "8px" }}>
              <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-saffron-dark)", marginBottom: "4px" }}>
                📌 {ann.title}
              </p>
              <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)" }}>{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Lectures */}
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, color: "var(--color-charcoal)", marginBottom: "16px" }}>
        Curriculum
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {lectures.map((lecture) => {
          const isCompleted = completedSet.has(lecture._id);
          const scheduledDate = new Date(lecture.scheduledAt);
          const isPast = scheduledDate <= now;
          const isExpanded = expandedLecture === lecture._id;
          
          // Get specific notes takeaways for this lecture
          const catNotes = STUDY_NOTES[batch.category] || {};
          const fallbackNote = catNotes[lecture.lectureNumber] || null;

          const takeaways = lecture.notes
            ? lecture.notes.split("\n").map((l) => l.trim()).filter(Boolean)
            : fallbackNote?.takeaways || [];

          const moduleName = lecture.moduleName || fallbackNote?.module || "General Module";

          const noteData = takeaways.length > 0 ? { module: moduleName, takeaways } : null;

          // Get rating status for this lecture
          const savedRating = ratings[lecture._id] || null;

          return (
            <div
              key={lecture._id}
              style={{
                background: "white",
                borderRadius: "14px",
                border: `1px solid ${isCompleted ? "rgba(45,106,79,0.2)" : "var(--color-cream-dark)"}`,
                overflow: "hidden",
                transition: "all 0.2s ease",
              }}
            >
              {/* Lecture header row */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: "pointer",
                  background: isCompleted ? "rgba(45,106,79,0.03)" : "white",
                }}
                onClick={() => setExpandedLecture(isExpanded ? null : lecture._id)}
              >
                {/* Complete toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(lecture._id);
                  }}
                  disabled={completing === lecture._id}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    flexShrink: 0,
                    opacity: completing === lecture._id ? 0.5 : 1,
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle size={22} color="var(--color-forest)" fill="rgba(45,106,79,0.1)" />
                  ) : (
                    <Circle size={22} color="var(--color-muted)" />
                  )}
                </button>

                {/* Lecture number */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: isCompleted ? "var(--color-forest)" : "var(--color-cream-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: isCompleted ? "white" : "var(--color-muted)",
                    flexShrink: 0,
                  }}
                >
                  {lecture.lectureNumber}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "15px", color: "var(--color-charcoal)", marginBottom: "2px" }}>
                    {lecture.title}
                  </p>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--color-muted)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={11} />
                      {scheduledDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <Clock size={11} />
                      {scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <JoinLiveButton scheduledAt={lecture.scheduledAt} joinLink={lecture.joinLink} />
                  {isExpanded ? <ChevronUp size={16} color="var(--color-muted)" /> : <ChevronDown size={16} color="var(--color-muted)" />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ padding: "0 20px 20px 20px", borderTop: "1px solid var(--color-cream-dark)" }}>
                  {lecture.description && (
                    <p style={{ fontSize: "14px", color: "var(--color-charcoal-light)", lineHeight: 1.7, margin: "16px 0" }}>
                      {lecture.description}
                    </p>
                  )}

                  {/* Dynamic study notes / takeaways */}
                  {noteData && (
                    <div
                      style={{
                        margin: "20px 0",
                        padding: "18px 20px",
                        background: "rgba(45,106,79,0.04)",
                        borderLeft: "4px solid var(--color-forest)",
                        borderRadius: "0 12px 12px 0",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-forest)", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>📖</span> Study Guide &amp; Key Takeaways
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const bulletText = noteData.takeaways.map((t, idx) => `${idx + 1}. ${t}`).join("\n");
                            const notesFull = `Notes for Lecture ${lecture.lectureNumber}: ${lecture.title}\n\n${bulletText}`;
                            copyTakeaways(lecture._id, notesFull);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--color-muted)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(45,106,79,0.06)"; e.currentTarget.style.color = "var(--color-forest)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-muted)"; }}
                        >
                          {copiedState[lecture._id] ? (
                            <>
                              <Check size={12} color="var(--color-forest)" />
                              <span style={{ color: "var(--color-forest)" }}>Copied! 🌸</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Notes</span>
                            </>
                          )}
                        </button>
                      </div>
                      <ul style={{ paddingLeft: "18px", margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                        {noteData.takeaways.map((takeaway, idx) => (
                          <li key={idx} style={{ fontSize: "13.5px", color: "var(--color-charcoal-light)", lineHeight: 1.6 }}>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
                    {/* Recording link states based on live schedule and upload status */}
                    {!isPast ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-muted)", padding: "8px 0" }}>
                        <Lock size={13} color="var(--color-muted)" />
                        <span>Live session has not started yet. Class starts on {scheduledDate.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })} at {scheduledDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}. 📅</span>
                      </div>
                    ) : lecture.recordingLink ? (
                      <a
                        href={lecture.recordingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-forest"
                        style={{ padding: "8px 16px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                      >
                        <Video size={13} /> Watch Recording
                      </a>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                        <div>
                          <button
                            disabled
                            style={{
                              padding: "8px 16px",
                              fontSize: "13px",
                              background: "#E5E7EB",
                              color: "#9CA3AF",
                              border: "1.5px solid #D1D5DB",
                              borderRadius: "8px",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              cursor: "not-allowed",
                              fontWeight: 600,
                            }}
                          >
                            <Video size={13} color="#9CA3AF" /> Watch Recording (Not Available)
                          </button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--color-saffron-dark)", background: "rgba(244,169,66,0.06)", padding: "10px 14px", borderRadius: "8px", border: "1px solid rgba(244,169,66,0.2)", width: "fit-content" }}>
                          <Clock size={13} color="var(--color-saffron-dark)" />
                          <span>Live session has ended. The recording will be uploaded shortly by the instructor. 🕒</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Resources */}
                  {lecture.resources?.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                        Resources
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {lecture.resources.map((r, i) => (
                          <a
                            key={i}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "10px 14px",
                              background: "var(--color-cream)",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "var(--color-charcoal)",
                              textDecoration: "none",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-cream-dark)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-cream)")}
                          >
                            <FileText size={13} color="var(--color-saffron-dark)" />
                            {r.name}
                            <ExternalLink size={11} style={{ marginLeft: "auto", color: "var(--color-muted)" }} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assignment */}
                  {lecture.assignment && (
                    <div
                      style={{
                        marginTop: "20px",
                        padding: "16px",
                        background: "rgba(99,102,241,0.06)",
                        border: "1px solid rgba(99,102,241,0.15)",
                        borderRadius: "10px",
                      }}
                    >
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "#4F46E5", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                        Assignment
                      </p>
                      <h4 style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 700, marginBottom: "6px" }}>
                        {lecture.assignment.title}
                      </h4>
                      <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)", lineHeight: 1.6, marginBottom: "10px" }}>
                        {lecture.assignment.description}
                      </p>
                      <p style={{ fontSize: "12px", color: "#4F46E5", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock size={11} />
                        Due: {new Date(lecture.assignment.deadline).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  )}

                  {/* session interactive feedback & ratings */}
                  {isPast && (
                    <div
                      style={{
                        marginTop: "24px",
                        padding: "20px",
                        background: "var(--color-cream)",
                        border: "1.5px solid var(--color-cream-dark)",
                        borderRadius: "12px",
                      }}
                    >
                      <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                        ⭐ Rate &amp; Review this session
                      </p>
                      
                      {savedRating ? (
                        <div>
                          <div style={{ display: "flex", gap: "4px", marginBottom: "8px", alignItems: "center" }}>
                            <StarRating currentRating={savedRating.rating} disabled={true} />
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-saffron-dark)", marginLeft: "4px" }}>
                              {savedRating.rating}/5 Rated
                            </span>
                          </div>
                          {savedRating.comment ? (
                            <p style={{ fontSize: "13.5px", color: "var(--color-muted)", fontStyle: "italic", background: "white", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--color-cream-dark)" }}>
                              &ldquo;{savedRating.comment}&rdquo;
                            </p>
                          ) : (
                            <p style={{ fontSize: "13.5px", color: "var(--color-muted)" }}>Thank you for rating this session!</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: "13px", color: "var(--color-charcoal-light)", marginBottom: "12px" }}>
                            How was your learning experience with Adfar in this class? Let us know:
                          </p>
                          
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {/* Star input selector */}
                            <StarRating
                              currentRating={0}
                              onSelect={(stars) => submitRating(lecture._id, stars)}
                              disabled={ratingLoading[lecture._id]}
                            />

                            <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                              <input
                                type="text"
                                placeholder="Add comments, notes, or specific feedback (optional)"
                                value={feedbackComment[lecture._id] || ""}
                                onChange={(e) => setFeedbackComment((prev) => ({ ...prev, [lecture._id]: e.target.value }))}
                                disabled={ratingLoading[lecture._id]}
                                style={{
                                  flex: 1,
                                  padding: "8px 12px",
                                  border: "1.5px solid var(--color-cream-dark)",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  outline: "none"
                                }}
                              />
                            </div>

                            {ratingSuccess[lecture._id] && (
                              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-forest)" }}>
                                ✓ Feedback submitted successfully! 🌸
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(239,68,68,0.35); }
          50% { box-shadow: 0 4px 30px rgba(239,68,68,0.6); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
