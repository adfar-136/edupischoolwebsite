import { MongoClient } from "mongodb";
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

const QUESTIONS = [
  // --- DSA ---
  {
    topic: "DSA",
    difficulty: "Easy",
    question: "How do you detect a cycle in a singly linked list?",
    answer: "Detecting a cycle in a linked list is commonly solved using Floyd's Cycle-Finding Algorithm (often called the tortoise and hare algorithm). You initialize two pointers, slow and fast, at the head of the list. Move the slow pointer by 1 step and the fast pointer by 2 steps at each iteration. If there is a cycle, the fast pointer will eventually catch up and meet the slow pointer (slow === fast). If fast reaches null or fast.next reaches null, there is no cycle in the list. Time complexity: O(N), Space complexity: O(1)."
  },
  {
    topic: "DSA",
    difficulty: "Easy",
    question: "What is the structural difference between an Array and a LinkedList?",
    answer: "1. Memory Allocation: Arrays are stored in contiguous memory locations, whereas LinkedList elements (nodes) are scattered in memory, with each node pointing to the next using pointers.\n2. Access Time: Arrays support O(1) random access via indexes. LinkedLists require sequential traversal, resulting in O(N) access time.\n3. Insertion/Deletion: Inserting/deleting in an array is costly (O(N)) due to element shifting. In a LinkedList, it is highly efficient (O(1)) if the insertion point is known, as it only requires updating pointer references.\n4. Size: Arrays have static/fixed sizing (unless dynamic arrays like ArrayList are used), while LinkedLists are dynamically sized."
  },
  {
    topic: "DSA",
    difficulty: "Medium",
    question: "How does Binary Search work and what are its constraints and time complexities?",
    answer: "Binary Search is an efficient interval-searching algorithm. \n1. Constraint: The input array MUST be sorted.\n2. Mechanism: It works by repeatedly dividing the search space in half. Compare the target element with the middle element. If they are equal, return the index. If the target is smaller, search the left half; if larger, search the right half. Repeat until target is found or search space is exhausted.\n3. Time Complexity: O(log N) in both average and worst cases because the size of the search array is cut in half at each step. Best case is O(1) if the middle element is the target on the first step.\n4. Space Complexity: O(1) for iterative implementations, O(log N) for recursive due to stack space."
  },
  {
    topic: "DSA",
    difficulty: "Medium",
    question: "Explain the difference between Breadth-First Search (BFS) and Depth-First Search (DFS) on graphs.",
    answer: "BFS and DFS are tree/graph traversal algorithms:\n1. BFS (Breadth-First Search): Explores neighbors level-by-level before moving deeper. It uses a Queue (FIFO) data structure. It is optimal for finding the shortest path on unweighted graphs. Time: O(V + E), Space: O(V) to store nodes in queue.\n2. DFS (Depth-First Search): Explores as deep as possible down a path before backtracking. It uses a Stack (LIFO) or Recursion. It is useful for topological sorting, detecting cycles, and pathfinding. Time: O(V + E), Space: O(V) in the worst case for recursion stack."
  },
  {
    topic: "DSA",
    difficulty: "Medium",
    question: "What is a hash collision in a HashTable, and what are the standard ways to resolve it?",
    answer: "A hash collision occurs when two distinct keys produce the exact same index when passed through a hash function. Since index slots are unique, both cannot reside in the slot simultaneously. Standard resolution techniques include:\n1. Separate Chaining (Open Chaining): Each bucket at the hash index points to a linked list (or balanced binary tree) containing all key-value pairs that hash to that same index.\n2. Open Addressing (Closed Hashing): When a collision occurs, find another empty slot in the table using a probing sequence:\n   - Linear Probing: Look at index + 1, index + 2, and so on.\n   - Quadratic Probing: Look at index + 1^2, index + 2^2, etc.\n   - Double Hashing: Apply a second hash function to determine the step interval."
  },
  {
    topic: "DSA",
    difficulty: "Hard",
    question: "What is Dynamic Programming (DP) and how does Memoization differ from Tabulation?",
    answer: "Dynamic Programming is an algorithmic paradigm that solves complex problems by breaking them down into overlapping subproblems, solving each subproblem once, and storing their solutions to avoid redundant computations.\n1. Memoization (Top-Down): Start with the main problem and recursively break it down. Before calculating a subproblem, check a cache (hash map or array) to see if it was already solved. If yes, return the cached result. It is recursion-heavy.\n2. Tabulation (Bottom-Up): Solve all small subproblems first, filling a table or DP array iteratively, until the main problem is reached at the end. It is iteration-based and usually faster and more memory-efficient as it avoids call-stack overhead."
  },
  {
    topic: "DSA",
    difficulty: "Hard",
    question: "Explain Dijkstra's Shortest Path algorithm and its time complexity.",
    answer: "Dijkstra's algorithm finds the shortest path from a single source vertex to all other vertices in a weighted, directed or undirected graph with non-negative edge weights.\n1. Mechanism: Maintain a list of tentative distances, initialized to infinity for all vertices and 0 for the source vertex. Use a Min-Priority Queue to repeatedly select the vertex with the absolute smallest tentative distance. For the selected vertex, relax all its outgoing edges: if the distance to a neighbor through the selected vertex is smaller than its current tentative distance, update its distance and push it into the priority queue.\n2. Time Complexity: O((V + E) log V) using a binary heap, where V is vertices and E is edges."
  },

  // --- JavaScript ---
  {
    topic: "JavaScript",
    difficulty: "Easy",
    question: "What is the difference between 'let', 'const', and 'var' variables in JavaScript?",
    answer: "1. Scope: 'var' is function-scoped. If declared outside functions, it becomes global. 'let' and 'const' are block-scoped (scoped strictly within curly braces {}).\n2. Hoisting: All three are hoisted, but 'var' is initialized with 'undefined', allowing access before declaration. 'let' and 'const' are hoisted into the Temporal Dead Zone (TDZ) and will throw a ReferenceError if accessed before their declaration lines.\n3. Re-assignment: 'var' and 'let' values can be reassigned freely. 'const' variables cannot be reassigned; they must be initialized at declaration and are read-only (though properties of const objects/arrays can be mutated)."
  },
  {
    topic: "JavaScript",
    difficulty: "Easy",
    question: "What is the difference between the '==' and '===' comparison operators?",
    answer: "1. '==' (Loose Equality / Abstract Comparison): Compares two values for equality after performing Type Coercion. If the operands have different types, JavaScript will silently convert one or both to a common type before comparing (e.g., 5 == '5' returns true).\n2. '===' (Strict Equality): Compares both the value and the type of operands. No type coercion is performed. If the types are different, it immediately returns false (e.g., 5 === '5' returns false)."
  },
  {
    topic: "JavaScript",
    difficulty: "Medium",
    question: "What is a closure in JavaScript, and what is a practical use case for it?",
    answer: "A closure is a feature in JavaScript where an inner function retains access to variables from its outer (enclosing) function's scope, even after the outer function has finished executing.\nPractical Use Cases:\n1. Data Privacy / Private Variables: Standard OOP private fields can be mimicked by returning an object containing methods that access variables enclosed within an IIFE or constructor function.\n2. Function Factories: Creating functions tailored with specific configurations (e.g., a function `multiplier(factor)` that returns dynamic multiplier functions)."
  },
  {
    topic: "JavaScript",
    difficulty: "Medium",
    question: "Explain Hoisting in JavaScript and how it affects variables and functions.",
    answer: "Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during the compilation phase, before execution.\n1. Function Declarations: Are fully hoisted. You can call a function declaration before its code line (e.g., `greet(); function greet() {}` works perfectly).\n2. Var Variables: Only the declaration is hoisted, not the initialization. It is initialized to `undefined` (e.g., `console.log(x); var x = 5;` logs undefined).\n3. Let & Const: Are hoisted but NOT initialized. They enter the Temporal Dead Zone (TDZ). Accessing them before their declaration line throws a ReferenceError.\n4. Function Expressions: Are treated as variables and hoisted according to their let/const/var rules."
  },
  {
    topic: "JavaScript",
    difficulty: "Medium",
    question: "What is the difference between Promise.all(), Promise.allSettled(), and Promise.race()?",
    answer: "1. Promise.all(): Takes an array of promises and resolves when ALL promises resolve. If ANY promise rejects, it immediately rejects with that error, ignoring all other resolved promises (All-or-Nothing).\n2. Promise.allSettled(): Waits for all promises to finish (either resolve or reject) and returns an array of objects describing the outcome (status: 'fulfilled' or 'rejected') and values/reasons for each.\n3. Promise.race(): Returns a promise that resolves or rejects as soon as the first promise in the array settles (resolves or rejects), act as a speed race."
  },
  {
    topic: "JavaScript",
    difficulty: "Hard",
    question: "Explain the JavaScript Event Loop, Call Stack, Callback Queue, and Microtask Queue.",
    answer: "JavaScript is single-threaded and non-blocking, managed by the Event Loop:\n1. Call Stack: LIFO stack where execution contexts are pushed and popped as functions execute.\n2. Web APIs / Node C++ APIs: Asynchronous operations (setTimeout, fetch, file reads) run in the background outside the call stack.\n3. Callback Queue (Macrotask Queue): Queue for macrotasks (setTimeout, setInterval, user interactions).\n4. Microtask Queue: Queue for microtasks (Promise callbacks, process.nextTick, MutationObserver). It has absolute priority over the Macrotask Queue.\n5. Event Loop: Continuously checks if the Call Stack is empty. If it is, it empties the entire Microtask Queue, then picks one callback from the Callback Queue, pushes it to the Call Stack, and repeats."
  },
  {
    topic: "JavaScript",
    difficulty: "Hard",
    question: "What is prototypal inheritance and how does the prototype chain work?",
    answer: "In JavaScript, every object has an internal link to another object called its prototype (accessible via Object.getPrototypeOf(obj) or __proto__). \nPrototypal inheritance means objects can inherit properties and methods directly from other objects.\nPrototype Chain: When you access a property or call a method on an object, JavaScript checks if it exists directly on that object. If not found, it traverses up to the object's prototype, then that prototype's prototype, continuing up the chain until it finds the property or reaches `null` (usually `Object.prototype.__proto__ === null`). If null is reached without finding it, undefined is returned."
  },

  // --- React ---
  {
    topic: "React",
    difficulty: "Easy",
    question: "What is the Virtual DOM and how does React's Reconciliation work?",
    answer: "The Virtual DOM is a lightweight, in-memory representation of the real DOM elements in the browser as standard JavaScript objects. Reconciliation is the process through which React updates the real DOM:\n1. Render: When a component's state or props change, React builds a new Virtual DOM tree representing the updated UI.\n2. Diffing: React compares the new Virtual DOM tree with the previous one using a highly optimized heuristic algorithm (finding differences in O(N) complexity).\n3. Patching (Commit): React computes the minimum number of updates needed and patches only the changed elements in the real DOM, avoiding expensive layout reflows."
  },
  {
    topic: "React",
    difficulty: "Easy",
    question: "What are React Hooks and what are the primary rules governing them?",
    answer: "React Hooks are special built-in functions in React functional components that let you use state and other React features (like lifecycle hooks or context) without writing class components.\nRules of Hooks:\n1. Only Call Hooks at the Top Level: Do not call hooks inside loops, conditions, nested functions, or try/catch blocks. This ensures Hooks are called in the exact same order on every render.\n2. Only Call Hooks from React Functions: Call hooks only from React functional components or custom hooks, not standard JavaScript functions."
  },
  {
    topic: "React",
    difficulty: "Medium",
    question: "Explain the difference between useMemo and useCallback hooks in React.",
    answer: "Both useMemo and useCallback are optimization hooks used to prevent unnecessary re-renders, but they cache different things:\n1. useMemo: Caches the calculated RESULT of a function. It executes the function and memoizes the returned value, re-running it only when dependencies change. Useful for expensive computations.\n2. useCallback: Caches the FUNCTION INSTANCE itself. It returns the exact same function reference across renders, re-creating it only when dependencies change. Useful when passing callbacks to memoized child components (`React.memo`) to prevent them from re-rendering due to broken reference equality."
  },
  {
    topic: "React",
    difficulty: "Medium",
    question: "What is prop drilling and how does React Context API resolve this issue?",
    answer: "Prop drilling is the process of passing data (props) down through multiple levels of nested child components just to reach a deeply nested component that actually needs that data, even if intermediate components do not use it at all. It clutters the code and hurts reusability.\nReact Context API resolves this by providing a way to share values globally across the entire component tree. A `Context.Provider` wraps a parent component to hold the state, and any deeply nested child can consume the context using the `useContext(Context)` hook directly, bypassing intermediate components entirely."
  },
  {
    topic: "React",
    difficulty: "Medium",
    question: "Explain the component lifecycle in React functional components using the useEffect hook.",
    answer: "Functional components use the `useEffect` hook to handle side effects, mimicking class lifecycle methods:\n1. ComponentDidMount: Runs after the first render. Achieved by passing an empty dependency array: `useEffect(() => {}, [])`.\n2. ComponentDidUpdate: Runs after state or prop updates. Achieved by providing dependencies in the array: `useEffect(() => {}, [count])`.\n3. ComponentWillUnmount: Runs right before the component leaves the DOM. Achieved by returning a cleanup function inside the hook: `useEffect(() => { return () => { /* cleanup */ } }, [])`."
  },
  {
    topic: "React",
    difficulty: "Hard",
    question: "What is Concurrent Rendering in React 18 and how do startTransition and useTransition work?",
    answer: "Concurrent Rendering is a core architecture in React 18+ that allows React to pause, interrupt, and resume UI rendering tasks. It prevents the browser main thread from freezing during complex renders.\nTransitions are used to separate urgent updates from non-urgent updates:\n- Urgent Updates: Direct user interactions like typing in input fields, clicking toggles. Should trigger immediately.\n- Non-urgent/Transition Updates: Large data filtering, graph rendering, switching tabs.\n`useTransition` provides a `startTransition` wrapper to mark updates as transitions. React will render them in the background, allowing urgent updates (like input typing) to interrupt and pause the background transition render, keeping the input completely lag-free. It also provides an `isPending` state."
  },
  {
    topic: "React",
    difficulty: "Hard",
    question: "How does the React Fiber Architecture work under the hood?",
    answer: "React Fiber is a complete rewrite of React's core reconciliation algorithm introduced in React 16 to support incremental rendering. \n1. Problem with Stack Reconciler: Used synchronous recursion which blocked the main thread until the entire tree was updated, causing drop frames.\n2. Fiber Node: A linked-list node representing a component and its state. Fiber trees form a virtual call stack.\n3. Two Phases:\n   - Render Phase (Asynchronous): React builds a work-in-progress fiber tree. It can pause, yield, and split this phase into chunks of time using browser schedulers (requestIdleCallback). It computes changes without DOM side-effects.\n   - Commit Phase (Synchronous): React applies all calculated DOM updates in one single synchronous batch, making updates visual."
  },

  // --- Node.js ---
  {
    topic: "Node.js",
    difficulty: "Easy",
    question: "What is Node.js and why is it single-threaded?",
    answer: "Node.js is an open-source, cross-platform JavaScript runtime built on Chrome's V8 Engine that compiles JS to native machine code. \nNode.js is single-threaded in the sense that the JavaScript execution engine (V8) runs on a single main thread (Event Loop). It is single-threaded to eliminate the complexity of thread synchronization, locks, and context-switching overhead. However, Node.js is NOT fully single-threaded: underlying libraries like Libuv maintain a C++ Worker Pool (default 4 threads) to handle asynchronous, block-heavy operations like file systems (FS), crypto, DNS lookups, and network calls in the background."
  },
  {
    topic: "Node.js",
    difficulty: "Easy",
    question: "What is the difference between CommonJS (CJS) and ES Modules (ESM) in Node.js?",
    answer: "1. CommonJS (CJS): Uses `require()` to import and `module.exports` to export. CJS imports are synchronous and happen at runtime. It is the legacy standard in Node.js.\n2. ES Modules (ESM): Uses `import` and `export`. ESM imports are static, parsed at compile-time (allowing treeshaking optimization). It is the modern JavaScript standard.\n3. Compatibility: ESM cannot import CJS synchronously using static import, and CJS cannot import ESM directly without dynamic `import()`. Node.js enables CJS by default, and ESM via `\"type\": \"module\"` in package.json."
  },
  {
    topic: "Node.js",
    difficulty: "Medium",
    question: "Explain Node's non-blocking I/O model and how it handles asynchronous calls.",
    answer: "Node's non-blocking I/O model means that when an input/output operation (e.g. database query, network call, file system read) is initiated, Node.js offloads that task to the operating system or system kernel (via Libuv) and immediately returns to execute the next line of JavaScript instead of waiting for the results.\nWhen the background operation finishes, the kernel alerts Libuv, which pushes the registered callback function into the callback queue. The event loop then processes this callback when the call stack is clear, ensuring maximum throughput and high concurrency."
  },
  {
    topic: "Node.js",
    difficulty: "Medium",
    question: "What is the difference between process.nextTick() and setImmediate() in Node.js?",
    answer: "Both schedule callbacks to be executed asynchronously, but at different phases:\n1. process.nextTick(): Schedules a callback to be executed immediately after the current operation completes, BEFORE the event loop continues to the next phase or even processes microtasks. Excessive recursive use can block the event loop and starve I/O.\n2. setImmediate(): Schedules a callback to be executed in the 'Check' phase of the event loop, after I/O callbacks and timers have been processed. It yields to the event loop's natural cycle."
  },
  {
    topic: "Node.js",
    difficulty: "Medium",
    question: "What are Streams in Node.js and why are they extremely useful for large data operations?",
    answer: "Node.js Streams are collections of data—similar to arrays or strings—but instead of loading the entire dataset into RAM at once, streams read and write data in small, continuous chunks in sequence.\nWhy they are useful: \n1. Memory Efficiency: You can process files larger than the available physical RAM size (e.g., streaming a 10GB video file into a response without crashing Node).\n2. Time Efficiency: You can start processing or consuming data chunks as soon as they arrive, instead of waiting for the complete file to download or compile."
  },
  {
    topic: "Node.js",
    difficulty: "Hard",
    question: "Explain the various phases of the Libuv Event Loop in Node.js.",
    answer: "The event loop has six main phases executed in order repeatedly:\n1. Timers: Executes callbacks scheduled by setTimeout and setInterval.\n2. Pending Callbacks: Executes system I/O errors and TCP errors.\n3. Idle, Prepare: Used internally by Libuv.\n4. Poll: Retrieves new I/O events. Node will block here waiting for incoming connections or I/O completions if no other timers are pending.\n5. Check: Executes setImmediate() callbacks.\n6. Close Callbacks: Executes close event callbacks (like socket.on('close')).\nBetween each phase, Node checks and empties the Microtask Queue (promise callbacks) and nextTick queue."
  },
  {
    topic: "Node.js",
    difficulty: "Hard",
    question: "How does the Cluster Module in Node.js work, and what is its primary benefit?",
    answer: "Node.js runs on a single thread, which means it cannot naturally leverage multi-core processors on a server. The Cluster Module solves this by spawning child processes (workers) that run simultaneously, all sharing the same server port.\nPrimary Benefit: High Availability and Scalability.\nMechanism: The primary master process listens on the port and accepts incoming connections. It distributes these connections to worker processes using a round-robin algorithm. Each worker runs a separate instance of the V8 engine and event loop, allowing Node.js to handle multiple times the workload without CPU bottlenecks."
  },

  // --- MongoDB ---
  {
    topic: "MongoDB",
    difficulty: "Easy",
    question: "What is MongoDB and how does it structurally differ from SQL relational databases?",
    answer: "MongoDB is a document-oriented, NoSQL database that stores data in flexible, JSON-like BSON (Binary JSON) documents. \nStructural Differences:\n1. Documents vs Rows: MongoDB stores records as flexible documents; SQL stores records as rigid rows in tables.\n2. Schema Flexibility: MongoDB has a dynamic schema (different documents in the same collection can have different fields); SQL databases require fixed tables and migrations.\n3. Joins: MongoDB handles relationships via embedded documents (denormalization) or references, utilizing `$lookup` aggregation. SQL relies strictly on relational foreign key constraints and `JOIN` clauses."
  },
  {
    topic: "MongoDB",
    difficulty: "Easy",
    question: "What are indexes in MongoDB and how do they optimize query times?",
    answer: "Indexes are special data structures (B-Trees) that store a small portion of a collection's dataset in an easily traversable form. An index stores the value of a specific field or set of fields ordered by the value of the field.\nWithout Indexes: MongoDB must perform a 'Collection Scan' (scanning every single document in the collection) to satisfy a query, which is O(N) and highly resource-heavy.\nWith Indexes: MongoDB can look up the query target inside the index first, retrieving the matching document reference in O(log N) complexity, drastically lowering search times."
  },
  {
    topic: "MongoDB",
    difficulty: "Medium",
    question: "Explain the MongoDB Aggregation Pipeline and name three common stages.",
    answer: "The Aggregation Pipeline is a framework for multi-stage data processing and analysis. Documents enter a multi-stage pipeline that transforms them into an aggregated result, similar to an assembly line.\nCommon Stages:\n1. `$match`: Filters the documents to pass only those matching specified query conditions (equivalent to SQL WHERE).\n2. `$group`: Groups documents by a specified key and performs accumulator calculations (sum, avg, first) on grouped values (equivalent to SQL GROUP BY).\n3. `$project`: Reshapes documents by adding, renaming, or excluding specific fields (equivalent to SQL SELECT)."
  },
  {
    topic: "MongoDB",
    difficulty: "Medium",
    question: "What is the difference between Embedding (denormalization) and Referencing (normalization) in MongoDB schemas?",
    answer: "1. Embedding (Embedded Documents): Storing child documents directly inside the parent document as nested arrays/objects (e.g. storing comments directly inside a post document). Optimal for 1-to-few relationships and read-heavy operations, as it retrieves all data in a single, fast read.\n2. Referencing: Storing the ObjectId of the child document inside the parent document (e.g. storing a userId inside a post document). Optimal for 1-to-many or many-to-many relationships and write-heavy data, avoiding duplicate updates and document sizing limits (16MB)."
  },
  {
    topic: "MongoDB",
    difficulty: "Medium",
    question: "What is a Replica Set in MongoDB and how does it provide high availability?",
    answer: "A Replica Set is a group of mongodb processes that maintain the exact same data set. It consists of one Primary node and multiple Secondary nodes.\nHigh Availability Mechanism: \n- The primary node receives all write operations and logs them to the Oplog.\n- Secondary nodes asynchronously replicate the primary node's oplog and apply it to their local datasets.\n- If the primary node crashes, the secondary nodes automatically hold an election to elect a new primary node in seconds, ensuring zero downtime."
  },
  {
    topic: "MongoDB",
    difficulty: "Hard",
    question: "What is Sharding in MongoDB and how does it enable horizontal scaling?",
    answer: "Sharding is a method for distributing data across multiple physical machines to support extremely large datasets and high throughput operations.\nMechanism: \nMongoDB splits a collection's data into 'chunks' based on a specified 'Shard Key' and distributes these chunks across multiple database servers (shards). A query router (`mongos`) directs client operations to the correct shard containing the targeted data. This allows the database to scale past the storage and hardware limits of a single server (horizontal scaling) rather than upgrading CPU/RAM (vertical scaling)."
  },
  {
    topic: "MongoDB",
    difficulty: "Hard",
    question: "Explain ACID Transactions support in MongoDB and how they work.",
    answer: "MongoDB supports multi-document ACID (Atomicity, Consistency, Isolation, Durability) transactions since version 4.0 (for replica sets) and 4.2 (for sharded clusters).\nHow they work:\nUsing a Session, you start a transaction, execute multiple write/update queries across different collections, and then commit the transaction. All updates are isolated—no other client can see any changes until the commit completes. If any statement fails or an error is raised, you abort the transaction, rolling back all intermediate changes completely, ensuring database consistency."
  },

  // --- GenAI ---
  {
    topic: "GenAI",
    difficulty: "Easy",
    question: "What is a Large Language Model (LLM) and how does Prompt Engineering work?",
    answer: "A Large Language Model is a deep learning artificial intelligence model trained on massive amounts of text data to predict the next word or token in a sequence. It uses the Transformer architecture.\nPrompt Engineering is the practice of structured input design (prompts) to guide the LLM's response. By providing clear instructions, personas, formatting guidelines, and contextual limits, developers can guide the model's output to perform specific tasks (like coding, translation, summarizing) with high precision."
  },
  {
    topic: "GenAI",
    difficulty: "Easy",
    question: "What is the difference between Zero-Shot Prompting and Few-Shot Prompting?",
    answer: "1. Zero-Shot Prompting: Providing a prompt to the LLM that describes the task, but contains zero examples of the expected input/output. The model relies entirely on its pre-trained general knowledge (e.g. 'Classify this review: \"Loved it!\" -> Positive').\n2. Few-Shot Prompting: Providing the prompt along with a few explicit examples demonstrating the task and the desired output format (e.g. 'Review: \"Sucks\" -> Negative; Review: \"Ok\" -> Neutral; Review: \"Nice\" -> Positive'). Highly effective for complex tasks or strict styling structures."
  },
  {
    topic: "GenAI",
    difficulty: "Medium",
    question: "What is Retrieval-Augmented Generation (RAG) and why is it extremely useful?",
    answer: "Retrieval-Augmented Generation is a framework that improves LLM completions by pulling relevant information from an external database first, and appending it to the user's prompt as context before generating the response.\nWhy it is useful: \n1. Up-to-date Knowledge: Prevents the need to re-train or fine-tune models, letting them read real-time company databases.\n2. Accuracy: Drastically reduces hallucinations by forcing the LLM to ground its answer strictly inside the retrieved context document.\n3. Access Control: You can restrict what data is retrieved based on user permissions."
  },
  {
    topic: "GenAI",
    difficulty: "Medium",
    question: "Explain Vector Embeddings and Vector Databases (like Pinecone, Chroma).",
    answer: "1. Vector Embeddings: Are numerical representations of data (text, images, audio) as high-dimensional mathematical vectors. Words or concepts that are semantically similar are mapped to vectors that reside close to each other in vector space.\n2. Vector Databases: Are specialized databases built to store, index, and query vector embeddings efficiently. Instead of matching exact keyword strings, they perform mathematical calculations (cosine similarity, Euclidean distance) to retrieve semantic search results in milliseconds."
  },
  {
    topic: "GenAI",
    difficulty: "Medium",
    question: "What is LLM Hallucination and how can you minimize it in production?",
    answer: "LLM Hallucination is when an AI model generates highly confident responses that are factually incorrect, fabricated, or completely unrelated to real-world data.\nMinimization Techniques in Production:\n1. Prompt Engineering: Instruct the model to strictly state 'I do not know' if the answer is not present in the context.\n2. RAG (Retrieval-Augmented Generation): Supply factually verified documents in the prompt context.\n3. Temperature settings: Set `temperature` close to 0 to make the model deterministic rather than creative."
  },
  {
    topic: "GenAI",
    difficulty: "Hard",
    question: "Compare Fine-Tuning an LLM with utilizing Retrieval-Augmented Generation (RAG).",
    answer: "1. Fine-Tuning: Modifies the model's actual weight parameters by training it on a specific dataset. Ideal for adapting the model's tone, custom syntax, specialized coding patterns, or formatting styles. Costly, static, and prone to hallucinations on updated factual data.\n2. RAG: Keeps the model weights unchanged. It retrieves relevant text files from database indices and attaches them as prompt context. Ideal for supplying dynamic, real-time facts, secure company documentation, or fast-changing inventories. Cheap, verifiable, and updates instantly."
  },
  {
    topic: "GenAI",
    difficulty: "Hard",
    question: "What are AI Agents (Agentic Workflows) and how do they differ from simple LLM completions?",
    answer: "1. LLM Completions (Standard): Single-pass text production. The user sends a prompt, and the model generates a response in one go, without checking its work or correcting mistakes.\n2. AI Agents: Multi-step, iterative loops. An agent acts as a supervisor that has access to 'tools' (web search, calculator, shell scripts, database API) and can invoke them. It analyzes a goal, creates a plan, calls a tool to execute a step, reviews the tool's output, detects errors, refines its approach, and iterates until the target goal is fully resolved."
  },

  // --- HR ---
  {
    topic: "HR",
    difficulty: "Easy",
    question: "Walk me through your resume / Tell me about yourself.",
    answer: "This is the classic interview opener. Structure your answer using the 'Present-Past-Future' framework:\n1. Present: Highlight your current role or recent achievements (e.g. studying advanced engineering, focusing on Full Stack, DSA, or AI).\n2. Past: Briefly mention your background, key experiences, projects you have built, and technical milestones you achieved.\n3. Future: Explain why you are excited about this specific opportunity (e.g., joining EduPiSchool) and how it perfectly aligns with your career trajectory."
  },
  {
    topic: "HR",
    difficulty: "Easy",
    question: "Why do you want to join EduPiSchool?",
    answer: "Show that you have researched the company and align with its core values. Mention:\n1. Mission: The grassroots focus of bringing high-quality tech and computer skills to underserved students in regions like Kashmir.\n2. Quality of Learning: The calm, direct first-principles teaching style of Adfar Rasheed.\n3. Growth: Express excitement about being part of an independent education startup where your contributions directly impact student alumni."
  },
  {
    topic: "HR",
    difficulty: "Medium",
    question: "How do you handle disagreement with a technical decision made by your lead?",
    answer: "Focus on professional, ego-free collaboration. The standard structured response is:\n1. Objective Communication: Present your viewpoint clearly with logical arguments, diagrams, or benchmarks, without being personal.\n2. Listen & Understand: Listen to the lead's rationale—they may have additional business context, budget constraints, or legacy requirements.\n3. Disagree & Commit: If a decision is finalized, support it 100% to ensure team success, prioritizing delivery over individual technical opinions."
  },
  {
    topic: "HR",
    difficulty: "Medium",
    question: "Describe a situation where you had to work under a tight deadline and how you handled it.",
    answer: "Use the STAR (Situation, Task, Action, Result) method:\n1. Situation: Describe a high-priority feature or product launch with a tight schedule.\n2. Task: Explain your assignment.\n3. Action: Detail how you prioritized tasks, cut down non-critical specs (MVP focus), communicated updates transparently, and worked diligently to ship code.\n4. Result: Highlight that you met the deadline successfully with stable code, showing strong reliability under pressure."
  },
  {
    topic: "HR",
    difficulty: "Medium",
    question: "What is your greatest technical strength and your greatest technical weakness?",
    answer: "1. Strength: Focus on a core skill that makes you highly adaptable (e.g., 'First-principles problem solving. I don't just copy code; I go deep under the hood to understand memory, execution loops, and network limits').\n2. Weakness: Choose a real, constructive technical weakness and show how you are actively overcoming it (e.g., 'Premature optimization. I sometimes spend too much time over-engineering scale on early MVPs. To fix this, I now strictly deliver a simple working version first, gather benchmarks, and only optimize bottlenecks')."
  },
  {
    topic: "HR",
    difficulty: "Hard",
    question: "Describe a time when you made a severe technical mistake or shipped a bug in production. How did you handle it?",
    answer: "Focus on ownership and crisis management using the STAR framework:\n1. Ownership: Instantly take responsibility. Do not hide the issue or blame other variables.\n2. Crisis Control: Work with the team immediately to revert the release, patch the bug, or deploy hotfixes to minimize user impact.\n3. Root Cause Analysis: After resolution, hold a post-mortem to analyze *why* the bug escaped staging and establish automated tests/checklists to ensure it never happens again."
  },
  {
    topic: "HR",
    difficulty: "Hard",
    question: "Where do you see yourself in 5 years, and how does this role align with your long-term goals?",
    answer: "Show ambition coupled with execution:\n1. Technical Mastery: Express your goal to become a senior engineer, technical architect, or technical lead driving large scale features.\n2. Business Growth: Express excitement about seeing EduPiSchool scale, playing a key role in expanding cohorts, teaching pipelines, and technical systems.\n3. Alignment: Explain how the hands-on, end-to-end full stack environment here is the ultimate accelerator for your technical capabilities."
  },
  {
    topic: "Data Analytics",
    difficulty: "Easy",
    question: "What is a Pivot Table in Excel and what is its primary use case?",
    answer: "A Pivot Table is a powerful Excel feature used to summarize, sort, reorganize, group, count, total, or average data stored in a table or spreadsheet. It allows you to transform rows of detailed transactional data into clean, aggregated summary reports (e.g. total sales by region and product category) dynamically without writing complex formulas. It is highly interactive, enabling users to drag and drop fields to slice and dice information instantly."
  },
  {
    topic: "Data Analytics",
    difficulty: "Medium",
    question: "Explain the difference between a LEFT JOIN and an INNER JOIN in SQL, with a business example.",
    answer: "1. INNER JOIN: Returns only the rows where there is a match in both joined tables based on the join condition. If a key exists in one table but not the other, it is excluded from the results. E.g., joining an Orders table with a Customers table will list only orders placed by registered customers who exist in both tables.\n2. LEFT JOIN (or LEFT OUTER JOIN): Returns all rows from the left table, and the matched rows from the right table. If there is no match, the columns of the right table are filled with NULLs. E.g., left joining Customers with Orders will list all customers, including those who have never placed any orders (their order columns will show NULL), which is useful for identifying inactive clients."
  },
  {
    topic: "Data Analytics",
    difficulty: "Hard",
    question: "What are Window Functions in SQL and how do they differ from GROUP BY aggregations?",
    answer: "Window Functions perform calculations across a set of table rows that are somehow related to the current row, using the OVER() clause (e.g. ROW_NUMBER(), RANK(), SUM() OVER()).\nDifference from GROUP BY:\n- GROUP BY collapses multiple rows into a single summary row (losing access to individual row details).\n- Window Functions calculate an aggregate or ranking value for a set of rows but do NOT collapse the rows. Each individual row retains its separate identity, allowing you to display both the original detailed fields and the calculated aggregate side-by-side (e.g., displaying each transaction alongside the running total or regional average)."
  },
  {
    topic: "Data Science",
    difficulty: "Easy",
    question: "What is Exploratory Data Analysis (EDA) and why is it important?",
    answer: "Exploratory Data Analysis (EDA) is the crucial first step in any data science project. It involves analyzing and visualizing a dataset to understand its main characteristics, uncover patterns, detect anomalies, check assumptions, and identify relationships between variables before applying machine learning models. Standard tools include summary statistics, correlation heatmaps, box plots for outlier detection, and histograms for distributions. It is vital because training a model on uncleaned, biased, or misunderstood data leads to poor predictions (garbage in, garbage out)."
  },
  {
    topic: "Data Science",
    difficulty: "Medium",
    question: "Explain the difference between Overfitting and Underfitting in Machine Learning, and how to prevent them.",
    answer: "1. Overfitting: The model learns the training data *too* well, including its noise and random fluctuations. It performs exceptionally on training data but poorly on unseen test data (high variance, low bias). Prevention: Use regularization (L1/L2), simplify the model, get more training data, use dropout, or apply cross-validation.\n2. Underfitting: The model is too simple to capture the underlying pattern of the data (high bias, low variance). It performs poorly on both training and test data. Prevention: Increase model complexity, add more features, reduce regularization, or train for more epochs."
  },
  {
    topic: "Data Science",
    difficulty: "Hard",
    question: "How does the backpropagation algorithm work in training deep neural networks?",
    answer: "Backpropagation (backward propagation of errors) is the primary algorithm used to train neural networks by calculating the gradient of the loss function with respect to the network's weights.\nMechanism:\n1. Forward Pass: Input data propagates forward through the network layers to calculate the final prediction and compute the error (loss) against target values.\n2. Backward Pass: Using the Chain Rule of calculus, the algorithm calculates the partial derivatives of the loss function with respect to each weight, starting from the output layer and working backward through the hidden layers.\n3. Optimization: The calculated gradients are passed to an optimizer (like SGD or Adam) to update the weights in the direction that minimizes the loss (Gradient Descent)."
  },
  {
    topic: "Cyber Security",
    difficulty: "Easy",
    question: "What is the difference between Symmetric and Asymmetric cryptography?",
    answer: "1. Symmetric Cryptography: Uses the same single key for both encryption and decryption. Both sender and receiver must possess and keep this key secret. It is extremely fast and efficient for encrypting large volumes of data (e.g., AES). Key distribution is its primary challenge.\n2. Asymmetric Cryptography: Uses a mathematically related key pair: a Public Key (shared openly with anyone to encrypt messages) and a Private Key (kept secret by the owner to decrypt messages). It is slower but resolves the key exchange problem, making it ideal for secure handshakes and digital signatures (e.g., RSA, ECC)."
  },
  {
    topic: "Cyber Security",
    difficulty: "Medium",
    question: "What is Cross-Site Scripting (XSS) and how can developers mitigate it?",
    answer: "Cross-Site Scripting (XSS) is a vulnerability where an attacker injects malicious scripts (usually JavaScript) into a trusted website, which are then executed in the victim's browser.\nTypes: Stored (saved in DB), Reflected (passed in URLs), and DOM-based.\nMitigation Techniques:\n1. Context-Aware Output Encoding: Encode all user inputs before rendering them in the HTML body, attributes, JS, or CSS blocks (converting `<` to `&lt;`, etc.).\n2. Input Validation & Sanitization: Strictly validate input formats and use trusted libraries (like DOMPurify) to strip out script tags.\n3. Content Security Policy (CSP): Implement HTTP headers restricting where scripts can be loaded from and preventing inline script executions.\n4. Secure Cookies: Set the `HttpOnly` flag on session cookies so they cannot be accessed via client JS."
  },
  {
    topic: "Cyber Security",
    difficulty: "Hard",
    question: "Explain the concept of SQL Injection (SQLi) and how parameterized queries prevent it.",
    answer: "SQL Injection is a vulnerability where an attacker manipulates SQL queries by injecting malicious SQL statements into input fields, allowing them to bypass authentication, read, modify, or delete database records.\nParameterized Queries (Prepared Statements) prevent SQLi by separating the SQL code structure from the user data parameters:\n- Without Parameterization: User input is concatenated directly into the SQL string (e.g. `SELECT * FROM users WHERE name = '` + input + `'`). If `input` is `admin' OR '1'='1`, it alters the query logic.\n- With Parameterization: The database compiles the SQL query template first with placeholders (e.g., `SELECT * FROM users WHERE name = ?`). The user input is treated strictly as a literal value (a parameter) bound to the placeholder, never as executable SQL code, completely neutralizing any injected commands."
  }
];

async function main() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log("Clearing existing questions in the database...");
    await db.collection("questions").deleteMany({});
    
    console.log(`Inserting ${QUESTIONS.length} premium interview questions...`);
    const res = await db.collection("questions").insertMany(QUESTIONS);
    
    console.log("\n=============================================");
    console.log("🎉 DATABASE SUCCESSFULLY SEEDED!");
    console.log("=============================================");
    console.log(`Successfully seeded ${res.insertedCount} questions.`);
    console.log("Collection: questions");
    console.log("=============================================");
  } catch (error) {
    console.error("An error occurred during database seeding:", error);
  } finally {
    await client.close();
    console.log("Database connection closed.");
  }
}

main();
