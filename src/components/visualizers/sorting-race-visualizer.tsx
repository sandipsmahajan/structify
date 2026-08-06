"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { SceneLayout } from "./shared/scene-layout";
import { DiamondCard } from "@/components/ui/diamond-card";
import { VisualizerControlsPanel } from "@/lib/visualizer-engine/controls";
import { OperationCounter } from "@/lib/visualizer-engine/operation-counter";
import type { VisualizerControls } from "@/lib/visualizer-engine/types";

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

function getCurrentValues(initVals: number[], state: SortState, step: number): number[] {
  const vals = [...initVals];
  for (let s = 0; s <= Math.min(step, state.values.length - 1); s++) {
    const st = state.values[s];
    if (st && st.swapped) {
      [vals[st.i], vals[st.j]] = [vals[st.j], vals[st.i]];
    }
  }
  return vals;
}

function SwapParticle({ position, color }: { position: THREE.Vector3; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 8;

  const { geometry, velocities } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      vel[i * 3] = (Math.random() - 0.5) * 2;
      vel[i * 3 + 1] = Math.random() * 3 + 0.5;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: g, velocities: vel };
  }, [count]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pointsRef.current) pointsRef.current.visible = false;
    }, 500);
    return () => clearTimeout(timer);
  }, [position]);

  useFrame((_, delta) => {
    if (!pointsRef.current?.visible) return;
    const pos = geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i * 3] * delta;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      pos[i * 3 + 2] += velocities[i * 3 + 2] * delta;
    }
    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial color={color} size={0.06} transparent opacity={0.9} depthWrite={false} />
    </points>
  );
}

function AnimatedBar({
  value, maxValue, color, barIndex, algoOffset, isHighlighted, showParticle,
}: {
  value: number; maxValue: number; color: string;
  barIndex: number; algoOffset: number; isHighlighted: boolean; showParticle: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = (value / maxValue) * 2.5;
  const x = barIndex * 0.35 + algoOffset;

  useFrame(() => {
    if (!meshRef.current) return;
    const currentScale = meshRef.current.scale.y;
    meshRef.current.scale.y += (targetHeight - currentScale) * 0.15;
    // emit particle on swap highlight
  });

  const emissiveColor = isHighlighted ? new THREE.Color(color).multiplyScalar(0.5) : new THREE.Color("#000000");

  return (
    <group>
      <mesh ref={meshRef} position={[x, targetHeight / 2 - 1.3, 0]} scale={[1, targetHeight, 1]}>
        <boxGeometry args={[0.25, 1, 0.25]} />
        <meshPhysicalMaterial
          color={isHighlighted ? "#FFFFFF" : color}
          emissive={emissiveColor}
          emissiveIntensity={isHighlighted ? 0.6 : 0.1}
          transparent
          opacity={isHighlighted ? 0.9 : 0.55}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      {isHighlighted && (
        <mesh position={[x, 0, 0]}>
          <boxGeometry args={[0.3, targetHeight + 0.1, 0.3]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}
      {showParticle && (
        <SwapParticle position={new THREE.Vector3(x, targetHeight / 2 + 0.3, 0)} color={color} />
      )}
    </group>
  );
}

function RaceScene({ states, step, prevStep }: { states: SortState[]; step: number; prevStep: React.MutableRefObject<number> }) {
  const maxVal = Math.max(...INITIAL_VALUES);
  const offsetPerAlgo = 4.5;

  return (
    <SceneLayout cameraPosition={[-1, 0, 14]}>
      {[{ name: "Bubble", color: "#6FE3FF" }, { name: "Selection", color: "#B98CFF" }, { name: "Insertion", color: "#E8C46A" }].map((algo, ai) => (
        <Text
          key={algo.name}
          position={[ai * offsetPerAlgo - 4.5, 2.2, 0]}
          fontSize={0.25}
          color={algo.color}
          anchorX="center"
          anchorY="middle"
        >
          {algo.name}
        </Text>
      ))}

      {states.map((state, algoIdx) => {
        const algoStep = Math.min(step, state.values.length - 1);
        const currentVals = getCurrentValues(INITIAL_VALUES, state, algoStep);
        const highlightPair = algoStep < state.values.length ? state.values[algoStep] : null;

        return (
          <group key={state.name} position={[algoIdx * offsetPerAlgo - 4.5, 0, 0]}>
            {currentVals.map((val, i) => {
              const isHighlighted = highlightPair ? (highlightPair.i === i || highlightPair.j === i) : false;
              const justSwapped = prevStep.current !== step && highlightPair?.swapped === true && (highlightPair.i === i || highlightPair.j === i);
              return (
                <AnimatedBar
                  key={i}
                  value={val}
                  maxValue={maxVal}
                  color={state.color}
                  barIndex={i}
                  algoOffset={0}
                  isHighlighted={isHighlighted}
                  showParticle={justSwapped}
                />
              );
            })}

            <Text
              position={[5.5, -2.5, 0]}
              fontSize={0.15}
              color={state.color}
              anchorX="center"
            >
              Swaps: {state.swaps} | Compares: {state.comparisons}
            </Text>
          </group>
        );
      })}
    </SceneLayout>
  );
}

export function SortingRaceVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [step, setStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevStep = useRef(0);

  const states = useMemo(() => {
    const vals = [...INITIAL_VALUES];
    return ALGORITHMS.map((algo) => {
      const result = algo.fn(vals);
      return { name: algo.name, color: algo.color, values: result.steps, swaps: result.swaps, comparisons: result.comparisons };
    });
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

  useEffect(() => {
    prevStep.current = step;
  }, [step]);

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
            <RaceScene states={states} step={step} prevStep={prevStep} />
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
