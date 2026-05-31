// Static blog post data - no CMS, no database
// Add new posts here as objects in the array

export const blogPosts = [
  {
    slug: "why-learn-fsd-in-2025",
    title: "Why Full Stack Development is Still the Best Skill to Learn in 2025",
    excerpt:
      "With AI reshaping everything, some think coding is dying. I disagree — here's why Full Stack is more valuable than ever, especially if you're just starting out.",
    coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80",
    author: "Adfar Rasheed",
    date: "2025-05-15",
    readTime: "7 min read",
    category: "FSD",
    content: `
Full Stack Development isn't just about knowing React or Node.js. It's about having the **mental model** to build things end-to-end — from a database query all the way to what users see on their screen.

## Why 2025 is the best time to start

The tools have never been more powerful. With frameworks like Next.js, you can go from idea to deployed product in hours. AI assistants help you move faster. But here's the thing — **you still need to understand the fundamentals**.

## The Kashmir Advantage

Coming from Kashmir, we have something many tech hubs lack: hunger. We're not building careers for status — we're building futures. That drive is what separates average developers from great ones.

## What I teach at EdupiSchool

In our FSD batch, we don't just cover syntax. We build real projects from day one. We discuss architecture decisions, trade-offs, and how to think like a senior engineer — not just a tutorial follower.

If you're reading this and still on the fence, the best time to start was yesterday. The second best time is now.
    `.trim(),
  },
  {
    slug: "dsa-is-not-just-for-faang",
    title: "DSA Is Not Just for FAANG — Here's Why Every Developer Should Learn It",
    excerpt:
      "Most people think Data Structures & Algorithms are only for cracking Google interviews. After teaching hundreds of students, I can tell you that's a dangerous misconception.",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
    author: "Adfar Rasheed",
    date: "2025-06-01",
    readTime: "6 min read",
    category: "DSA",
    content: `
When I started teaching DSA, students would always ask: *"Do I really need this if I'm not applying to big companies?"*

The answer is yes. And here's why.

## Problem-solving is a universal skill

Whether you're writing a feature for a startup or optimizing a query in a legacy codebase, your ability to reason about complexity, loops, and data structures will determine how good your solution is.

## The mental model shift

DSA teaches you to think in **patterns**. Once you understand that many real-world problems are just variations of graph traversal, dynamic programming, or binary search, you start seeing elegant solutions where others see chaos.

## How I teach DSA differently

We don't memorize. We understand. Every topic begins with a real-world analogy — sliding window is like adjusting a physical window frame on your house. Graphs are like your WhatsApp contact network.

That's EdupiSchool's way.
    `.trim(),
  },
  {
    slug: "generative-ai-for-developers",
    title: "Generative AI in 2025: A Developer's Honest Guide",
    excerpt:
      "Everyone's talking about GenAI but most tutorials are surface-level hype. Here's what you actually need to know as a developer who wants to build with it.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    author: "Adfar Rasheed",
    date: "2025-06-20",
    readTime: "9 min read",
    category: "GenAI",
    content: `
Generative AI is not magic. It's math — specifically, it's the outcome of training enormous models on human-generated text and images. Understanding this demystifies it fast.

## What developers actually need to know

You don't need a PhD to build with AI. You need to understand:
- How to call APIs (OpenAI, Gemini, Anthropic)
- Prompt engineering fundamentals
- When to use RAG (Retrieval-Augmented Generation)
- How embeddings work at a conceptual level

## What I cover in the GenAI batch

We build real applications — not just ChatGPT wrappers. We build tools that solve actual problems: a study assistant, a code reviewer, a content summarizer for local language support.

## The opportunity for Kashmir

AI is the greatest equalizer in the history of tech. Someone in Srinagar can build the same AI product as someone in Silicon Valley — we just need the right skills and the right mentorship.

That's exactly what EdupiSchool exists to provide.
    `.trim(),
  },
  {
    slug: "from-kashmir-to-full-stack",
    title: "From Kashmir to Full Stack: My Story and Why I Started Teaching",
    excerpt:
      "A personal post about my journey from a small town in Kashmir to becoming a tech educator — and what EdupiSchool means to me.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    author: "Adfar Rasheed",
    date: "2025-04-10",
    readTime: "5 min read",
    category: "Personal",
    content: `
I didn't grow up with access to the best resources. Internet was inconsistent, tech communities were non-existent, and most of my learning happened through sheer determination and late-night YouTube marathons.

## Why I started EdupiSchool

After spending years working in tech and mentoring students informally, I realized there was a massive gap: **quality tech education in Urdu and English, designed for students from Kashmir and similar regions.**

Not just content — but mentorship. Community. Accountability. The things that actual university programs offer but most online courses completely miss.

## What I want EdupiSchool to be

I want a student from Anantnag or Baramulla to have access to the same quality of instruction as someone in Bangalore or Hyderabad. I want them to walk into interviews confident, build startups, and represent Kashmir in global tech.

That's the mission. That's why I teach.
    `.trim(),
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}
