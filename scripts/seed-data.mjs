import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Error: MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const fsdBatchId = new ObjectId("647712f20000000000000001");
const dsaBatchId = new ObjectId("647712f20000000000000002");

const batches = [
  {
    _id: fsdBatchId,
    title: "Full Stack Development",
    slug: "full-stack-development",
    category: "FSD",
    description: "Master React, Next.js, Node.js, MongoDB, and modern deployment. Build real production apps from scratch.",
    fees: 8000,
    duration: 8,
    startDate: new Date("2026-06-01T00:00:00.000Z"),
    thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
    status: "active",
    createdAt: new Date(),
  },
  {
    _id: dsaBatchId,
    title: "Data Structures & Algorithms",
    slug: "data-structures-algorithms",
    category: "DSA",
    description: "Master DSA with real-world intuition. From arrays and trees to DP and graphs — with actual interview prep.",
    fees: 3000,
    duration: 5,
    startDate: new Date("2026-06-01T00:00:00.000Z"),
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    status: "active",
    createdAt: new Date(),
  }
];

// 12 High-quality lectures for FSD spanning 4 distinct modules
const lectures = [
  // --- MODULE 1: Web Development & JavaScript Basics ---
  {
    batchId: fsdBatchId,
    lectureNumber: 1,
    title: "[Module 1] Web Architecture & Terminal Basics",
    description: "How the web works, client-server models, HTTP protocol, command-line usage, and Git version control setup.",
    scheduledAt: new Date("2026-06-07T10:00:00.000Z"), // Sunday, June 7
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "https://drive.google.com/drive/folders/rec1",
    resources: [
      { name: "HTTP Cheatsheet", url: "https://drive.google.com/file/http-cheatsheet" },
      { name: "Git Commands Cheatsheet", url: "https://drive.google.com/file/git-commands" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 2,
    title: "[Module 1] JavaScript Execution Context & Call Stack",
    description: "Deep dive into JS internals: Execution Context, Variable Environment, Scope Chain, closures, and the Call Stack.",
    scheduledAt: new Date("2026-06-14T10:00:00.000Z"), // Sunday, June 14
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "https://drive.google.com/drive/folders/rec2",
    resources: [
      { name: "JS Execution Context Slides", url: "https://drive.google.com/file/js-internals" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 3,
    title: "[Module 1] Asynchronous JavaScript & Event Loop",
    description: "Understanding Async programming, callbacks, promises, async/await, Microtask queue, Callback queue, and the Event Loop.",
    scheduledAt: new Date("2026-06-21T10:00:00.000Z"), // Sunday, June 21
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Event Loop Visualization Tools", url: "https://latentflip.com/loupe/" }
    ],
    completed: false,
    createdAt: new Date()
  },

  // --- MODULE 2: Modern Frontend with React & Next.js ---
  {
    batchId: fsdBatchId,
    lectureNumber: 4,
    title: "[Module 2] React Engine, Virtual DOM & JSX",
    description: "How React renders: Virtual DOM, reconciliation, Diffing algorithm, Fibers, and compiling JSX components.",
    scheduledAt: new Date("2026-06-28T10:00:00.000Z"), // Sunday, June 28
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "React Diffing Algorithm Docs", url: "https://react.dev/" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 5,
    title: "[Module 2] React Hooks Engine: State & Ref",
    description: "Deep mechanics of React state management: useState batching, closures in hooks, and persistent DOM references with useRef.",
    scheduledAt: new Date("2026-07-05T10:00:00.000Z"), // Sunday, July 5
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "State hooks code examples", url: "https://drive.google.com/file/react-hooks" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 6,
    title: "[Module 2] Next.js 16 Server Components & Data Fetching",
    description: "Next.js App router paradigm: Server-side rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), and async Server Components.",
    scheduledAt: new Date("2026-07-12T10:00:00.000Z"), // Sunday, July 12
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Next.js SSR vs SSG Guide", url: "https://nextjs.org/docs" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 7,
    title: "[Module 2] State Management with Context & Zustand",
    description: "When to use React Context. Setting up lightweight global state using Zustand and comparing store paradigms.",
    scheduledAt: new Date("2026-07-19T10:00:00.000Z"), // Sunday, July 19
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Zustand Starter Store Template", url: "https://github.com/" }
    ],
    completed: false,
    createdAt: new Date()
  },

  // --- MODULE 3: Backend, REST APIs & Databases ---
  {
    batchId: fsdBatchId,
    lectureNumber: 8,
    title: "[Module 3] Express Backend Architecture & Middleware",
    description: "Structuring clean Node.js backends. Request-response life cycle, building custom authentication and logger middleware.",
    scheduledAt: new Date("2026-07-26T10:00:00.000Z"), // Sunday, July 26
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Express Architecture Best Practices", url: "https://drive.google.com/file/express-arch" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 9,
    title: "[Module 3] MongoDB Connection Pool & Native Operations",
    description: "Avoiding connection leaks in serverless runtimes. Singleton connection promise pool, advanced aggregation pipelines, and raw operations.",
    scheduledAt: new Date("2026-08-02T10:00:00.000Z"), // Sunday, August 2
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "MongoDB Aggregations Cheatsheet", url: "https://drive.google.com/file/mongo-agg" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 10,
    title: "[Module 3] Database Schema Relationships: SQL vs NoSQL",
    description: "Designing schemas. Handling 1-to-many and many-to-many relations in relational databases (PostgreSQL) vs document databases (MongoDB).",
    scheduledAt: new Date("2026-08-09T10:00:00.000Z"), // Sunday, August 9
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Relational Mapping Diagrams", url: "https://drive.google.com/file/rel-db" }
    ],
    completed: false,
    createdAt: new Date()
  },

  // --- MODULE 4: Auth, Advanced Patterns & Cloud Deployment ---
  {
    batchId: fsdBatchId,
    lectureNumber: 11,
    title: "[Module 4] Implementing Authentication & BetterAuth Flow",
    description: "Implementing credentials signup, sessions table, accounts linking, social OAuth providers, and route guards.",
    scheduledAt: new Date("2026-08-16T10:00:00.000Z"), // Sunday, August 16
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Auth Flow Diagram", url: "https://better-auth.com/" }
    ],
    completed: false,
    createdAt: new Date()
  },
  {
    batchId: fsdBatchId,
    lectureNumber: 12,
    title: "[Module 4] Deploying to Production: Railway, Vercel & Docker",
    description: "Containerizing backend instances with Docker. Deploying the frontend to Vercel, server instances to Railway, and securing environment configurations.",
    scheduledAt: new Date("2026-08-23T10:00:00.000Z"), // Sunday, August 23
    joinLink: "https://meet.google.com/abc-defg-hij",
    recordingLink: "",
    resources: [
      { name: "Dockerfile Templates", url: "https://drive.google.com/file/dockerfiles" }
    ],
    completed: false,
    createdAt: new Date()
  }
];

// Three premium Sunday/Monday masterclasses scheduled for the next three Mondays: June 1, June 8, and June 15, 2026
const masterclasses = [
  {
    topic: "NextJS 16 Production Performance & Advanced Caching Strategy",
    description: "Deep dive on static page path optimizations, custom request memoizations, full route cache busting, and performance telemetry.",
    scheduledAt: new Date("2026-06-01T14:00:00.000Z"), // Monday, June 1, 2026
    price: 199,
    joinLink: "https://meet.google.com/master-june-1",
    recordingLink: "",
    createdAt: new Date()
  },
  {
    topic: "Cracking Full Stack Engineering Interviews in 2026",
    description: "Reviewing exact system architecture, REST API design, schema query optimization, and real-world system questions asked in interviews.",
    scheduledAt: new Date("2026-06-08T14:00:00.000Z"), // Monday, June 8, 2026
    price: 199,
    joinLink: "https://meet.google.com/master-june-8",
    recordingLink: "",
    createdAt: new Date()
  },
  {
    topic: "Building Generative AI Products from Scratch: APIs, Embeddings & RAG",
    description: "Practical engineering guide to LangChain agents, retrieval engines, prompt structure, and multimodal models using OpenAI and Gemini.",
    scheduledAt: new Date("2026-06-15T14:00:00.000Z"), // Monday, June 15, 2026
    price: 199,
    joinLink: "https://meet.google.com/master-june-15",
    recordingLink: "",
    createdAt: new Date()
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB.");
    const db = client.db();

    // 1. Seed Batches
    console.log("Clearing batches collection...");
    await db.collection("batches").deleteMany({});
    console.log("Seeding batches...");
    await db.collection("batches").insertMany(batches);
    console.log(`Seeded ${batches.length} batches!`);

    // 2. Seed Lectures
    console.log("Clearing lectures collection...");
    await db.collection("lectures").deleteMany({});
    console.log("Seeding lectures...");
    await db.collection("lectures").insertMany(lectures);
    console.log(`Seeded ${lectures.length} lectures for Full Stack Development batch!`);

    // 3. Seed Masterclasses
    console.log("Clearing masterclasses collection...");
    await db.collection("masterclasses").deleteMany({});
    console.log("Seeding masterclasses...");
    await db.collection("masterclasses").insertMany(masterclasses);
    console.log(`Seeded ${masterclasses.length} Sunday/Monday Masterclasses!`);

    console.log("\n=============================================");
    console.log("🚀 DATABASE SUCCESSFULLY SEEDED!");
    console.log("=============================================");
    console.log("Seeded long-term active batches:");
    console.log("- Full Stack Development (fees: ₹8000, 12 Lectures)");
    console.log("- Data Structures & Algorithms (fees: ₹3000)");
    console.log("\nSeeded masterclasses for the next 3 Mondays:");
    masterclasses.forEach((m, idx) => {
      console.log(`${idx + 1}. ${m.topic} (${m.scheduledAt.toLocaleDateString("en-IN")})`);
    });
    console.log("=============================================");

  } catch (error) {
    console.error("An error occurred during database seeding:", error);
  } finally {
    await client.close();
  }
}

seed();
