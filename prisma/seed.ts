import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log("Seeding database...");

  // ── Tier 0: Foundations ──
  const foundations = await prisma.course.create({
    data: {
      tier: 0,
      title: "Foundations",
      slug: "foundations",
      isPaid: false,
      order: 0,
      topics: {
        create: [
          {
            title: "Big-O Complexity",
            slug: "big-o-complexity",
            order: 0,
            visualizerType: "array",
            theoryContent: `# Big-O Notation

Big-O notation describes the **upper bound** of an algorithm's growth rate — how its runtime or space usage scales as the input size grows.

## Common Complexities

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Array index access |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Merge sort |
| O(n²) | Quadratic | Bubble sort |
| O(2ⁿ) | Exponential | Recursive Fibonacci |

## Key Insight

Drop constants and lower-order terms. Focus on how the algorithm **scales** as n → ∞.

## Omega (Ω) and Theta (Θ)

- **Ω (Omega):** Best-case lower bound
- **Θ (Theta):** Tight bound (both upper and lower)
- **O (Big-O):** Worst-case upper bound`,
          },
          {
            title: "Recursion & Call Stack",
            slug: "recursion-call-stack",
            order: 1,
            visualizerType: "array",
            theoryContent: `# Recursion

A function that calls itself with a smaller subproblem until reaching a **base case**.

## Structure

1. **Base case** — stops the recursion
2. **Recursive case** — calls itself with modified input

## Call Stack

Each recursive call pushes a new frame onto the call stack. When the base case is reached, frames pop off in LIFO order.

## Example: Factorial

\`\`\`
factorial(5)
  → 5 * factorial(4)
    → 4 * factorial(3)
      → 3 * factorial(2)
        → 2 * factorial(1)
          → 1 (base case)
\`\`\`

## Common Pitfalls

- Missing base case → stack overflow
- Redundant subproblems → exponential runtime
- Too deep recursion → hit recursion limit`,
          },
          {
            title: "Bit Manipulation",
            slug: "bit-manipulation",
            order: 2,
            visualizerType: "array",
            theoryContent: `# Bit Manipulation

Direct operations on binary representations of integers.

## Core Operators

| Operator | Symbol | Effect |
|----------|--------|--------|
| AND | & | 1 if both bits are 1 |
| OR | \| | 1 if either bit is 1 |
| XOR | ^ | 1 if bits differ |
| NOT | ~ | Flips all bits |
| Left Shift | << | Multiply by 2^k |
| Right Shift | >> | Divide by 2^k (arithmetic) |

## Common Patterns

- **Set bit:** \`x | (1 << k)\`
- **Clear bit:** \`x & ~(1 << k)\`
- **Toggle bit:** \`x ^ (1 << k)\`
- **Check bit:** \`(x >> k) & 1\`
- **Is power of 2:** \`x > 0 && (x & (x - 1)) === 0\`

## XOR Trick

\`a ^ a = 0\` and \`a ^ 0 = a\`. Use XOR to find the single number in an array where every other number appears twice.`,
          },
          {
            title: "Modular Math",
            slug: "modular-math",
            order: 3,
            visualizerType: "array",
            theoryContent: `# Modular Arithmetic

Working with remainders. Essential for cryptography, hashing, and avoiding integer overflow.

## Properties

- **(a + b) % m = ((a % m) + (b % m)) % m**
- **(a * b) % m = ((a % m) * (b % m)) % m**
- **(a - b) % m = ((a % m) - (b % m) + m) % m**

## Fast Exponentiation

Compute \`a^b % m\` in O(log b) using binary exponentiation:

\`\`\`
function modPow(a, b, m):
  result = 1
  while b > 0:
    if b % 2 == 1:
      result = (result * a) % m
    a = (a * a) % m
    b = b >> 1
  return result
\`\`\`

## Modular Inverse

\`a^(-1) mod m\` exists iff gcd(a, m) = 1. Use Extended Euclidean Algorithm.`,
          },
          {
            title: "Memory Model",
            slug: "memory-model",
            order: 4,
            visualizerType: "array",
            theoryContent: `# Stack vs Heap

Understanding where your data lives is crucial for performance and avoiding bugs.

## Stack
- **Fixed size** per thread (typically 1-8 MB)
- Stores **local variables, function parameters, return addresses**
- **LIFO** allocation/deallocation
- **Fast access** (CPU cache-friendly)
- Automatically cleaned on function return

## Heap
- **Large, dynamic** pool managed by the runtime/OS
- Stores **objects, arrays, dynamically allocated data**
- **Manual or GC-based** deallocation
- **Slower access** (pointer indirection, possible cache misses)
- Fragmentation possible

## In Practice
- Primitives and references → **Stack**
- Object data → **Heap**
- Stack overflow → too many nested calls or large local arrays
- Memory leak → heap objects not freed`,
          },
        ],
      },
    },
  });

  // ── Tier 1: Linear Structures ──
  const linear = await prisma.course.create({
    data: {
      tier: 1,
      title: "Linear Structures",
      slug: "linear-structures",
      isPaid: false,
      order: 1,
      topics: {
        create: [
          {
            title: "Arrays & Strings",
            slug: "arrays-strings",
            order: 0,
            visualizerType: "array",
            theoryContent: `# Arrays & Strings

The most fundamental data structure — a contiguous block of memory storing elements of the same type.

## Key Properties
- **O(1)** access by index
- **O(n)** insertion/deletion (shifting)
- Fixed size (static) or resizable (dynamic)

## Essential Patterns

### Prefix Sums
Precompute cumulative sums: \`prefix[i] = sum of arr[0..i]\`
Then range sum query is O(1): \`sum[l..r] = prefix[r] - prefix[l-1]\`

### Sliding Window
Maintain a window of elements satisfying a condition. Expand right edge, shrink left edge. Used for:
- Maximum sum subarray of size k
- Longest substring without repeating characters
- Minimum window substring

### Two Pointers
Use two indices (often at ends or different speeds) to solve problems in O(n):
- Sorted array pair sum
- Remove duplicates in-place
- Container with most water`,
          },
          {
            title: "Linked Lists",
            slug: "linked-lists",
            order: 1,
            visualizerType: "linked-list",
            theoryContent: `# Linked Lists

A sequence of nodes where each node points to the next. Unlike arrays, elements are **not** contiguous in memory.

## Types
- **Singly Linked:** Each node has data + next pointer
- **Doubly Linked:** Each node has data + next + prev pointers
- **Circular:** Last node points back to the first

## Operations
| Operation | Singly | Doubly |
|-----------|--------|--------|
| Access by index | O(n) | O(n) |
| Insert at head | O(1) | O(1) |
| Insert at tail | O(n) or O(1)* | O(1)* |
| Delete at head | O(1) | O(1) |
| Delete at tail | O(n) | O(1)* |
| Search | O(n) | O(n) |

*With tail pointer

## Key Patterns
- Fast and slow pointers (cycle detection, middle element)
- Dummy head node simplifies edge cases
- Reverse in-place with three pointers`,
          },
          {
            title: "Stacks",
            slug: "stacks",
            order: 2,
            visualizerType: "array",
            theoryContent: `# Stacks

LIFO (Last In, First Out) data structure. Think of a stack of plates.

## Core Operations
- **push(x):** Add to top — O(1)
- **pop():** Remove from top — O(1)
- **peek():** View top without removing — O(1)
- **isEmpty():** Check if empty — O(1)

## Applications
- Function call stack
- Undo/redo in editors
- Balanced parentheses checking
- Expression evaluation (infix → postfix)
- Backtracking (DFS uses stack)

## Monotonic Stack

A stack that maintains elements in **increasing or decreasing order**. When a new element violates the order, pop until the order is restored.

### Next Greater Element
\`\`\`
for each element:
  while stack not empty and current > stack.top():
    popped = stack.pop()
    nextGreater[popped] = current
  stack.push(current)
\`\`\`

Trick: traverse from right to left, maintain decreasing stack.`,
          },
          {
            title: "Queues",
            slug: "queues",
            order: 3,
            visualizerType: "linked-list",
            theoryContent: `# Queues

FIFO (First In, First Out) data structure. Think of a line at a ticket counter.

## Core Operations
- **enqueue(x):** Add to rear — O(1)
- **dequeue():** Remove from front — O(1)
- **peek():** View front — O(1)
- **isEmpty():** Check if empty — O(1)

## Variants

### Circular Queue
Uses a fixed-size array with \`front\` and \`rear\` pointers wrapping around. Avoids O(n) shifting.

### Deque (Double-Ended Queue)
Insert/delete at both ends in O(1). Can function as both stack and queue.

### Priority Queue
Elements have priority; highest priority dequeued first. Typically implemented with a **heap** (covered in Tier 2).

## Applications
- BFS graph traversal
- Task scheduling
- Sliding window maximum (monotonic deque)
- CPU process scheduling`,
          },
          {
            title: "Hashing",
            slug: "hashing",
            order: 4,
            visualizerType: "array",
            theoryContent: `# Hashing

Map keys to values using a hash function for O(1) average lookup, insert, and delete.

## Hash Function
Converts a key into an integer index. Desired properties:
- **Deterministic:** same key → same index
- **Uniform distribution:** spreads keys evenly
- **Fast computation**

## Collision Resolution

### Chaining
Each bucket holds a linked list of collided entries.
- Simple to implement
- Degenerates to O(n) if many collisions
- Load factor = n / tableSize

### Open Addressing
All entries stored in the table itself. On collision, probe for next empty slot.
- **Linear probing:** check (i+1), (i+2), ...
- **Quadratic probing:** check (i+1²), (i+2²), ...
- **Double hashing:** use a second hash function for step size

## Common Patterns
- Frequency counting
- Two-sum (complement lookup)
- Anagram grouping
- Subarray sum equals k (prefix sum + hash map)`,
          },
        ],
      },
    },
  });

  console.log(`Created course: ${foundations.title} (${foundations.slug})`);
  console.log(`Created course: ${linear.title} (${linear.slug})`);

  // ── Tier 2: Non-Linear Structures (Paid) ──
  await prisma.course.create({
    data: {
      tier: 2, title: "Non-Linear Structures", slug: "non-linear-structures", isPaid: true, order: 2,
      topics: {
        create: [
          { title: "Binary Trees & BST", slug: "binary-trees-bst", order: 0, visualizerType: "bst", theoryContent: "# Binary Trees\n\nHierarchical data structure where each node has at most 2 children." },
          { title: "AVL & Red-Black Trees", slug: "avl-red-black", order: 1, visualizerType: "bst", theoryContent: "# Self-Balancing Trees\n\nAVL and Red-Black trees maintain O(log n) height through rotations." },
          { title: "Tries", slug: "tries", order: 2, visualizerType: "bst", theoryContent: "# Trie (Prefix Tree)\n\nEfficient retrieval tree for string keys. Each node represents a character." },
          { title: "Segment Trees", slug: "segment-trees", order: 3, visualizerType: "array", theoryContent: "# Segment Trees\n\nRange query data structure. O(log n) for point updates and range queries." },
          { title: "Fenwick Trees (BIT)", slug: "fenwick-trees", order: 4, visualizerType: "array", theoryContent: "# Fenwick Tree (Binary Indexed Tree)\n\nCompact range-sum query structure. Uses bit magic for O(log n)." },
          { title: "Heaps & Priority Queues", slug: "heaps-priority-queues", order: 5, visualizerType: "bst", theoryContent: "# Heaps\n\nComplete binary tree with heap property. Min-heap or max-heap." },
          { title: "Graphs: BFS & DFS", slug: "graphs-bfs-dfs", order: 6, visualizerType: "graph", theoryContent: "# Graph Traversal\n\nBFS uses queue, DFS uses stack/recursion. Both O(V+E)." },
          { title: "Union-Find", slug: "union-find", order: 7, visualizerType: "array", theoryContent: "# Union-Find (Disjoint Set)\n\nTrack connected components. Path compression + union by rank." },
        ],
      },
    },
  });

  // ── Tier 3: Algorithms & Patterns (Paid) ──
  await prisma.course.create({
    data: {
      tier: 3, title: "Algorithms & Patterns", slug: "algorithms-patterns", isPaid: true, order: 3,
      topics: {
        create: [
          { title: "Sorting Algorithms", slug: "sorting-algorithms", order: 0, visualizerType: "sorting", theoryContent: "# Sorting\n\nBubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix sort." },
          { title: "Searching Algorithms", slug: "searching-algorithms", order: 1, visualizerType: "array", theoryContent: "# Searching\n\nLinear, Binary, Ternary, Exponential search." },
          { title: "Graph Algorithms", slug: "graph-algorithms", order: 2, visualizerType: "graph", theoryContent: "# Graph Algorithms\n\nDijkstra, Bellman-Ford, Floyd-Warshall, Prim, Kruskal, A*." },
          { title: "Dynamic Programming", slug: "dynamic-programming", order: 3, visualizerType: "array", theoryContent: "# Dynamic Programming\n\n1D/2D DP, knapsack family, LIS/LCS, DP on trees." },
          { title: "Greedy Algorithms", slug: "greedy-algorithms", order: 4, visualizerType: "array", theoryContent: "# Greedy\n\nInterval scheduling, Huffman coding, fractional knapsack." },
          { title: "Backtracking", slug: "backtracking", order: 5, visualizerType: "bst", theoryContent: "# Backtracking\n\nN-Queens, Sudoku, subsets, permutations. Pruning the search tree." },
          { title: "String Algorithms", slug: "string-algorithms", order: 6, visualizerType: "array", theoryContent: "# String Algorithms\n\nKMP, Rabin-Karp, Z-algorithm, Manacher's algorithm." },
          { title: "Advanced Topics", slug: "advanced-topics", order: 7, visualizerType: "array", theoryContent: "# Advanced Topics\n\nBit DP, Sparse Tables, LCA, Network Flow." },
        ],
      },
    },
  });

  // ── Tier 4: Interview Systemization (Paid) ──
  await prisma.course.create({
    data: {
      tier: 4, title: "Interview Mastery", slug: "interview-mastery", isPaid: true, order: 4,
      topics: {
        create: [
          { title: "14 Core Patterns", slug: "core-patterns", order: 0, visualizerType: "array", theoryContent: "# 14 Core Interview Patterns\n\nSliding window, two pointers, fast/slow pointers, merge intervals, cyclic sort, in-place reversal, tree BFS/DFS, top-K, K-way merge, subsets, modified binary search, XOR, backtracking, DP, topological sort, monotonic stack." },
          { title: "Mock Interview Mode", slug: "mock-interview", order: 1, visualizerType: "array", theoryContent: "# Mock Interview Mode\n\nTimed sessions with progressively revealed hints." },
        ],
      },
    },
  });

  // ── Problems ──
  const problemData: { topicSlug: string; title: string; difficulty: string; leetcodeUrl?: string; hackerrankUrl?: string; neetcodeUrl?: string }[] = [
    // Tier 0
    { topicSlug: "big-o-complexity", title: "Two Sum", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/two-sum/", neetcodeUrl: "https://neetcode.io/problems/two-sum" },
    { topicSlug: "big-o-complexity", title: "Contains Duplicate", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/", neetcodeUrl: "https://neetcode.io/problems/contains-duplicate" },
    { topicSlug: "big-o-complexity", title: "First Bad Version", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/first-bad-version/" },
    { topicSlug: "recursion-call-stack", title: "Fibonacci Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/fibonacci-number/" },
    { topicSlug: "recursion-call-stack", title: "Climbing Stairs", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/", neetcodeUrl: "https://neetcode.io/problems/climbing-stairs" },
    { topicSlug: "bit-manipulation", title: "Single Number", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/single-number/", neetcodeUrl: "https://neetcode.io/problems/single-number" },
    { topicSlug: "bit-manipulation", title: "Number of 1 Bits", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/" },
    { topicSlug: "modular-math", title: "Pow(x, n)", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/powx-n/" },
    { topicSlug: "modular-math", title: "Add Strings", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/add-strings/" },
    { topicSlug: "memory-model", title: "Reverse Linked List", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/", neetcodeUrl: "https://neetcode.io/problems/reverse-linked-list" },
    // Tier 1
    { topicSlug: "arrays-strings", title: "Maximum Subarray", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/maximum-subarray/", neetcodeUrl: "https://neetcode.io/problems/maximum-subarray" },
    { topicSlug: "arrays-strings", title: "Product of Array Except Self", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/product-of-array-except-self/", neetcodeUrl: "https://neetcode.io/problems/product-of-array-except-self" },
    { topicSlug: "arrays-strings", title: "Valid Palindrome", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/", neetcodeUrl: "https://neetcode.io/problems/valid-palindrome" },
    { topicSlug: "arrays-strings", title: "3Sum", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/3sum/", neetcodeUrl: "https://neetcode.io/problems/3sum" },
    { topicSlug: "linked-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/", neetcodeUrl: "https://neetcode.io/problems/merge-two-sorted-lists" },
    { topicSlug: "linked-lists", title: "Linked List Cycle", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/", neetcodeUrl: "https://neetcode.io/problems/linked-list-cycle" },
    { topicSlug: "linked-lists", title: "Remove Nth Node From End", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
    { topicSlug: "stacks", title: "Valid Parentheses", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/", neetcodeUrl: "https://neetcode.io/problems/valid-parentheses" },
    { topicSlug: "stacks", title: "Min Stack", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/min-stack/", neetcodeUrl: "https://neetcode.io/problems/min-stack" },
    { topicSlug: "stacks", title: "Daily Temperatures", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/", neetcodeUrl: "https://neetcode.io/problems/daily-temperatures" },
    { topicSlug: "queues", title: "Implement Queue using Stacks", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/implement-queue-using-stacks/" },
    { topicSlug: "queues", title: "Sliding Window Maximum", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/sliding-window-maximum/", neetcodeUrl: "https://neetcode.io/problems/sliding-window-maximum" },
    { topicSlug: "hashing", title: "Group Anagrams", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/group-anagrams/", neetcodeUrl: "https://neetcode.io/problems/group-anagrams" },
    { topicSlug: "hashing", title: "Top K Frequent Elements", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/", neetcodeUrl: "https://neetcode.io/problems/top-k-frequent-elements" },
    { topicSlug: "hashing", title: "Subarray Sum Equals K", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/" },
    // Tier 2
    { topicSlug: "binary-trees-bst", title: "Lowest Common Ancestor", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", neetcodeUrl: "https://neetcode.io/problems/lowest-common-ancestor-of-a-bst" },
    { topicSlug: "binary-trees-bst", title: "Validate BST", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/", neetcodeUrl: "https://neetcode.io/problems/validate-bst" },
    { topicSlug: "tries", title: "Implement Trie", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/", neetcodeUrl: "https://neetcode.io/problems/implement-trie" },
    { topicSlug: "heaps-priority-queues", title: "Kth Largest Element", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/", neetcodeUrl: "https://neetcode.io/problems/kth-largest-element" },
    { topicSlug: "heaps-priority-queues", title: "Merge K Sorted Lists", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", neetcodeUrl: "https://neetcode.io/problems/merge-k-sorted-lists" },
    { topicSlug: "graphs-bfs-dfs", title: "Number of Islands", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/number-of-islands/", neetcodeUrl: "https://neetcode.io/problems/number-of-islands" },
    { topicSlug: "graphs-bfs-dfs", title: "Clone Graph", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/clone-graph/", neetcodeUrl: "https://neetcode.io/problems/clone-graph" },
    { topicSlug: "union-find", title: "Number of Connected Components", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", neetcodeUrl: "https://neetcode.io/problems/connected-components" },
    // Tier 3
    { topicSlug: "sorting-algorithms", title: "Sort an Array", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/sort-an-array/" },
    { topicSlug: "sorting-algorithms", title: "Sort Colors", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/sort-colors/" },
    { topicSlug: "graph-algorithms", title: "Network Delay Time", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/network-delay-time/", neetcodeUrl: "https://neetcode.io/problems/network-delay-time" },
    { topicSlug: "graph-algorithms", title: "Cheapest Flights Within K Stops", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", neetcodeUrl: "https://neetcode.io/problems/cheapest-flights" },
    { topicSlug: "dynamic-programming", title: "House Robber", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/house-robber/", neetcodeUrl: "https://neetcode.io/problems/house-robber" },
    { topicSlug: "dynamic-programming", title: "Longest Increasing Subsequence", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-increasing-subsequence/", neetcodeUrl: "https://neetcode.io/problems/longest-increasing-subsequence" },
    { topicSlug: "dynamic-programming", title: "Coin Change", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/coin-change/", neetcodeUrl: "https://neetcode.io/problems/coin-change" },
    { topicSlug: "backtracking", title: "N-Queens", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/n-queens/", neetcodeUrl: "https://neetcode.io/problems/n-queens" },
    { topicSlug: "backtracking", title: "Subsets", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/subsets/", neetcodeUrl: "https://neetcode.io/problems/subsets" },
    { topicSlug: "string-algorithms", title: "Find the Index of the First Occurrence", difficulty: "Easy", leetcodeUrl: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
    { topicSlug: "string-algorithms", title: "Longest Palindromic Substring", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/longest-palindromic-substring/", neetcodeUrl: "https://neetcode.io/problems/longest-palindromic-substring" },
    // Tier 4
    { topicSlug: "core-patterns", title: "Merge Intervals", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/merge-intervals/", neetcodeUrl: "https://neetcode.io/problems/merge-intervals" },
    { topicSlug: "core-patterns", title: "Find All Duplicates", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/find-all-duplicates-in-an-array/" },
    { topicSlug: "core-patterns", title: "Course Schedule", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/course-schedule/", neetcodeUrl: "https://neetcode.io/problems/course-schedule" },
    { topicSlug: "core-patterns", title: "Word Search", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/word-search/", neetcodeUrl: "https://neetcode.io/problems/word-search" },
    { topicSlug: "mock-interview", title: "LRU Cache", difficulty: "Medium", leetcodeUrl: "https://leetcode.com/problems/lru-cache/", neetcodeUrl: "https://neetcode.io/problems/lru-cache" },
    { topicSlug: "mock-interview", title: "Trapping Rain Water", difficulty: "Hard", leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/", neetcodeUrl: "https://neetcode.io/problems/trapping-rain-water" },
  ];

  const topicMap = new Map<string, string>();
  const allTopics = await prisma.topic.findMany({ select: { id: true, slug: true } });
  allTopics.forEach((t) => topicMap.set(t.slug, t.id));

  for (const p of problemData) {
    const topicId = topicMap.get(p.topicSlug);
    if (topicId) {
      await prisma.problem.create({
        data: {
          topicId,
          title: p.title,
          difficulty: p.difficulty,
          leetcodeUrl: p.leetcodeUrl,
          hackerrankUrl: p.hackerrankUrl,
          neetcodeUrl: p.neetcodeUrl,
        },
      });
    }
  }

  console.log(`Seeded ${problemData.length} problems across all topics`);
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
