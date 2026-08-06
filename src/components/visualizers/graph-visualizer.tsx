"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SceneLayout } from "./shared/scene-layout";
import { DiamondCard } from "@/components/ui/diamond-card";
import { VisualizerControlsPanel } from "@/lib/visualizer-engine/controls";
import { CodeSyncPanel } from "@/lib/visualizer-engine/code-sync";
import { OperationCounter } from "@/lib/visualizer-engine/operation-counter";
import type { VisualizerControls } from "@/lib/visualizer-engine/types";
import { Line, Sphere, Text } from "@react-three/drei";
import * as d3 from "d3";

const PSEUDOCODE = [
  "queue = [start]",
  "visited.add(start)",
  "while queue not empty:",
  "  node = queue.dequeue()",
  "  for neighbor in graph[node]:",
  "    if neighbor not visited:",
  "      visited.add(neighbor)",
  "      queue.enqueue(neighbor)",
];

const NODE_COUNT = 8;
const NODE_VALUES = ["A", "B", "C", "D", "E", "F", "G", "H"];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [5, 7], [4, 6],
];

function GraphNode({ label, position, color, isHighlighted }: { label: string; position: [number, number, number]; color: string; isHighlighted: boolean }) {
  return (
    <group position={position}>
      <Sphere args={[0.35, 32, 32]}>
        <meshStandardMaterial
          color={isHighlighted ? "#FFFFFF" : color}
          emissive={color}
          emissiveIntensity={isHighlighted ? 1 : 0.3}
          metalness={0.2}
          roughness={0.4}
        />
      </Sphere>
      <Text position={[0, 0.55, 0]} fontSize={0.3} color="#E8ECF1" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

export function GraphVisualizer() {
  const [visitedNodes, setVisitedNodes] = useState<Set<number>>(new Set());
  const [currentNode, setCurrentNode] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nodePositions = useMemo(() => {
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => ({ id: i, x: 0, y: 0 }));
    const links = EDGES.map(([s, t]) => ({ source: s, target: t }));

    const sim = d3.forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(0, 0))
      .force("link", d3.forceLink(links).distance(2.5))
      .stop();

    for (let i = 0; i < 120; i++) sim.tick();

    return nodes.map((n: { id: number; x?: number; y?: number }) => [n.x ?? 0, n.y ?? 0, 0] as [number, number, number]);
  }, []);

  const bfsSteps = useMemo(() => {
    const steps: { visited: number[]; current: number }[] = [];
    const visited = new Set<number>();
    const queue: number[] = [0];
    visited.add(0);

    while (queue.length > 0) {
      const node = queue.shift()!;
      steps.push({ visited: [...visited], current: node });

      for (const [s, t] of EDGES) {
        if (s === node && !visited.has(t)) { visited.add(t); queue.push(t); }
        if (t === node && !visited.has(s)) { visited.add(s); queue.push(s); }
      }
    }
    return steps;
  }, []);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          const next = prev + 1;
          if (next >= bfsSteps.length) { setIsPlaying(false); return prev; }
          setVisitedNodes(new Set(bfsSteps[next].visited));
          setCurrentNode(bfsSteps[next].current);
          return next;
        });
      }, 1000 / speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, bfsSteps]);

  const controls: VisualizerControls = {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => {
      const next = Math.min(step + 1, bfsSteps.length - 1);
      setStep(next);
      setVisitedNodes(new Set(bfsSteps[next].visited));
      setCurrentNode(bfsSteps[next].current);
    },
    stepBack: () => {
      const prev = Math.max(step - 1, 0);
      setStep(prev);
      setVisitedNodes(new Set(bfsSteps[prev].visited));
      setCurrentNode(bfsSteps[prev].current);
    },
    reset: () => { setIsPlaying(false); setStep(0); setVisitedNodes(new Set()); setCurrentNode(-1); },
    setSpeed,
    setData: () => {},
  };

  const currentStepDesc = bfsSteps[step]
    ? `BFS visiting node ${NODE_VALUES[bfsSteps[step].current]}`
    : "Press play to begin BFS traversal";

  return (
    <div className="flex flex-col gap-4">
      <DiamondCard className="overflow-hidden p-0">
        <VisualizerControlsPanel controls={controls} isPlaying={isPlaying} speed={speed} currentStep={step} totalSteps={bfsSteps.length} />
        <div className="flex">
          <div className="flex-1 h-[450px]">
            <SceneLayout cameraPosition={[0, 0, 10]}>
              {EDGES.map(([s, t], i) => {
                const isActive = visitedNodes.has(s) && visitedNodes.has(t);
                return (
                  <Line
                    key={i}
                    points={[nodePositions[s], nodePositions[t]]}
                    color={isActive ? "#6FE3FF" : "#333548"}
                    lineWidth={isActive ? 2 : 1}
                    opacity={isActive ? 0.8 : 0.3}
                  />
                );
              })}
              {NODE_VALUES.map((label, i) => (
                <GraphNode
                  key={i}
                  label={label}
                  position={nodePositions[i]}
                  color={i === currentNode ? "#B98CFF" : visitedNodes.has(i) ? "#6FE3FF" : "#555A6A"}
                  isHighlighted={i === currentNode}
                />
              ))}
            </SceneLayout>
          </div>
          <CodeSyncPanel
            pseudocode={PSEUDOCODE}
            currentLine={step >= 0 && step < bfsSteps.length ? (step % 4) + 1 : -1}
            step={{ id: step, type: "traverse", indices: [currentNode], description: currentStepDesc, codeLine: (step % 4) + 1 }}
          />
        </div>
        <OperationCounter comparisons={visitedNodes.size * EDGES.length} swaps={visitedNodes.size} />
      </DiamondCard>
    </div>
  );
}
