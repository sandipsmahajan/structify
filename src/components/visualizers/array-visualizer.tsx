"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
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

const MAX_VAL = 100;

interface CubeState { id: number; value: number; targetX: number; entering?: boolean }

function useCubeStates(values: number[]) {
  const [states, setStates] = useState<CubeState[]>(() =>
    values.map((v, i) => ({ id: i, value: v, targetX: i - (values.length - 1) / 2 }))
  );

  const setValues = useCallback((newVals: number[]) => {
    const midpoint = (newVals.length - 1) / 2;
    setStates(
      newVals.map((v, i) => ({ id: i, value: v, targetX: i - midpoint, entering: true }))
    );
    // clear entering flag after animation
    setTimeout(() => {
      setStates((prev) => prev.map((s) => ({ ...s, entering: false })));
    }, 400);
  }, []);

  return { states, setValues };
}

function SparkParticles({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 20;

  const { geometry, velocities } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      vel[i * 3] = (Math.random() - 0.5) * 3;
      vel[i * 3 + 1] = Math.random() * 4 + 1;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: g, velocities: vel };
  }, [count]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pointsRef.current) pointsRef.current.visible = false;
    }, 800);
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
      <pointsMaterial color="#E8C46A" size={0.08} transparent opacity={0.8} depthWrite={false} />
    </points>
  );
}

function ArrayScene({
  states,
  highlightedIndices,
}: {
  states: CubeState[];
  highlightedIndices: number[];
}) {
  const [sparkPos, setSparkPos] = useState<[number, number, number] | null>(null);

  return (
    <>
      {states.map((s, i) => {
        const heightScale = s.value / MAX_VAL;
        return (
          <SmoothCube
            key={s.id}
            value={s.value}
            targetX={s.targetX}
            index={i}
            heightScale={heightScale}
            isHighlighted={highlightedIndices.includes(i)}
            onSpark={(pos) => setSparkPos(pos)}
          />
        );
      })}
      {sparkPos && <SparkParticles position={sparkPos} />}
    </>
  );
}

function SmoothCube({
  value,
  targetX,
  index,
  heightScale,
  isHighlighted,
  onSpark,
}: {
  value: number;
  targetX: number;
  index: number;
  heightScale: number;
  isHighlighted: boolean;
  onSpark: (pos: [number, number, number]) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const prevHighlighted = useRef(isHighlighted);

  useFrame(() => {
    if (!groupRef.current) return;
    const currentX = groupRef.current.position.x;
    const diff = targetX - currentX;
    if (Math.abs(diff) < 0.01) {
      groupRef.current.position.x = targetX;
    } else {
      groupRef.current.position.x += diff * 0.15;
    }

    const targetY = heightScale * 1.3;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.12;

    if (isHighlighted && !prevHighlighted.current) {
      onSpark([groupRef.current.position.x, groupRef.current.position.y + 0.5, 0]);
    }
    prevHighlighted.current = isHighlighted;
  });

  const color = getGradientColor(index, 8, heightScale);

  return (
    <group ref={groupRef} position={[targetX, 0, 0]}>
      <DataCube
        value={value}
        position={[0, 0, 0]}
        isHighlighted={isHighlighted}
        color={color}
        heightScale={heightScale}
      />
    </group>
  );
}

function getGradientColor(index: number, total: number, height: number): string {
  const t = total > 1 ? index / (total - 1) : 0;
  const hue = 180 + t * 100; // cyan → purple
  const sat = 70 + height * 30;
  const light = 50 + height * 20;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

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
          if (step?.type === "compare") setComparisons((c) => c + 1);
          if (step?.type === "swap") setSwaps((s) => s + 1);
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

  const { states, setValues: setCubeValues } = useCubeStates(values);

  const handleInsert = () => {
    const val = Number(inputValue);
    const idx = insertIndex ? Number(insertIndex) : values.length;
    if (isNaN(val)) return;
    const newValues = [...values];
    newValues.splice(Math.min(idx, newValues.length), 0, val);
    setValues(newValues);
    setCubeValues(newValues);
    setInputValue("");
    setInsertIndex("");
  };

  const handleDelete = () => {
    const idx = insertIndex ? Number(insertIndex) : values.length - 1;
    if (isNaN(idx) || idx < 0 || idx >= values.length) return;
    const newValues = values.filter((_, i) => i !== idx);
    setValues(newValues);
    setCubeValues(newValues);
    setInsertIndex("");
  };

  const handleShuffle = () => {
    const shuffled = [...values].sort(() => Math.random() - 0.5);
    setValues(shuffled);
    setCubeValues(shuffled);
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
            <SceneLayout cameraPosition={[0, 3, 10]}>
              <ArrayScene states={states} highlightedIndices={highlightedIndices} />
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
            <label className="block text-xs text-bd-text-muted mb-1">Index</label>
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
          <DiamondButton variant="ghost" size="sm" onClick={handleShuffle}>Shuffle</DiamondButton>
        </div>
      </DiamondCard>
    </div>
  );
}
