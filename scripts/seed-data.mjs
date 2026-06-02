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
    instructorName: "Adfar Rasheed",
    instructorTitle: "Founder & Lead Educator",
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
    instructorName: "Adfar Rasheed",
    instructorTitle: "Founder & Lead Educator",
    createdAt: new Date(),
  },
  {
    _id: new ObjectId("647712f20000000000000003"),
    title: "Data Analytics Specialization",
    slug: "data-analytics-specialization",
    category: "DataAnalytics",
    description: "Master Excel, SQL, Tableau, PowerBI, and Python for data analysis. Learn business translation and dashboards.",
    fees: 4000,
    duration: 4,
    startDate: new Date("2026-06-15T00:00:00.000Z"),
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    status: "active",
    instructorName: "Sarah Jenkins",
    instructorTitle: "Principal Analyst at Google",
    createdAt: new Date(),
  },
  {
    _id: new ObjectId("647712f20000000000000004"),
    title: "Machine Learning & Data Science",
    slug: "machine-learning-data-science",
    category: "DataScience",
    description: "Deep dive into statistical analysis, regression models, neural networks, and computer vision with PyTorch.",
    fees: 6000,
    duration: 6,
    startDate: new Date("2026-06-20T00:00:00.000Z"),
    thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80",
    status: "active",
    instructorName: "Dr. Alan Turing",
    instructorTitle: "AI Researcher & Lead Scientist",
    createdAt: new Date(),
  },
  {
    _id: new ObjectId("647712f20000000000000005"),
    title: "Advanced Cyber Security & SecOps",
    slug: "cyber-security-secops",
    category: "CyberSecurity",
    description: "Learn network defense, penetration testing, threat hunting, and cloud security architectures. 100% hands-on.",
    fees: 5000,
    duration: 5,
    startDate: new Date("2026-07-01T00:00:00.000Z"),
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    status: "active",
    instructorName: "Alex Stone",
    instructorTitle: "Certified Ethical Hacker & SecOps Lead",
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
    moduleName: "Web Development & JS Basics",
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
    moduleName: "Web Development & JS Basics",
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
    moduleName: "Web Development & JS Basics",
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
    moduleName: "Modern Frontend with React & Next.js",
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
    moduleName: "Modern Frontend with React & Next.js",
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
    moduleName: "Modern Frontend with React & Next.js",
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
    moduleName: "Modern Frontend with React & Next.js",
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
    moduleName: "Backend, REST APIs & Databases",
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
    moduleName: "Backend, REST APIs & Databases",
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
    moduleName: "Backend, REST APIs & Databases",
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
    moduleName: "Auth, Advanced Patterns & Cloud Deployment",
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
    moduleName: "Auth, Advanced Patterns & Cloud Deployment",
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
    instructorName: "Adfar Rasheed",
    instructorTitle: "Founder & Lead Educator",
    createdAt: new Date()
  },
  {
    topic: "Cracking Full Stack Engineering Interviews in 2026",
    description: "Reviewing exact system architecture, REST API design, schema query optimization, and real-world system questions asked in interviews.",
    scheduledAt: new Date("2026-06-08T14:00:00.000Z"), // Monday, June 8, 2026
    price: 199,
    joinLink: "https://meet.google.com/master-june-8",
    recordingLink: "",
    instructorName: "Adfar Rasheed",
    instructorTitle: "Founder & Lead Educator",
    createdAt: new Date()
  },
  {
    topic: "Building Generative AI Products from Scratch: APIs, Embeddings & RAG",
    description: "Practical engineering guide to LangChain agents, retrieval engines, prompt structure, and multimodal models using OpenAI and Gemini.",
    scheduledAt: new Date("2026-06-15T14:00:00.000Z"), // Monday, June 15, 2026
    price: 199,
    joinLink: "https://meet.google.com/master-june-15",
    recordingLink: "",
    instructorName: "Dr. Alan Turing",
    instructorTitle: "AI Researcher & Lead Scientist",
    createdAt: new Date()
  }
];

const seedInstructors = [
  {
    name: "Adfar Rasheed",
    title: "Founder & Lead Educator",
    bio: "Tech educator and Full Stack Developer who formerly trained over 50,000 students at PW Skills and College Wallah. Specializes in MERN stack, DSA, and Generative AI workflows.",
    image: "/adfar.jpg",
    github: "",
    linkedin: "https://www.linkedin.com/in/adfar-rasheed/",
    twitter: "",
    instagram: "https://www.instagram.com/adfarsirofficial",
    youtube: "https://www.youtube.com/@adfar-rasheed",
    createdAt: new Date(),
  },
  {
    name: "Sarah Jenkins",
    title: "Principal Analyst at Google",
    bio: "Data analytics expert with 10+ years of experience. Teaches SQL, Tableau, PowerBI, and data-driven business modeling for high-scale enterprise operations.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "",
    instagram: "",
    youtube: "",
    createdAt: new Date(),
  },
  {
    name: "Dr. Alan Turing",
    title: "AI Researcher & Lead Scientist",
    bio: "Specialist in machine learning models, statistical analysis, and deep neural network designs. Mentors students in python modeling and PyTorch aggregation architectures.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "",
    youtube: "",
    createdAt: new Date(),
  },
  {
    name: "Alex Stone",
    title: "Certified Ethical Hacker",
    bio: "Lead SecOps specialist specializing in threat hunting, network penetration testing, and security compliance. Passionate about bringing grassroots training to cybersecurity fields.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "",
    instagram: "",
    youtube: "",
    createdAt: new Date(),
  }
];

const seedTestimonials = [
  {
    name: "Bilal Ahmad",
    location: "Srinagar, Kashmir",
    text: "Adfar's teaching style is completely different. He doesn't just show code — he explains *why* you're writing it. My understanding of Full Stack jumped 10x in the first month.",
    avatar: "B",
    batch: "FSD Batch",
    rating: 5,
    status: "published",
    createdAt: new Date(),
  },
  {
    name: "Rukhsar Nazir",
    location: "Anantnag, Kashmir",
    text: "I had tried multiple online platforms before. Nothing clicked until I joined EdupiSchool. The Sunday sessions are genuinely the best 3 hours of my week.",
    avatar: "R",
    batch: "DSA Batch",
    rating: 5,
    status: "published",
    createdAt: new Date(),
  },
  {
    name: "Aaqib Hussain",
    location: "Baramulla, Kashmir",
    text: "The GenAI batch changed my perspective on what's possible. I've already built two side projects using AI APIs — things I couldn't have imagined six months ago.",
    avatar: "A",
    batch: "GenAI Batch",
    rating: 5,
    status: "published",
    createdAt: new Date(),
  },
  {
    name: "Nida Shah",
    location: "Sopore, Kashmir",
    text: "The community here is unlike anything else. Adfar is responsive, motivating, and genuinely cares about student progress. Not just a teacher — a mentor.",
    avatar: "N",
    batch: "FSD Batch",
    rating: 5,
    status: "published",
    createdAt: new Date(),
  }
];

const seedModules = [
  // Full Stack Development
  { name: "Web Development & JS Basics", batchId: fsdBatchId.toString(), createdAt: new Date() },
  { name: "Modern Frontend with React & Next.js", batchId: fsdBatchId.toString(), createdAt: new Date() },
  { name: "Backend, REST APIs & Databases", batchId: fsdBatchId.toString(), createdAt: new Date() },
  { name: "Auth, Advanced Patterns & Cloud Deployment", batchId: fsdBatchId.toString(), createdAt: new Date() },
  
  // Data Structures & Algorithms
  { name: "Arrays, Strings & Recursion", batchId: dsaBatchId.toString(), createdAt: new Date() },
  { name: "Linked Lists, Stacks & Queues", batchId: dsaBatchId.toString(), createdAt: new Date() },
  { name: "Trees & Graphs", batchId: dsaBatchId.toString(), createdAt: new Date() },
  { name: "Dynamic Programming & Greedy Algorithms", batchId: dsaBatchId.toString(), createdAt: new Date() },

  // Data Analytics Specialization
  { name: "Excel & SQL Fundamentals", batchId: "647712f20000000000000003", createdAt: new Date() },
  { name: "Advanced SQL & Database Management", batchId: "647712f20000000000000003", createdAt: new Date() },
  { name: "Tableau & PowerBI Dashboards", batchId: "647712f20000000000000003", createdAt: new Date() },
  { name: "Python for Data Analysis", batchId: "647712f20000000000000003", createdAt: new Date() },

  // Machine Learning & Data Science
  { name: "Python & Data Science Stack", batchId: "647712f20000000000000004", createdAt: new Date() },
  { name: "Statistical Analysis & Regression", batchId: "647712f20000000000000004", createdAt: new Date() },
  { name: "Supervised & Unsupervised ML", batchId: "647712f20000000000000004", createdAt: new Date() },
  { name: "Deep Learning & Computer Vision", batchId: "647712f20000000000000004", createdAt: new Date() },

  // Advanced Cyber Security & SecOps
  { name: "Network Security Fundamentals", batchId: "647712f20000000000000005", createdAt: new Date() },
  { name: "Penetration Testing & Hacking", batchId: "647712f20000000000000005", createdAt: new Date() },
  { name: "Threat Hunting & Incident Response", batchId: "647712f20000000000000005", createdAt: new Date() },
  { name: "Cloud & SecOps Architectures", batchId: "647712f20000000000000005", createdAt: new Date() }
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

    // 1.5. Seed Modules
    console.log("Clearing modules collection...");
    await db.collection("modules").deleteMany({});
    console.log("Seeding modules...");
    await db.collection("modules").insertMany(seedModules);
    console.log(`Seeded ${seedModules.length} modules!`);

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

    // 4. Seed Instructors
    console.log("Clearing instructors collection...");
    await db.collection("instructors").deleteMany({});
    console.log("Seeding instructors...");
    await db.collection("instructors").insertMany(seedInstructors);
    console.log(`Seeded ${seedInstructors.length} instructors!`);

    // 5. Seed Testimonials
    console.log("Clearing testimonials collection...");
    await db.collection("testimonials").deleteMany({});
    console.log("Seeding testimonials...");
    await db.collection("testimonials").insertMany(seedTestimonials);
    console.log(`Seeded ${seedTestimonials.length} testimonials!`);

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
    console.log(`\nInstructors seeded: ${seedInstructors.length}`);
    console.log(`Testimonials seeded: ${seedTestimonials.length}`);
    console.log("=============================================");

  } catch (error) {
    console.error("An error occurred during database seeding:", error);
  } finally {
    await client.close();
  }
}

seed();
