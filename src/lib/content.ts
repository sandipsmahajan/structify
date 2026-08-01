import type { BlogPost, Course, Lesson, PracticeProblem } from "./types";

const binarySearchCode = {
  Java: `int search(int[] nums, int target) {\n  int left = 0, right = nums.length - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (nums[mid] == target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
  Python: `def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`,
  "C++": `int search(vector<int>& nums, int target) {\n  int left = 0, right = nums.size() - 1;\n  while (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (nums[mid] == target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
  JavaScript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
  Go: `func search(nums []int, target int) int {\n  left, right := 0, len(nums)-1\n  for left <= right {\n    mid := left + (right-left)/2\n    if nums[mid] == target { return mid }\n    if nums[mid] < target { left = mid + 1 } else { right = mid - 1 }\n  }\n  return -1\n}`
};

export const roadmap: Course[] = [
  { id: "foundation", title: "Foundation", level: "Foundation", status: "completed", progress: 100, prerequisites: [], lessons: ["programming-basics"] },
  { id: "complexity", title: "Complexity Analysis", level: "Foundation", status: "available", progress: 62, prerequisites: ["foundation"], lessons: ["big-o-analysis"] },
  { id: "arrays", title: "Arrays", level: "Core", status: "available", progress: 44, prerequisites: ["complexity"], lessons: ["binary-search"] },
  { id: "strings", title: "Strings", level: "Core", status: "available", progress: 18, prerequisites: ["arrays"], lessons: ["sliding-window"] },
  { id: "linked-list", title: "Linked List", level: "Core", status: "locked", progress: 0, prerequisites: ["strings"], lessons: [] },
  { id: "stack", title: "Stack", level: "Core", status: "locked", progress: 0, prerequisites: ["linked-list"], lessons: [] },
  { id: "queue", title: "Queue", level: "Core", status: "locked", progress: 0, prerequisites: ["stack"], lessons: [] },
  { id: "hash-table", title: "Hash Table", level: "Core", status: "locked", progress: 0, prerequisites: ["queue"], lessons: [] },
  { id: "trees", title: "Trees", level: "Core", status: "locked", progress: 0, prerequisites: ["hash-table"], lessons: [] },
  { id: "graph", title: "Graph", level: "Advanced", status: "locked", progress: 0, prerequisites: ["trees"], lessons: [] },
  { id: "dp", title: "Dynamic Programming", level: "Advanced", status: "locked", progress: 0, prerequisites: ["graph"], lessons: [] },
  { id: "interview", title: "Interview Preparation", level: "Interview", status: "locked", progress: 0, prerequisites: ["dp"], lessons: [] }
];

export const lessons: Lesson[] = [
  {
    slug: "binary-search",
    title: "Binary Search",
    course: "Arrays",
    duration: "24 min",
    xp: 180,
    summary: "Find a value by repeatedly discarding half of a sorted search space.",
    prerequisites: ["Arrays", "Big O", "Comparison operators"],
    sections: {
      Introduction: ["Search sorted data by asking one question: is the target left, right, or here?", "Each step removes half the candidates."],
      Motivation: ["Linear search checks every item.", "Binary search uses order to make huge lists feel small."],
      "Real-world examples": ["Dictionary lookup", "Finding a timestamp in logs", "Choosing a price boundary", "Binary search on answer"],
      Visualization: ["The active range narrows after every comparison.", "The midpoint decides which side survives."],
      "Complexity Analysis": ["Best case: Big Omega(1).", "Worst and average case: Big O(log n).", "Space: Big Theta(1) iteratively."],
      "Interactive Playground": ["Change the target, insert sorted values, and step the timeline."],
      "Code Examples": ["Five language versions share the same invariant: target is inside [left, right] if it exists."],
      "Dry Run": ["Target 12 starts in the full array, then moves right after comparing with 8."],
      Quiz: ["Answer quick checks before unlocking practice."],
      "Practice Questions": ["Search Insert Position", "First Bad Version", "Find Minimum in Rotated Sorted Array"],
      "Interview Questions": ["How do you avoid midpoint overflow?", "When does binary search on answer apply?"],
      Summary: ["Binary search is a range-shrinking pattern for ordered decisions."],
      "Next Lesson": ["Move to sliding window after completing the quiz and one medium problem."]
    },
    examples: ["Dictionary", "Log search", "Feature rollout boundary"],
    visualization: [
      { id: "s1", label: "Start range", explanation: "The whole sorted array is possible.", activeIndexes: [0, 1, 2, 3, 4, 5, 6], values: [2, 4, 7, 8, 12, 19, 31], codeLine: 2 },
      { id: "s2", label: "Check middle", explanation: "Midpoint value 8 is smaller than 12, so the left half cannot contain the target.", activeIndexes: [3], values: [2, 4, 7, 8, 12, 19, 31], codeLine: 5 },
      { id: "s3", label: "Move right", explanation: "Left jumps to mid + 1, preserving the invariant.", activeIndexes: [4, 5, 6], values: [2, 4, 7, 8, 12, 19, 31], codeLine: 7 },
      { id: "s4", label: "Found", explanation: "Midpoint is 12, so return the index.", activeIndexes: [4], values: [2, 4, 7, 8, 12, 19, 31], codeLine: 4 }
    ],
    code: binarySearchCode,
    quiz: [
      { type: "MCQ", prompt: "What must be true before using standard binary search?", options: ["Data is sorted", "Data is unique", "Data is small", "Data is recursive"], answer: "Data is sorted" },
      { type: "True/False", prompt: "Iterative binary search uses constant extra space.", options: ["True", "False"], answer: "True" },
      { type: "Predict Output", prompt: "Searching 12 in [2,4,7,8,12,19,31] returns what index?", options: ["3", "4", "5", "-1"], answer: "4" }
    ],
    practice: [
      { title: "Search Insert Position", difficulty: "Easy", pattern: "Binary Search", company: "Google", acceptance: 72 },
      { title: "Find First and Last Position", difficulty: "Medium", pattern: "Boundary Search", company: "Meta", acceptance: 46 },
      { title: "Median of Two Sorted Arrays", difficulty: "Hard", pattern: "Partition Search", company: "Apple", acceptance: 38 }
    ],
    interview: ["Explain left <= right vs left < right.", "Design a binary search for the first true predicate.", "Debug an infinite loop caused by bad boundary movement."],
    nextLesson: "sliding-window"
  }
];

export const practiceProblems: PracticeProblem[] = [
  ...lessons[0].practice,
  { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", pattern: "Sliding Window", company: "Amazon", acceptance: 35 },
  { title: "Course Schedule", difficulty: "Medium", pattern: "Topological Sort", company: "Netflix", acceptance: 48 },
  { title: "Minimum Window Substring", difficulty: "Hard", pattern: "Hash + Window", company: "Uber", acceptance: 42 }
];

export const blogPosts: BlogPost[] = [
  { slug: "binary-search-patterns", title: "Binary Search Is a Predicate Engine", category: "Algorithm Guide", minutes: 7, excerpt: "Turn sorted arrays, answers, and boundaries into one mental model." },
  { slug: "dp-state-design", title: "Designing DP States Visually", category: "Dynamic Programming", minutes: 11, excerpt: "Build recurrence intuition with dependency maps and state reuse." },
  { slug: "interview-signals", title: "What Interviewers Look For", category: "Interview Experience", minutes: 6, excerpt: "Communicate invariants, tradeoffs, and tests under pressure." }
];

export const achievements = ["7 day streak", "Big O Explorer", "Binary Search Ready", "First Medium Solved", "Dry Run Master"];

export const adminEntities = [
  { name: "Courses", count: 18, status: "12 published" },
  { name: "Lessons", count: 142, status: "36 need review" },
  { name: "Animations", count: 89, status: "event driven" },
  { name: "Quizzes", count: 430, status: "96% pass data" },
  { name: "Problems", count: 620, status: "company tagged" },
  { name: "Certificates", count: 8, status: "3 active" }
];
