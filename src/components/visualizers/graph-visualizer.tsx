"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { SceneLayout } from "./shared/scene-layout";
import { EdgeConnector } from "./shared/edge-connector";
import { DiamondCard } from "@/components/ui/diamond-card";
import { VisualizerControlsPanel } from "@/lib/visualizer-engine/controls";
import { CodeSyncPanel } from "@/lib/visualizer-engine/code-sync";
import { OperationCounter } from "@/lib/visualizer-engine/operation-counter";
import type { VisualizerControls } from "@/lib/visualizer-engine/types";
import { Text } from "@react-three/drei";
import * as THREE from "three";
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

function GlowNode({ label, position, color, isHighlighted, visited }: {
  label: string; position: [number, number, number]; color: string; isHighlighted: boolean; visited: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const highlightColor = isHighlighted ? "#FFFFFF" : color;
  const emissive = new THREE.Color(color).multiplyScalar(isHighlighted ? 1.2 : visited ? 0.7 : 0.2);

  useFrame(() => {
    if (ringRef.current && isHighlighted) {
      ringRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.006) * 0.15);
    }
  });

  return (
    <group position={position}>
      {isHighlighted && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.48, 0.52, 32]} />
          <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      )}

      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshPhysicalMaterial
          color={highlightColor}
          emissive={emissive}
          emissiveIntensity={isHighlighted ? 1 : 0.3}
          metalness={0.2}
          roughness={0.3}
          clearcoat={0.1}
        />
      </mesh>

      {visited && !isHighlighted && (
        <mesh>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
        </mesh>
      )}

      <Text
        position={[0, 0.55, 0]}
        fontSize={0.28}
        color={isHighlighted ? "#FFFFFF" : "#E8ECF1"}
        anchorX="center"
        anchorY="middle"
        fontWeight={isHighlighted ? "bold" : "normal"}
      >
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
                  <EdgeConnector
                    key={i}
                    start={nodePositions[s]}
                    end={nodePositions[t]}
                    color={isActive ? "#6FE3FF" : "#333548"}
                    active={isActive}
                  />
                );
              })}
              {NODE_VALUES.map((label, i) => (
                <GlowNode
                  key={i}
                  label={label}
                  position={nodePositions[i]}
                  color={i === currentNode ? "#E8C46A" : visitedNodes.has(i) ? "#6FE3FF" : "#555A6A"}
                  isHighlighted={i === currentNode}
                  visited={visitedNodes.has(i)}
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
