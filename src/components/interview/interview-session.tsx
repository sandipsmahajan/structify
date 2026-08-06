"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";

interface Hint {
  text: string;
}

interface InterviewProblem {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  examples: string[];
  hints: Hint[];
  solution: string;
}

const problems: InterviewProblem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: ["Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"],
    hints: [
      { text: "Think about using a hash map to store values you've already seen." },
      { text: "For each number, check if (target - current) exists in the hash map." },
      { text: "Store each number and its index in the map as you iterate. Return when you find the complement." },
    ],
    solution: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n}",
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.",
    examples: ["Input: s = \"()\"\nOutput: true", "Input: s = \"()[]{}\"\nOutput: true", "Input: s = \"(]\"\nOutput: false"],
    hints: [
      { text: "Consider using a stack data structure." },
      { text: "Push opening brackets onto the stack. When you see a closing bracket, check if it matches the top." },
      { text: "Use a map to pair closing brackets with their opening counterparts. Return true only if the stack is empty at the end." },
    ],
    solution: "function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (map[c]) {\n      if (stack.pop() !== map[c]) return false;\n    } else {\n      stack.push(c);\n    }\n  }\n  return stack.length === 0;\n}",
  },
  {
    id: 3,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    examples: ["Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]", "Input: list1 = [], list2 = []\nOutput: []"],
    hints: [
      { text: "Use a dummy node to simplify the merge logic." },
      { text: "Compare the heads of both lists and attach the smaller one to the result." },
      { text: "After one list is exhausted, attach the remaining nodes of the other list." },
    ],
    solution: "function mergeTwoLists(l1, l2) {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val < l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}",
  },
  {
    id: 4,
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array nums, find the subarray with the largest sum and return its sum.",
    examples: ["Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum 6."],
    hints: [
      { text: "This is a classic dynamic programming problem. Think about how you can reuse previous results." },
      { text: "At each position, you either extend the previous subarray or start fresh." },
      { text: "Kadane's algorithm: maxEndingHere = max(nums[i], maxEndingHere + nums[i]). Track the global max." },
    ],
    solution: "function maxSubArray(nums) {\n  let maxEndingHere = nums[0], maxSoFar = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n    maxSoFar = Math.max(maxSoFar, maxEndingHere);\n  }\n  return maxSoFar;\n}",
  },
  {
    id: 5,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: ["Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]"],
    hints: [
      { text: "Use BFS (breadth-first search) with a queue." },
      { text: "Process nodes level by level. Track the size of the queue at each level." },
      { text: "For each level, create an array of node values, then push their children to the queue." },
    ],
    solution: "function levelOrder(root) {\n  if (!root) return [];\n  const result = [], queue = [root];\n  while (queue.length) {\n    const level = [], size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}",
  },
  {
    id: 6,
    title: "LRU Cache",
    difficulty: "Medium",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class: LRUCache(capacity) initializes with positive capacity; get(key) returns the value if exists, else -1; put(key, value) updates or inserts; both in O(1).",
    examples: ["LRUCache lRUCache = new LRUCache(2); lRUCache.put(1, 1); lRUCache.put(2, 2); lRUCache.get(1); // 1\nlRUCache.put(3, 3); lRUCache.get(2); // -1"],
    hints: [
      { text: "You need O(1) for both get and put. Think hash map + doubly linked list." },
      { text: "The map gives O(1) lookup. The linked list maintains recency order." },
      { text: "On get/put, move the node to the front. When exceeding capacity, evict the tail." },
    ],
    solution: "class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n    this.head = {}; this.tail = {};\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n  _remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }\n  _add(node) { node.next = this.head.next; node.prev = this.head; this.head.next.prev = node; this.head.next = node; }\n  get(key) { if (!this.map.has(key)) return -1; const node = this.map.get(key); this._remove(node); this._add(node); return node.value; }\n  put(key, value) { if (this.map.has(key)) this._remove(this.map.get(key)); const node = { key, value }; this.map.set(key, node); this._add(node); if (this.map.size > this.capacity) { const lru = this.tail.prev; this._remove(lru); this.map.delete(lru.key); } }\n}",
  },
];

export function InterviewSession() {
  const [phase, setPhase] = useState<"select" | "interview" | "ended">("select");
  const [currentProblem, setCurrentProblem] = useState<InterviewProblem | null>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [showSolution, setShowSolution] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerActive = useRef(true);

  const startInterview = useCallback((problem: InterviewProblem) => {
    setCurrentProblem(problem);
    setPhase("interview");
    setHintsShown(0);
    setTimeLeft(45 * 60);
    setShowSolution(false);
    timerActive.current = true;
    intervalRef.current = setInterval(() => {
      if (!timerActive.current) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          timerActive.current = false;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const endInterview = useCallback(() => {
    timerActive.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPhase("ended");
    setShowSolution(true);
  }, []);

  const revealHint = useCallback(() => {
    setHintsShown((h) => Math.min(h + 1, currentProblem?.hints.length ?? 0));
  }, [currentProblem]);

  const giveUp = useCallback(() => {
    timerActive.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setShowSolution(true);
  }, []);

  const solved = useCallback(() => {
    timerActive.current = false;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setPhase("ended");
  }, []);

  useEffect(() => {
    return () => {
      timerActive.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timerPercent = timeLeft / (45 * 60);

  if (phase === "select") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="heading-display text-3xl mb-3">Mock Interview</h1>
          <p className="body-text text-sm max-w-lg mx-auto">
            Simulate a real technical interview. Choose a problem, start the 45-minute timer,
            and practice explaining your thought process. Hints unlock progressively.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {problems.map((p) => (
            <DiamondCard key={p.id} className="p-5 cursor-pointer hover:border-bd-border-active transition-colors" onClick={() => startInterview(p)}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="heading-section text-sm">{p.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  p.difficulty === "Easy" ? "bg-bd-emerald/20 text-bd-emerald" :
                  p.difficulty === "Medium" ? "bg-bd-gold/20 text-bd-gold" : "bg-bd-ruby/20 text-bd-ruby"
                }`}>{p.difficulty}</span>
              </div>
              <p className="text-xs text-bd-text-muted line-clamp-2">{p.description}</p>
            </DiamondCard>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "ended") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <DiamondCard glow className="p-8">
          <h2 className="heading-display text-2xl mb-2 text-bd-emerald">Session Complete</h2>
          <p className="body-text text-sm mb-8">
            {timeLeft > 0
              ? `You finished with ${formatTime(timeLeft)} remaining. Great work!`
              : "Time's up! Review the solution and try again."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <DiamondButton variant="primary" size="md" onClick={() => setPhase("select")}>
              Try Another Problem
            </DiamondButton>
            <DiamondButton variant="ghost" size="md" onClick={() => {
              if (currentProblem) startInterview(currentProblem);
            }}>
              Retry Same Problem
            </DiamondButton>
          </div>
        </DiamondCard>

        {showSolution && currentProblem && (
          <DiamondCard className="p-6 mt-6 text-left">
            <h3 className="heading-section text-sm mb-3 text-bd-gold">Solution</h3>
            <div className="code-block p-4 text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap font-mono text-bd-text-secondary">{currentProblem.solution}</pre>
            </div>
          </DiamondCard>
        )}
      </div>
    );
  }

  if (!currentProblem) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Timer bar */}
      <div className={`fixed top-0 left-0 right-0 h-1 z-50 ${timeLeft < 300 ? "bg-bd-ruby" : timeLeft < 900 ? "bg-bd-gold" : "bg-bd-cyan"}`}
        style={{ width: `${timerPercent * 100}%`, transition: "width 1s linear" }}
      />

      <DiamondCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="heading-display text-xl">{currentProblem.title}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTimer(!showTimer)} className="text-xs text-bd-text-muted hover:text-bd-text-secondary">
              {showTimer ? "Hide Timer" : "Show Timer"}
            </button>
            <span className={`font-mono text-lg font-bold tabular-nums ${
              timeLeft < 300 ? "text-bd-ruby" : timeLeft < 900 ? "text-bd-gold" : "text-bd-cyan"
            }`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <p className="text-sm text-bd-text-secondary mb-6">{currentProblem.description}</p>

        {currentProblem.examples.map((ex, i) => (
          <div key={i} className="code-block p-3 mb-3 text-xs font-mono text-bd-text-muted">
            {ex}
          </div>
        ))}

        {/* Hints */}
        <div className="space-y-3 mb-6">
          {currentProblem.hints.slice(0, hintsShown).map((hint, i) => (
            <DiamondCard key={i} className="p-3 bg-bd-gold/5 border-bd-gold/20">
              <div className="flex items-start gap-2">
                <span className="text-bd-gold text-xs font-bold shrink-0 mt-0.5">Hint {i + 1}</span>
                <p className="text-xs text-bd-text-secondary">{hint.text}</p>
              </div>
            </DiamondCard>
          ))}
          {hintsShown < currentProblem.hints.length && (
            <DiamondButton variant="ghost" size="sm" onClick={revealHint}>
              Reveal Hint {hintsShown + 1}
            </DiamondButton>
          )}
        </div>

        {showSolution && (
          <div className="mt-6">
            <h3 className="heading-section text-sm mb-3 text-bd-gold">Solution</h3>
            <div className="code-block p-4 text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap font-mono text-bd-text-secondary">{currentProblem.solution}</pre>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-bd-border/40">
          <DiamondButton variant="primary" size="md" onClick={solved}>
            I Solved It
          </DiamondButton>
          <DiamondButton variant="ghost" size="md" onClick={giveUp}>
            Give Up / See Solution
          </DiamondButton>
          <DiamondButton variant="ghost" size="md" onClick={endInterview}>
            End Session
          </DiamondButton>
        </div>
      </DiamondCard>

      {/* Interview Tips */}
      <DiamondCard className="p-5">
        <h3 className="heading-section text-sm mb-3 text-bd-violet">Interview Tips</h3>
        <ul className="space-y-2 text-xs text-bd-text-muted">
          <li className="flex items-start gap-2">
            <span className="text-bd-cyan mt-0.5 shrink-0">&diams;</span>
            <span>Explain your thought process out loud before writing code.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bd-cyan mt-0.5 shrink-0">&diams;</span>
            <span>Start with a brute-force approach, then optimize.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bd-cyan mt-0.5 shrink-0">&diams;</span>
            <span>Ask clarifying questions about input constraints and edge cases.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bd-cyan mt-0.5 shrink-0">&diams;</span>
            <span>Analyze time and space complexity after writing the solution.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-bd-cyan mt-0.5 shrink-0">&diams;</span>
            <span>Test your solution with example inputs, including edge cases.</span>
          </li>
        </ul>
      </DiamondCard>
    </div>
  );
}
