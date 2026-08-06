"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DataCube } from "./shared/data-cube";
import { SceneLayout } from "./shared/scene-layout";
import { EdgeConnector } from "./shared/edge-connector";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { VisualizerControlsPanel } from "@/lib/visualizer-engine/controls";
import { CodeSyncPanel } from "@/lib/visualizer-engine/code-sync";
import { OperationCounter } from "@/lib/visualizer-engine/operation-counter";
import { generateAnimationSteps } from "@/lib/visualizer-engine/engine";
import type { AnimationStep, VisualizerData, VisualizerControls } from "@/lib/visualizer-engine/types";

const PSEUDOCODE = [
  "function insert(root, val):",
  "  if val < root.val:",
  "    go left",
  "  else if val > root.val:",
  "    go right",
  "  else return",
  "  insert at leaf",
];

const INITIAL_VALUES = [50, 30, 70, 20, 40, 60, 80];

export function BstVisualizer() {
  const [values, setValues] = useState<number[]>(INITIAL_VALUES);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildSteps = useCallback((vals: number[]) => {
    const data: VisualizerData = { structureType: "bst", values: vals };
    return generateAnimationSteps(data);
  }, []);

  useEffect(() => {
    setSteps(buildSteps(values));
    setCurrentStep(0);
    setIsPlaying(false);
  }, [values, buildSteps]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= steps.length) { setIsPlaying(false); return prev; }
          const s = steps[next];
          if (s.type === "compare") setComparisons((c) => c + 1);
          if (s.type === "swap") setSwaps((s2) => s2 + 1);
          return next;
        });
      }, 1000 / speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, steps, speed]);

  const controls: VisualizerControls = {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => setCurrentStep((p) => Math.min(p + 1, steps.length - 1)),
    stepBack: () => setCurrentStep((p) => Math.max(p - 1, 0)),
    reset: () => { setIsPlaying(false); setCurrentStep(0); setComparisons(0); setSwaps(0); },
    setSpeed,
    setData: (data) => setValues(data.values),
  };

  const currentStepData = steps[currentStep] ?? null;
  const highlightedIndices = currentStepData?.indices ?? [];

  const sorted = [...values].sort((a, b) => a - b);
  const rootIdx = Math.floor(sorted.length / 2);

  interface NodePos { value: number; x: number; y: number; idx: number }
  const positions: NodePos[] = [];
  const edgeList: { start: [number, number, number]; end: [number, number, number]; idx: number }[] = [];

  const placeNode = (arr: number[], depth: number, left: number, right: number, parentIdx?: number) => {
    if (left > right) return -1;
    const mid = Math.floor((left + right) / 2);
    const nodeIdx = positions.length;
    positions.push({ value: arr[mid], x: (mid - rootIdx) * 1.6, y: -depth * 2.5, idx: values.indexOf(arr[mid]) });
    if (parentIdx !== undefined && parentIdx >= 0) {
      const p = positions[parentIdx];
      edgeList.push({ start: [p.x, p.y, 0], end: [positions[nodeIdx].x, positions[nodeIdx].y, 0], idx: nodeIdx });
    }
    const pi = nodeIdx;
    placeNode(arr, depth + 1, left, mid - 1, pi);
    placeNode(arr, depth + 1, mid + 1, right, pi);
    return nodeIdx;
  };

  placeNode(sorted, 0, 0, sorted.length - 1);

  const handleInsert = () => {
    const val = Number(inputValue);
    if (isNaN(val) || values.includes(val)) return;
    setValues([...values, val]);
    setInputValue("");
  };

  const handleDelete = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return;
    setValues(values.filter((v) => v !== val));
    setInputValue("");
  };

  return (
    <div className="flex flex-col gap-4">
      <DiamondCard className="overflow-hidden p-0">
        <VisualizerControlsPanel controls={controls} isPlaying={isPlaying} speed={speed} currentStep={currentStep} totalSteps={steps.length} />
        <div className="flex">
          <div className="flex-1 h-[450px]">
            <SceneLayout cameraPosition={[0, 1, 14]}>
              {edgeList.map((e, i) => {
                const childActive = highlightedIndices.includes(e.idx);
                const parentNode = positions.find((p) => p.x === e.start[0] && p.y === e.start[1]);
                const parentActive = parentNode ? highlightedIndices.includes(positions.indexOf(parentNode)) : false;
                return (
                  <EdgeConnector
                    key={i}
                    start={e.start}
                    end={e.end}
                    color={childActive || parentActive ? "#2DD4BF" : "#555A6A"}
                    active={childActive || parentActive}
                  />
                );
              })}
              {positions.map((p, i) => (
                <DataCube
                  key={i}
                  value={p.value}
                  position={[p.x, p.y, 0]}
                  isHighlighted={highlightedIndices.includes(i)}
                  color={highlightedIndices.includes(i) ? "#E8C46A" : "#2DD4BF"}
                  highlightColor="#E8C46A"
                />
              ))}
            </SceneLayout>
          </div>
          <CodeSyncPanel pseudocode={PSEUDOCODE} currentLine={currentStepData?.codeLine ?? -1} step={currentStepData} />
        </div>
        <OperationCounter comparisons={comparisons} swaps={swaps} />
      </DiamondCard>

      <DiamondCard className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-bd-text-muted mb-1">Value</label>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-bd-bg border border-bd-border rounded px-3 py-1.5 text-sm text-bd-text-primary w-24 font-mono" placeholder="55" />
          </div>
          <DiamondButton variant="primary" size="sm" onClick={handleInsert}>Insert</DiamondButton>
          <DiamondButton variant="secondary" size="sm" onClick={handleDelete}>Delete</DiamondButton>
        </div>
      </DiamondCard>
    </div>
  );
}
