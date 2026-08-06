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

const PSEUDOCODE = [
  "for i = 0 to n-1:",
  "  access arr[i]",
  "  process element",
  "end for",
];

const INITIAL_VALUES = [42, 17, 63, 8, 95, 33, 71, 56];

export function ArrayVisualizer() {
  const [values, setValues] = useState<number[]>(INITIAL_VALUES);
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [insertIndex, setInsertIndex] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildSteps = useCallback((vals: number[]) => {
    const data: VisualizerData = { structureType: "array", values: vals };
    return generateAnimationSteps(data);
  }, []);

  useEffect(() => {
    const generated = buildSteps(values);
    setSteps(generated);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [values, buildSteps]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1;
          if (next >= steps.length) {
            setIsPlaying(false);
            return prev;
          }
          const step = steps[next];
          if (step.type === "compare") setComparisons((c) => c + 1);
          if (step.type === "swap") setSwaps((s) => s + 1);
          return next;
        });
      }, 1000 / speed);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  const controls: VisualizerControls = {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => setCurrentStep((p) => Math.min(p + 1, steps.length - 1)),
    stepBack: () => setCurrentStep((p) => Math.max(p - 1, 0)),
    reset: () => {
      setIsPlaying(false);
      setCurrentStep(0);
      setComparisons(0);
      setSwaps(0);
    },
    setSpeed,
    setData: (data) => setValues(data.values),
  };

  const currentStepData = steps[currentStep] ?? null;
  const highlightedIndices = currentStepData?.indices ?? [];

  const handleInsert = () => {
    const val = Number(inputValue);
    const idx = insertIndex ? Number(insertIndex) : values.length;
    if (isNaN(val)) return;
    const newValues = [...values];
    newValues.splice(Math.min(idx, newValues.length), 0, val);
    setValues(newValues);
    setInputValue("");
    setInsertIndex("");
  };

  const handleDelete = () => {
    const idx = insertIndex ? Number(insertIndex) : values.length - 1;
    if (isNaN(idx) || idx < 0 || idx >= values.length) return;
    setValues(values.filter((_, i) => i !== idx));
    setInsertIndex("");
  };

  return (
    <div className="flex flex-col gap-4">
      <DiamondCard className="overflow-hidden p-0">
        <VisualizerControlsPanel
          controls={controls}
          isPlaying={isPlaying}
          speed={speed}
          currentStep={currentStep}
          totalSteps={steps.length}
        />

        <div className="flex">
          <div className="flex-1 h-[400px]">
            <SceneLayout cameraPosition={[0, 2, 10]}>
              {values.map((val, i) => (
                <DataCube
                  key={i}
                  value={val}
                  position={[i - (values.length - 1) / 2, 0, 0]}
                  isHighlighted={highlightedIndices.includes(i)}
                  color={highlightedIndices.includes(i) ? "#B98CFF" : "#6FE3FF"}
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
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-bd-bg border border-bd-border rounded px-3 py-1.5 text-sm text-bd-text-primary w-24 font-mono"
              placeholder="42"
            />
          </div>
          <div>
            <label className="block text-xs text-bd-text-muted mb-1">Index (optional)</label>
            <input
              type="number"
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
              className="bg-bd-bg border border-bd-border rounded px-3 py-1.5 text-sm text-bd-text-primary w-20 font-mono"
              placeholder="0"
            />
          </div>
          <DiamondButton variant="primary" size="sm" onClick={handleInsert}>Insert</DiamondButton>
          <DiamondButton variant="secondary" size="sm" onClick={handleDelete}>Delete</DiamondButton>
        </div>
      </DiamondCard>
    </div>
  );
}
