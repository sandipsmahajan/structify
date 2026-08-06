"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SceneLayout } from "./shared/scene-layout";
import { DiamondCard } from "@/components/ui/diamond-card";
import { VisualizerControlsPanel } from "@/lib/visualizer-engine/controls";
import { OperationCounter } from "@/lib/visualizer-engine/operation-counter";
import type { VisualizerControls } from "@/lib/visualizer-engine/types";
import { Box } from "@react-three/drei";

const INITIAL_VALUES = [64, 34, 25, 12, 22, 11, 90, 78, 45, 33, 56, 18];

interface SortState {
  name: string;
  color: string;
  values: { i: number; j: number; swapped: boolean }[];
  swaps: number;
  comparisons: number;
}

function bubbleSortSteps(arr: number[]) {
  const steps: { i: number; j: number; swapped: boolean }[] = [];
  let comparisons = 0, swaps = 0;
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      const swapped = a[j] > a[j + 1];
      if (swapped) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; }
      steps.push({ i: j, j: j + 1, swapped });
    }
  }
  return { steps, comparisons, swaps };
}

function selectionSortSteps(arr: number[]) {
  const steps: { i: number; j: number; swapped: boolean }[] = [];
  let comparisons = 0, swaps = 0;
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      if (a[j] < a[minIdx]) minIdx = j;
      steps.push({ i: minIdx, j, swapped: false });
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
      steps.push({ i, j: minIdx, swapped: true });
    }
  }
  return { steps, comparisons, swaps };
}

function insertionSortSteps(arr: number[]) {
  const steps: { i: number; j: number; swapped: boolean }[] = [];
  let comparisons = 0, swaps = 0;
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0) {
      comparisons++;
      if (a[j] < a[j - 1]) {
        [a[j], a[j - 1]] = [a[j - 1], a[j]];
        swaps++;
        steps.push({ i: j, j: j - 1, swapped: true });
      } else {
        steps.push({ i: j, j: j - 1, swapped: false });
        break;
      }
      j--;
    }
  }
  return { steps, comparisons, swaps };
}

const ALGORITHMS = [
  { name: "Bubble Sort", color: "#6FE3FF", fn: bubbleSortSteps },
  { name: "Selection Sort", color: "#B98CFF", fn: selectionSortSteps },
  { name: "Insertion Sort", color: "#E8C46A", fn: insertionSortSteps },
];

function RaceBar({ value, maxValue, color, index, offset, highlight }: {
  value: number; maxValue: number; color: string;
  index: number; offset: number; highlight: boolean;
}) {
  const height = (value / maxValue) * 2;
  return (
    <Box args={[0.25, height, 0.25]} position={[index * 0.35 + offset, height / 2 - 1, 0]}>
      <meshStandardMaterial
        color={highlight ? "#FFFFFF" : color}
        transparent opacity={highlight ? 0.9 : 0.7}
        emissive={highlight ? color : "#000000"} emissiveIntensity={highlight ? 0.3 : 0}
      />
    </Box>
  );
}

function RaceScene({ states, step }: { states: SortState[]; step: number }) {
  const maxVal = Math.max(...INITIAL_VALUES);
  const offsetPerAlgo = 4;

  return (
    <SceneLayout cameraPosition={[-1, 0, 14]}>
      {states.map((state, algoIdx) => {
        const algoStep = Math.min(step, state.values.length);
        const currentVals = INITIAL_VALUES.map((_, valIdx) => {
          let val = INITIAL_VALUES[valIdx];
          for (let s = 0; s <= algoStep; s++) {
            const st = state.values[s];
            if (st && st.swapped && (st.i === valIdx || st.j === valIdx)) {
              if (st.i === valIdx) val = INITIAL_VALUES[st.j];
              else if (st.j === valIdx) val = INITIAL_VALUES[st.i];
            }
          }
          return val;
        });

        const highlightPair = algoStep < state.values.length ? state.values[algoStep] : null;

        return (
          <group key={state.name} position={[algoIdx * offsetPerAlgo - 4, 0, 0]}>
            {currentVals.map((val, i) => (
              <RaceBar
                key={i} value={val} maxValue={maxVal} color={state.color}
                index={i} offset={algoIdx * offsetPerAlgo - 4}
                highlight={highlightPair ? (highlightPair.i === i || highlightPair.j === i) : false}
              />
            ))}
          </group>
        );
      })}
    </SceneLayout>
  );
}

export function SortingRaceVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [step, setStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const states = useMemo(() => {
    return ALGORITHMS.map((algo) => {
      const result = algo.fn([...INITIAL_VALUES]);
      return {
        name: algo.name, color: algo.color,
        values: result.steps, swaps: result.swaps, comparisons: result.comparisons,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const max = Math.max(...states.map((s) => s.values.length));
    setMaxSteps(max);
  }, [states]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxSteps - 1) { setIsPlaying(false); return prev; }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, maxSteps]);

  const controls: VisualizerControls = {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => setStep((p) => Math.min(p + 1, maxSteps - 1)),
    stepBack: () => setStep((p) => Math.max(p - 1, 0)),
    reset: () => { setIsPlaying(false); setStep(0); },
    setSpeed,
    setData: () => {},
  };

  const totalComparisons = states.reduce((s, a) => s + a.comparisons, 0);
  const totalSwaps = states.reduce((s, a) => s + a.swaps, 0);

  return (
    <div className="flex flex-col gap-4">
      <DiamondCard className="overflow-hidden p-0">
        <VisualizerControlsPanel
          controls={controls} isPlaying={isPlaying} speed={speed}
          currentStep={step} totalSteps={maxSteps}
        />
        <div className="flex">
          <div className="flex-1 h-[420px]">
            <RaceScene states={states} step={step} />
          </div>
          <div className="min-w-[220px] max-w-[260px] p-4 glass border-l border-bd-border/40">
            <h4 className="text-xs font-semibold text-bd-text-muted uppercase tracking-wider mb-3">Legend</h4>
            {ALGORITHMS.map((algo) => {
              const state = states.find((s) => s.name === algo.name)!;
              return (
                <div key={algo.name} className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: algo.color }} />
                    <span className="text-xs font-medium text-bd-text-primary">{algo.name}</span>
                  </div>
                  <div className="text-[10px] text-bd-text-muted ml-5">
                    Comparisons: {state.comparisons} | Swaps: {state.swaps}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <OperationCounter comparisons={totalComparisons} swaps={totalSwaps} />
      </DiamondCard>
    </div>
  );
}
