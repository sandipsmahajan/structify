import type { BlogPost, CodeExamples, Course, Lesson, LessonSectionId, PracticeProblem, QuizQuestion, VisualizationEvent } from "./types";

type Topic = {
  title: string;
  kind: string;
  summary: string;
  realWorld: string;
  complexity: string;
  space: string;
  prerequisites?: string[];
};

type CurriculumSection = {
  id: string;
  title: string;
  level: Course["level"];
  topics: Topic[];
};

const sectionData: CurriculumSection[] = [
  {
    id: "programming-fundamentals",
    title: "Programming Fundamentals",
    level: "Foundation",
    topics: [
      topic("Language Selection", "foundation", "Choose a language for interviews, visualization, and implementation trade-offs.", "Selecting a tool for a job", "O(1) decision framework", "O(1)"),
      topic("Variables", "memory", "Store named values and watch how assignments change memory.", "Labeled boxes in a workshop", "O(1) access", "O(1) per variable"),
      topic("Data Types", "memory", "Understand numbers, strings, booleans, objects, and how representation affects memory.", "Choosing container sizes", "O(1) primitive operations", "Depends on representation"),
      topic("Control Structures", "flow", "Direct execution using conditionals and loops.", "Traffic lights and routing", "Depends on branch and loop count", "O(1)"),
      topic("Functions", "call-stack", "Package logic into reusable calls with inputs and return values.", "Kitchen stations in a restaurant", "O(body cost)", "O(call frame)"),
      topic("Memory", "memory", "See stack frames, heap allocations, variables, arrays, objects, and releases.", "A workspace with desks and storage rooms", "O(1) per allocation event", "Allocation dependent"),
      topic("References", "memory", "Use addresses to point one value or object name at shared data.", "A label pointing to a storage shelf", "O(1) dereference", "O(1) per reference"),
      topic("Pointers", "memory", "Represent direct memory links and understand null, aliasing, and ownership mistakes.", "Street addresses for houses", "O(1) dereference", "O(1) per pointer"),
      topic("Recursion Basics", "recursion", "Solve a problem by reducing it to a smaller version with a base case.", "Nested folders", "O(number of calls)", "O(recursion depth)"),
      topic("OOP Basics", "objects", "Model state and behavior using classes, objects, and interfaces.", "Blueprints and products", "Depends on method", "Object fields plus references"),
      topic("Pseudocode", "planning", "Write algorithm intent before language syntax.", "Architectural sketch", "O(steps described)", "O(state described)")
    ]
  },
  {
    id: "introduction",
    title: "Introduction",
    level: "Foundation",
    topics: [
      topic("What are Data Structures?", "concept", "Ways to organize data so operations become predictable.", "Shelves, queues, maps, and folders", "Operation dependent", "Storage dependent"),
      topic("Why Data Structures?", "concept", "Pick structures by access, insert, delete, search, and memory needs.", "Choosing a city transport system", "Trade-off dependent", "Trade-off dependent"),
      topic("Real-world Applications", "concept", "Map everyday systems to arrays, stacks, queues, trees, graphs, and hashes.", "Navigation, undo, file systems, caches", "System dependent", "System dependent")
    ]
  },
  {
    id: "algorithmic-complexity",
    title: "Algorithmic Complexity",
    level: "Foundation",
    topics: [
      topic("Time Complexity", "complexity", "Count how runtime grows as input size grows.", "Estimating delivery time by number of stops", "Growth function", "O(1)"),
      topic("Space Complexity", "space", "Track memory used by variables, call stacks, arrays, and auxiliary structures.", "Packing boxes for a move", "O(1) time to account per allocation", "Growth function"),
      topic("Best Case", "complexity", "Analyze the fastest valid input path.", "Finding keys in the first pocket", "Big Omega bound", "Algorithm dependent"),
      topic("Average Case", "complexity", "Estimate expected work across typical inputs.", "Average checkout wait", "Expected growth", "Algorithm dependent"),
      topic("Worst Case", "complexity", "Analyze the slowest valid input path.", "Last item in a warehouse", "Big O bound", "Algorithm dependent"),
      topic("Amortized Analysis", "complexity", "Spread occasional expensive operations over many cheap ones.", "Dynamic array resizing", "Average per operation", "Temporary auxiliary storage"),
      topic("How Complexity is Calculated", "derivation", "Derive complexity from loops, recursion, branching, and allocated memory.", "Counting work tickets", "Derived from operations", "Derived from allocations"),
      topic("Constant Complexity", "complexity", "Runtime stays flat as input grows.", "Reading the first element", "O(1)", "O(1)"),
      topic("Logarithmic Complexity", "complexity", "Each step divides the search space.", "Guessing a number by halving", "O(log n)", "O(1) iterative"),
      topic("Linear Complexity", "complexity", "Work grows directly with input size.", "Inspecting every book on a shelf", "O(n)", "O(1) to O(n)"),
      topic("Linearithmic Complexity", "complexity", "Logarithmic levels each process linear work.", "Merge sort levels", "O(n log n)", "Usually O(n)"),
      topic("Quadratic Complexity", "complexity", "Nested pairwise work grows as n times n.", "Everyone shaking hands", "O(n^2)", "O(1) to O(n^2)"),
      topic("Polynomial Complexity", "complexity", "Runtime grows by a fixed power of n.", "Checking triples or groups", "O(n^k)", "Problem dependent"),
      topic("Exponential Complexity", "complexity", "Choices double the search space repeatedly.", "All subsets", "O(2^n)", "O(n) to O(2^n)"),
      topic("Factorial Complexity", "complexity", "All permutations are considered.", "All seating arrangements", "O(n!)", "O(n) recursion depth")
    ]
  },
  {
    id: "asymptotic-notation",
    title: "Asymptotic Notation",
    level: "Foundation",
    topics: [
      topic("Big O", "notation", "Upper-bound how bad runtime can grow.", "Capacity planning for peak load", "Upper bound", "Usually unchanged"),
      topic("Big Theta", "notation", "Tight-bound growth from above and below.", "Expected staffing level", "Tight bound", "Usually unchanged"),
      topic("Big Omega", "notation", "Lower-bound the best guaranteed growth.", "Minimum time to scan required fields", "Lower bound", "Usually unchanged")
    ]
  },
  {
    id: "sorting",
    title: "Sorting",
    level: "Core",
    topics: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "Heap Sort", "Counting Sort", "Radix Sort", "Bucket Sort", "Shell Sort"].map((name) => sortingTopic(name))
  },
  {
    id: "searching",
    title: "Searching",
    level: "Core",
    topics: [
      topic("Linear Search", "search", "Scan each item until the target is found or input ends.", "Looking through cards one by one", "O(n)", "O(1)"),
      topic("Binary Search", "binary-search", "Repeatedly discard half of a sorted search space.", "Dictionary lookup", "O(log n)", "O(1) iterative"),
      topic("Jump Search", "search", "Jump by blocks, then linearly scan the candidate block.", "Skipping pages in a printed index", "O(sqrt n)", "O(1)"),
      topic("Interpolation Search", "search", "Estimate the likely position in uniformly distributed sorted data.", "Guessing shelf position by label range", "Average O(log log n), worst O(n)", "O(1)")
    ]
  },
  {
    id: "data-structures",
    title: "Data Structures",
    level: "Core",
    topics: [
      topic("Arrays", "array", "Contiguous indexed storage with fast access.", "Apartment mailboxes", "Access O(1), search O(n)", "O(n)"),
      topic("Strings", "string", "Sequential character data with pattern operations.", "Text editor buffer", "Access O(1), search varies", "O(n)"),
      topic("Linked Lists", "linked-list", "Nodes connected by references with cheap local insertions.", "Treasure map chain", "Search O(n), insert O(1) with node", "O(n)"),
      topic("Doubly Linked Lists", "linked-list", "Nodes point forward and backward for two-way traversal.", "Browser history", "Search O(n), delete O(1) with node", "O(n)"),
      topic("Circular Linked Lists", "linked-list", "The tail connects back to the head.", "Round-robin scheduler", "Traversal O(n)", "O(n)"),
      topic("Stack", "stack", "Last-in first-out structure for reversals and nested state.", "Undo and call stack", "Push/pop O(1)", "O(n)"),
      topic("Queue", "queue", "First-in first-out structure for fair processing.", "ATM, printer, restaurant line", "Enqueue/dequeue O(1)", "O(n)"),
      topic("Deque", "queue", "Insert and remove from both ends.", "Sliding window maximum", "End operations O(1)", "O(n)"),
      topic("Hash Table", "hash", "Map keys to buckets for expected constant lookup.", "Contact list by name", "Average O(1), worst O(n)", "O(n)")
    ]
  },
  {
    id: "trees",
    title: "Trees",
    level: "Core",
    topics: [
      topic("Binary Tree", "tree", "Hierarchical nodes with up to two children.", "Tournament bracket", "Traversal O(n)", "O(n)"),
      topic("Binary Search Tree", "bst", "Binary tree ordered so left values are smaller and right values larger.", "Sorted decision tree", "Average O(log n), worst O(n)", "O(n)"),
      topic("AVL Tree", "balanced-tree", "Self-balancing BST using rotations after inserts and deletes.", "Auto-balanced index", "O(log n)", "O(n)", ["binary-search-tree"]),
      topic("Red Black Tree", "balanced-tree", "Self-balancing BST using colors and rotations.", "Ordered map implementation", "O(log n)", "O(n)", ["binary-search-tree"]),
      topic("B Tree", "btree", "Multi-key balanced tree optimized for block storage.", "Database index pages", "O(log n)", "O(n)", ["binary-search-tree"]),
      topic("B+ Tree", "btree", "B tree variant with linked leaves for range scans.", "Database range index", "O(log n) plus range length", "O(n)", ["b-tree"]),
      topic("Heap", "heap", "Complete tree where parent priority dominates children.", "Priority queue triage", "Insert/delete O(log n), peek O(1)", "O(n)")
    ]
  },
  {
    id: "tree-traversals",
    title: "Tree Traversals",
    level: "Core",
    topics: ["Inorder", "Preorder", "Postorder", "Level Order"].map((name) => topic(name, "tree-traversal", `${name} traversal visits tree nodes in a deliberate order.`, "Folder tree inspection", "O(n)", "O(height) DFS or O(width) BFS", ["binary-tree"]))
  },
  {
    id: "graphs",
    title: "Graphs",
    level: "Advanced",
    topics: [
      topic("Directed Graph", "graph", "Edges have direction from one node to another.", "Task dependency map", "Traversal O(V + E)", "O(V + E)"),
      topic("Undirected Graph", "graph", "Edges connect nodes both ways.", "Friend network", "Traversal O(V + E)", "O(V + E)"),
      topic("Weighted Graph", "graph", "Edges carry costs such as distance, time, or risk.", "Road network", "Algorithm dependent", "O(V + E)")
    ]
  },
  {
    id: "graph-traversals",
    title: "Graph Traversals",
    level: "Advanced",
    topics: [
      topic("BFS", "graph-traversal", "Explore neighbors level by level using a queue.", "Shortest unweighted path", "O(V + E)", "O(V)", ["directed-graph"]),
      topic("DFS", "graph-traversal", "Explore deeply using recursion or a stack.", "Maze exploration", "O(V + E)", "O(V)", ["directed-graph"])
    ]
  },
  {
    id: "shortest-path",
    title: "Shortest Path",
    level: "Advanced",
    topics: [
      topic("Dijkstra", "shortest-path", "Find shortest paths when edges are non-negative.", "Navigation with no negative roads", "O((V + E) log V)", "O(V + E)", ["weighted-graph"]),
      topic("Bellman Ford", "shortest-path", "Handle negative edges and detect negative cycles.", "Currency exchange checks", "O(VE)", "O(V)", ["weighted-graph"]),
      topic("Floyd Warshall", "shortest-path", "Compute all-pairs shortest paths with dynamic programming.", "Distance table between every city", "O(V^3)", "O(V^2)", ["weighted-graph"]),
      topic("A*", "shortest-path", "Guide shortest path search with a heuristic.", "Map routing with straight-line estimate", "Heuristic dependent", "O(V)", ["dijkstra"])
    ]
  },
  {
    id: "minimum-spanning-tree",
    title: "Minimum Spanning Tree",
    level: "Advanced",
    topics: [
      topic("Prim", "mst", "Grow a cheapest connected tree from one component.", "Wiring buildings cheaply", "O(E log V)", "O(V + E)", ["weighted-graph"]),
      topic("Kruskal", "mst", "Sort edges and join components without cycles.", "Road network planning", "O(E log E)", "O(V)", ["disjoint-set"])
    ]
  },
  {
    id: "advanced-data-structures",
    title: "Advanced Data Structures",
    level: "Advanced",
    topics: [
      topic("Trie", "trie", "Store strings by shared prefixes.", "Autocomplete", "O(length)", "O(total characters)"),
      topic("Segment Tree", "range-tree", "Answer range queries and updates with a tree over intervals.", "Analytics over time windows", "O(log n) query/update", "O(n)"),
      topic("Fenwick Tree", "range-tree", "Compact prefix-sum structure with binary indexed jumps.", "Live leaderboard sums", "O(log n)", "O(n)"),
      topic("Disjoint Set", "union-find", "Track connected components with union and find.", "Network connectivity", "Almost O(1) amortized", "O(n)"),
      topic("Suffix Tree", "suffix", "Index all suffixes for fast string queries.", "Genome search", "O(m) query after build", "O(n)"),
      topic("Suffix Array", "suffix", "Sorted suffix index with lower memory than suffix trees.", "Full-text search", "O(m log n) query", "O(n)"),
      topic("Skip List", "skip-list", "Layered linked lists for probabilistic search.", "Express lanes over a list", "Expected O(log n)", "O(n)"),
      topic("ISAM", "index", "Static indexed sequential access method for disk records.", "Legacy database indexing", "O(log blocks)", "Index plus data blocks"),
      topic("2-3 Trees", "balanced-tree", "Balanced search tree with 2-node and 3-node branching.", "Balanced dictionary", "O(log n)", "O(n)")
    ]
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    level: "Advanced",
    topics: [
      topic("Brute Force", "pattern", "Try every valid candidate before optimizing.", "Testing every lock combination", "Usually exponential or polynomial", "Candidate dependent"),
      topic("Divide and Conquer", "pattern", "Split, solve smaller pieces, then combine.", "Organizing a team by subteams", "Often O(n log n)", "Recursion depth plus merge space"),
      topic("Greedy", "pattern", "Make the locally best choice when it preserves global optimality.", "Making change with canonical coins", "Often O(n log n)", "O(1) to O(n)"),
      topic("Recursion", "recursion", "Express repeated structure through smaller calls.", "Nested folders", "Call count dependent", "O(depth)", ["recursion-basics"]),
      topic("Backtracking", "backtracking", "Explore choices and undo invalid paths.", "Maze exploration with retreat", "Exponential worst case", "O(depth)", ["recursion"]),
      topic("Dynamic Programming", "dp", "Reuse overlapping subproblem results through memoization or tabulation.", "Caching repeated calculations", "State count times transition cost", "O(states)", ["recursion"]),
      topic("Sliding Window", "pattern", "Maintain a moving range to avoid recomputing contiguous work.", "Viewing a rolling time window", "O(n)", "O(1) to O(k)"),
      topic("Two Pointer", "pattern", "Move two indexes to compress search space.", "Meeting from both ends of a hallway", "O(n)", "O(1)"),
      topic("Fast & Slow Pointer", "pattern", "Use different speeds to detect cycles or midpoints.", "Two runners on a track", "O(n)", "O(1)"),
      topic("Merge Intervals", "pattern", "Sort intervals and combine overlaps.", "Calendar conflict cleanup", "O(n log n)", "O(n)"),
      topic("Cyclic Sort", "pattern", "Place values at their intended indexes when range is known.", "Numbered parking spaces", "O(n)", "O(1)"),
      topic("Two Heaps", "pattern", "Balance lower and upper halves for median-like queries.", "Median of a data stream", "O(log n)", "O(n)"),
      topic("Kth Element", "pattern", "Find rank using heaps, partitioning, or binary search.", "Selecting top candidates", "O(n) average quickselect", "O(1) to O(n)"),
      topic("Island Traversal", "pattern", "Explore connected regions in grids.", "Counting land masses on a map", "O(rows * cols)", "O(rows * cols)")
    ]
  },
  {
    id: "dynamic-programming-topics",
    title: "Dynamic Programming Topics",
    level: "Advanced",
    topics: ["Fibonacci DP", "0/1 Knapsack", "Coin Change", "Longest Common Subsequence", "Longest Increasing Subsequence", "Grid DP", "Interval DP", "Bitmask DP", "Tree DP"].map((name) => topic(name, "dp", `${name} teaches state design, transitions, base cases, and reconstruction.`, "Caching repeated decisions", "O(states * transitions)", "O(states)", ["dynamic-programming"]))
  },
  {
    id: "interview-preparation",
    title: "Interview Preparation",
    level: "Interview",
    topics: [
      topic("Blind 75", "interview", "Curated core problems across arrays, graphs, DP, trees, and intervals.", "Focused interview training plan", "Problem dependent", "Problem dependent", ["dynamic-programming"]),
      topic("NeetCode 150", "interview", "Expanded pattern-based interview curriculum.", "Long-form practice track", "Problem dependent", "Problem dependent", ["blind-75"]),
      topic("Company Wise Questions", "interview", "Practice by company patterns and recent interview emphasis.", "Targeted preparation", "Problem dependent", "Problem dependent", ["neetcode-150"])
    ]
  }
];

function topic(title: string, kind: string, summary: string, realWorld: string, complexity: string, space: string, prerequisites: string[] = []): Topic {
  return { title, kind, summary, realWorld, complexity, space, prerequisites };
}

function sortingTopic(title: string): Topic {
  const complexity = title === "Merge Sort" || title === "Heap Sort" ? "O(n log n)" : title === "Quick Sort" ? "Average O(n log n), worst O(n^2)" : title === "Counting Sort" || title === "Radix Sort" || title === "Bucket Sort" ? "O(n + k)" : "O(n^2)";
  return topic(title, "sorting", `${title} orders values by repeatedly comparing, moving, partitioning, distributing, or merging elements.`, "Sorting search results, leaderboards, and reports", complexity, title === "Merge Sort" ? "O(n)" : "O(1) to O(n)");
}

function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function codeFor(topicTitle: string): CodeExamples {
  const name = slugify(topicTitle).replace(/-/g, "_");
  return {
    Java: `void ${name}(int[] input) {\n  for (int step = 0; step < input.length; step++) {\n    // emit visualization event for this operation\n  }\n}`,
    Python: `def ${name}(input):\n    for step in range(len(input)):\n        # emit visualization event for this operation\n        pass`,
    "C++": `void ${name}(vector<int>& input) {\n  for (int step = 0; step < input.size(); step++) {\n    // emit visualization event for this operation\n  }\n}`,
    JavaScript: `function ${name}(input) {\n  for (let step = 0; step < input.length; step += 1) {\n    // emit visualization event for this operation\n  }\n}`,
    Go: `func ${name}(input []int) {\n  for step := 0; step < len(input); step++ {\n    // emit visualization event for this operation\n  }\n}`
  };
}

function eventsFor(topicTitle: string, kind: string): VisualizationEvent[] {
  if (kind === "binary-search" || topicTitle === "Logarithmic Complexity") {
    return [100, 50, 25, 12, 6, 3, 1].map((value, index) => ({ id: `search-${index}`, label: `${value} candidates`, explanation: `The search space shrinks to ${value} candidate${value === 1 ? "" : "s"}. This visualizes log2(n) halving.`, activeIndexes: [Math.min(index, 6)], values: [100, 50, 25, 12, 6, 3, 1], codeLine: index + 1, operationCount: index + 1, memoryUnits: 1 }));
  }
  if (kind === "recursion" || kind === "dp" || topicTitle.includes("Fibonacci")) {
    return [1, 2, 3, 5, 8, 13].map((value, index) => ({ id: `call-${index}`, label: `Call depth ${index + 1}`, explanation: kind === "dp" ? `State ${index + 1} is reused instead of recomputed, reducing repeated calls.` : `A new stack frame is created, then released when the base case returns.`, activeIndexes: [index], values: [1, 2, 3, 5, 8, 13], codeLine: index + 1, operationCount: Math.pow(2, Math.min(index, 5)), memoryUnits: index + 1 }));
  }
  if (kind === "sorting") {
    const frames = [[9, 4, 7, 2, 8, 1], [4, 9, 7, 2, 8, 1], [4, 7, 9, 2, 8, 1], [4, 7, 2, 9, 8, 1], [4, 7, 2, 8, 9, 1], [1, 2, 4, 7, 8, 9]];
    return frames.map((values, index) => ({ id: `sort-${index}`, label: index === frames.length - 1 ? "Sorted" : `Compare ${index + 1}`, explanation: `Compare highlighted bars, update the operation counter, and move values only when the invariant requires it.`, activeIndexes: [Math.min(index, 4), Math.min(index + 1, 5)], values, codeLine: index + 1, operationCount: index + 1, memoryUnits: topicTitle === "Merge Sort" ? values.length : 1 }));
  }
  if (kind.includes("graph") || kind === "shortest-path" || kind === "mst") {
    return [3, 5, 8, 13, 21].map((value, index) => ({ id: `graph-${index}`, label: `Visit node ${index + 1}`, explanation: `The frontier changes as nodes and edges are visited. Operation count tracks visited nodes and edge relaxations.`, activeIndexes: [index], values: [3, 5, 8, 13, 21], codeLine: index + 1, operationCount: value, memoryUnits: index + 2 }));
  }
  return [2, 4, 7, 8, 12, 19].map((value, index, values) => ({ id: `step-${index}`, label: `Step ${index + 1}`, explanation: `${topicTitle} updates data, operations, and memory state at this step.`, activeIndexes: [index], values, codeLine: index + 1, operationCount: index + 1, memoryUnits: Math.max(1, Math.ceil((index + 1) / 2)) }));
}

function quizFor(topicTitle: string, complexity: string): QuizQuestion[] {
  return [
    { type: "MCQ", prompt: `What is the main idea behind ${topicTitle}?`, options: ["Use the lesson invariant", "Ignore input size", "Always recurse", "Always sort first"], answer: "Use the lesson invariant" },
    { type: "True/False", prompt: `${topicTitle} should be analyzed with both time and space costs.`, options: ["True", "False"], answer: "True" },
    { type: "Predict Output", prompt: `Which complexity best matches this lesson?`, options: [complexity, "O(1) always", "O(n!) always", "No complexity"], answer: complexity }
  ];
}

const lessonOrder = sectionData.flatMap((section) => section.topics.map((item) => slugify(item.title)));

function lessonFor(section: CurriculumSection, item: Topic, index: number): Lesson {
  const slug = slugify(item.title);
  const nextLesson = lessonOrder[index + 1];
  const related = [...(item.prerequisites ?? []), nextLesson].filter(Boolean) as string[];
  const pseudo = [`prepare input for ${item.title}`, "emit an event before every meaningful operation", "update operation and memory counters", "preserve the lesson invariant", "return the final state"];
  const sections: Record<LessonSectionId, string[]> = {
    Overview: [`${item.title}: ${item.summary}`, "Interact with the animation first, then connect each step to code and complexity."],
    Motivation: [`Use ${item.title} when the problem shape matches its invariant or trade-off.`, "The goal is to reduce guesswork by making state changes visible."],
    "Problem Statement": [`Given input data, perform ${item.title} while preserving correctness after every operation.`, "Track operations, memory, and the reason each transition is valid."],
    "Real-world Example": [item.realWorld, `Map the real-world action to ${item.title} operations.`],
    "Interactive Visualization": [`The animation emits events for comparisons, moves, calls, visits, allocations, and releases.`, "Use play, pause, next, previous, and speed controls to inspect each state."],
    "Step-by-step Animation": [`Step through ${item.title} and watch active indexes, counters, and memory usage change.`, "Each step has a tutor explanation tied to the same event."],
    "Complexity Analysis": [`Time: ${item.complexity}.`, `Space: ${item.space}.`, "Best, average, worst, and amortized cases depend on the input shape and operation sequence."],
    "Dry Run": [`Run the sample input through ${item.title}.`, "Narrate the invariant before moving to the next event."],
    "Pseudo Code": pseudo,
    Java: [codeFor(item.title).Java],
    Python: [codeFor(item.title).Python],
    "C++": [codeFor(item.title)["C++"]],
    JavaScript: [codeFor(item.title).JavaScript],
    "Interactive Playground": ["Change input size, target values, and operation speed.", "Compare time counter and memory counter while the visualization runs."],
    Quiz: ["Complete the concept checks before the lesson counts as understood."],
    "Practice Problems": [`Easy: implement ${item.title} on a small input.`, `Medium: apply ${item.title} inside a pattern problem.`, `Hard: combine ${item.title} with another data structure or algorithm.`],
    "Interview Questions": [`When is ${item.title} the right tool?`, `What invariant proves ${item.title} is correct?`, `What is the main edge case for ${item.title}?`],
    "Common Mistakes": ["Skipping the invariant.", "Ignoring memory growth.", "Using average-case reasoning where worst-case is required.", "Moving pointers, indexes, or state without proving progress."],
    Summary: [`${item.title} is mastered when you can animate it, dry-run it, code it, and derive ${item.complexity}.`],
    "Related Lessons": related.length ? related : ["Roadmap review"]
  };
  return {
    slug,
    title: item.title,
    course: section.title,
    duration: section.level === "Foundation" ? "18 min" : section.level === "Core" ? "26 min" : "34 min",
    xp: section.level === "Foundation" ? 120 : section.level === "Core" ? 180 : 240,
    summary: item.summary,
    prerequisites: item.prerequisites?.length ? item.prerequisites : index === 0 ? [] : [lessonOrder[index - 1]],
    sections,
    examples: [item.realWorld, "Interview prompt", "Production system trade-off"],
    visualization: eventsFor(item.title, item.kind),
    code: codeFor(item.title),
    quiz: quizFor(item.title, item.complexity),
    practice: [
      { title: `${item.title} Warmup`, difficulty: "Easy", pattern: item.title, company: "Structify", acceptance: 78 },
      { title: `${item.title} Pattern Drill`, difficulty: "Medium", pattern: section.title, company: "Google", acceptance: 51 },
      { title: `${item.title} Interview Challenge`, difficulty: "Hard", pattern: item.kind, company: "Meta", acceptance: 34 }
    ],
    interview: sections["Interview Questions"],
    nextLesson,
    unlockRequirements: ["Watch animation", "Read explanation", "Complete quiz", "Solve coding problem"]
  };
}

export const lessons: Lesson[] = sectionData.flatMap((section) => section.topics).map((item, index) => {
  const section = sectionData.find((candidate) => candidate.topics.includes(item));
  return lessonFor(section as CurriculumSection, item, index);
});

export const roadmap: Course[] = sectionData.map((section, index) => ({
  id: section.id,
  title: section.title,
  level: section.level,
  status: index === 0 ? "completed" : index < 6 ? "available" : "locked",
  progress: index === 0 ? 100 : index < 6 ? Math.max(12, 76 - index * 11) : 0,
  prerequisites: index === 0 ? [] : [sectionData[index - 1].id],
  lessons: section.topics.map((item) => slugify(item.title))
}));

export const practiceProblems: PracticeProblem[] = lessons.flatMap((lesson) => lesson.practice).slice(0, 80);

export const blogPosts: BlogPost[] = [
  { slug: "complexity-derivation", title: "How Complexity Is Calculated Visually", category: "Big O Lab", minutes: 9, excerpt: "Loops, recursion trees, binary search, merge sort, Fibonacci, and memoization explained through counters." },
  { slug: "memory-model", title: "Stack, Heap, and Auxiliary Space", category: "Space Complexity", minutes: 8, excerpt: "Watch frames, arrays, objects, and releases to understand memory growth." },
  { slug: "dp-state-design", title: "Designing DP States Visually", category: "Dynamic Programming", minutes: 11, excerpt: "Build recurrence intuition with dependency maps and state reuse." },
  { slug: "interview-patterns", title: "Modern Interview Pattern Map", category: "Interview Preparation", minutes: 12, excerpt: "Connect Blind 75, NeetCode 150, sliding window, two heaps, islands, and DP patterns." }
];

export const achievements = ["7 day streak", "Big O Explorer", "Memory Visualizer", "Binary Search Ready", "DP State Designer", "Graph Pathfinder", "Interview Track Starter"];

export const adminEntities = [
  { name: "Courses", count: roadmap.length, status: "roadmap complete" },
  { name: "Lessons", count: lessons.length, status: "generated from curriculum config" },
  { name: "Animations", count: lessons.reduce((total, lesson) => total + lesson.visualization.length, 0), status: "event driven" },
  { name: "Quizzes", count: lessons.reduce((total, lesson) => total + lesson.quiz.length, 0), status: "unlock gated" },
  { name: "Problems", count: practiceProblems.length, status: "pattern tagged" },
  { name: "Certificates", count: 8, status: "course aligned" }
];

export const curriculumCoverage = sectionData.map((section) => ({
  title: section.title,
  lessons: section.topics.map((item) => item.title)
}));
