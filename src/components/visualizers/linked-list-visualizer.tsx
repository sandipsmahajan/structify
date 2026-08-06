"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DataCube } from "./shared/data-cube";
import { SceneLayout } from "./shared/scene-layout";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { VisualizerControlsPanel } from "@/lib/visualizer-engine/controls";
import { CodeSyncPanel } from "@/lib/visualizer-engine/code-sync";
import { OperationCounter } from "@/lib/visualizer-engine/operation-counter";
import { generateAnimationSteps } from "@/lib/visualizer-engine/engine";
import type { AnimationStep, VisualizerData, VisualizerControls } from "@/lib/visualizer-engine/types";
import { Line } from "@react-three/drei";

const PSEUDOCODE = [
  "node = head",
  "while node != null:",
  "  visit node.value",
  "  node = node.next",
  "end while",
];

const INITIAL_VALUES = [10, 25, 40, 55, 70];

export function LinkedListVisualizer() {
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
    const data: VisualizerData = { structureType: "linked-list", values: vals };
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
          if (steps[next].type === "compare") setComparisons((c) => c + 1);
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
  const spacing = 1.6;
  const startX = -((values.length - 1) * spacing) / 2;

  const nodePositions = values.map((_, i) => [startX + i * spacing, 0, 0] as [number, number, number]);

  const edges = values.slice(0, -1).map((_, i) => {
    const from = nodePositions[i];
    const to = nodePositions[i + 1];
    return [from[0] + 0.45, from[1], from[2], to[0] - 0.45, to[1], to[2]] as [number, number, number, number, number, number];
  });

  const handleInsert = () => {
    const val = Number(inputValue);
    if (isNaN(val)) return;
    setValues([...values, val]);
    setInputValue("");
  };

  const handleDelete = () => {
    if (values.length === 0) return;
    setValues(values.slice(0, -1));
  };

  return (
    <div className="flex flex-col gap-4">
      <DiamondCard className="overflow-hidden p-0">
        <VisualizerControlsPanel controls={controls} isPlaying={isPlaying} speed={speed} currentStep={currentStep} totalSteps={steps.length} />
        <div className="flex">
          <div className="flex-1 h-[400px]">
            <SceneLayout cameraPosition={[0, 1, 10]}>
              {nodePositions.map((pos, i) => (
                <DataCube
                  key={i}
                  value={values[i]}
                  position={pos}
                  isHighlighted={highlightedIndices.includes(i)}
                  color={highlightedIndices.includes(i) ? "#B98CFF" : "#6FE3FF"}
                />
              ))}
              {edges.map((e, i) => (
                <Line
                  key={i}
                  points={[[e[0], e[1], e[2]], [e[3], e[4], e[5]]]}
                  color={highlightedIndices.includes(i) || highlightedIndices.includes(i + 1) ? "#B98CFF" : "#555A6A"}
                  lineWidth={1.5}
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
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="bg-bd-bg border border-bd-border rounded px-3 py-1.5 text-sm text-bd-text-primary w-24 font-mono" placeholder="99" />
          </div>
          <DiamondButton variant="primary" size="sm" onClick={handleInsert}>Append Node</DiamondButton>
          <DiamondButton variant="secondary" size="sm" onClick={handleDelete}>Remove Last</DiamondButton>
        </div>
      </DiamondCard>
    </div>
  );
}
