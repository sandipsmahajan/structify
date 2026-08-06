"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Grid, PerspectiveCamera } from "@react-three/drei";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import * as THREE from "three";

const BIG_O_TABLE = [
  ["Access", "O(1)"],
  ["Search", "O(n)"],
  ["Insert (end)", "O(1)*"],
  ["Insert (mid)", "O(n)"],
  ["Delete (end)", "O(1)*"],
  ["Delete (mid)", "O(n)"],
];

const PSEUDOCODE = [
  "// Array Traversal",
  "for i = 0 to n-1:",
  "  visit(arr[i])",
  "",
  "// Insert at position k",
  "for i = n down to k+1:",
  "  arr[i] = arr[i-1]",
  "arr[k] = value",
  "n = n + 1",
];

const DEFAULT_VALUES = [42, 17, 63, 8, 95, 33, 71, 56];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function CubeElement({ value, index, total, highlightState, activePulse }: {
  value: number; index: number; total: number; highlightState: "none" | "scanning" | "active"; activePulse: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const targetY = useRef((value / 100) * 2.5);
  const currentY = useRef((value / 100) * 2.5);

  const spacing = 1.25;
  const x = (index - (total - 1) / 2) * spacing;

  const isActive = highlightState === "active";
  const isScanning = highlightState === "scanning";

  const bodyColor = isActive ? "#FFD700" : isScanning ? "#6FE3FF" : "#2A2D3A";
  const emissiveColor = isActive ? "#FF8C00" : isScanning ? "#3AA8CC" : "#1A1D2A";
  const emissiveIntensity = isActive ? 0.6 : isScanning ? 0.35 : 0.08;

  useFrame((_, delta) => {
    if (groupRef.current) {
      currentY.current = lerp(currentY.current, targetY.current, 4 * delta);
      groupRef.current.position.set(x, currentY.current, 0);

      if (isActive && glowRef.current && meshRef.current) {
        const s = 1 + Math.sin(activePulse) * 0.06;
        glowRef.current.scale.setScalar(s);
        const mat = glowRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.25 + Math.sin(activePulse) * 0.1;
        meshRef.current.rotation.y += delta * 0.8;
      } else if (isScanning && meshRef.current) {
        meshRef.current.rotation.y += delta * 0.4;
      } else {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main cube */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.65, 0.65, 0.65]} />
        <meshPhysicalMaterial
          color={bodyColor}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          metalness={0.35}
          roughness={0.4}
          clearcoat={0.15}
          clearcoatRoughness={0.5}
        />
      </mesh>

      {/* Outer glow shell */}
      <mesh ref={glowRef}>
        <boxGeometry args={[0.78, 0.78, 0.78]} />
        <meshBasicMaterial
          color={isActive ? "#E8C46A" : isScanning ? "#6FE3FF" : "transparent"}
          transparent
          opacity={isActive ? 0.2 : isScanning ? 0.12 : 0}
          depthWrite={false}
        />
      </mesh>

      {/* Value label */}
      <Text
        position={[0, -0.55, 0]}
        fontSize={0.22}
        color={isActive ? "#FFD700" : isScanning ? "#6FE3FF" : "#858A9A"}
        anchorX="center"
        anchorY="middle"
      >
        {value.toString()}
      </Text>
    </group>
  );
}

function Scene({ values, highlightStates, activePulse }: {
  values: number[]; highlightStates: ("none" | "scanning" | "active")[]; activePulse: number;
}) {
  const camRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (camRef.current) {
      const t = Date.now() * 0.0001;
      camRef.current.position.x = 3.5 + Math.sin(t * 0.5) * 0.3;
      camRef.current.position.y = 3.2 + Math.cos(t * 0.4) * 0.2;
      camRef.current.lookAt(0, 0.6, -1);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault ref={camRef} position={[3.5, 3.2, 6]} fov={45} />

      {/* Lighting */}
      <ambientLight intensity={0.25} color="#445566" />
      <directionalLight position={[5, 8, 3]} intensity={0.7} color="#ffffff" castShadow shadow-mapSize={[512, 512]} />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#6FE3FF" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#B98CFF" />

      {/* Reflective dark floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0A0D14" metalness={0.8} roughness={0.35} />
      </mesh>

      {/* Grid */}
      <Grid
        position={[0, -2.08, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.4}
        sectionSize={5}
        sectionThickness={0.8}
        fadeDistance={30}
        infiniteGrid
        cellColor="#1E2130"
        sectionColor="#252838"
      />

      {/* Subtle fog for depth */}
      <fog attach="fog" args={["#05060A", 6, 20]} />

      {/* Cubes */}
      {values.map((v, i) => (
        <CubeElement
          key={i}
          value={v}
          index={i}
          total={values.length}
          highlightState={highlightStates[i] ?? "none"}
          activePulse={activePulse}
        />
      ))}
    </>
  );
}

interface Props {
  theoryContent: string;
  realWorldUseCase: string;
}

export function ArrayVisualizerClient({ theoryContent, realWorldUseCase }: Props) {
  const [values, setValues] = useState(DEFAULT_VALUES);
  const [customInput, setCustomInput] = useState(DEFAULT_VALUES.join(","));
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [highlightStates, setHighlightStates] = useState<("none" | "scanning" | "active")[]>(() => new Array(DEFAULT_VALUES.length).fill("none"));
  const pulseRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = values.length;

  const walkToStep = useCallback((s: number) => {
    const clamped = Math.max(0, Math.min(s, totalSteps));
    setStep(clamped);
    const newStates: ("none" | "scanning" | "active")[] = new Array(values.length).fill("none");
    if (clamped > 0 && clamped <= values.length) {
      for (let i = 0; i < clamped - 1; i++) newStates[i] = "scanning";
      newStates[clamped - 1] = "active";
    }
    setHighlightStates(newStates);
  }, [values.length, totalSteps]);

  useEffect(() => {
    walkToStep(0);
  }, [values, walkToStep]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          const next = prev + 1;
          if (next > totalSteps) { setIsPlaying(false); return prev; }
          walkToStep(next);
          return next;
        });
      }, 800 / speed);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, totalSteps, walkToStep]);

  useEffect(() => {
    const animate = () => {
      pulseRef.current += 0.03;
    };
    const id = setInterval(animate, 16);
    return () => clearInterval(id);
  }, []);

  const highlightedCodeLine = step > 0 && step <= values.length ? 0 : -1;

  const parsedFirstPara = useMemo(() => {
    const match = theoryContent.match(/# Arrays[\s\S]*?\n\n([\s\S]*?)(?=\n##|\n$)/);
    return match?.[1]?.trim() ?? "A contiguous block of memory storing elements of the same type, providing O(1) random access by index.";
  }, [theoryContent]);

  const applyCustomInput = () => {
    const nums = customInput.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    if (nums.length > 0 || customInput.trim() === "") {
      const vals = nums.length > 0 ? nums : DEFAULT_VALUES;
      setValues(vals);
      setCustomInput(vals.join(","));
      setIsPlaying(false);
      setStep(0);
      setHighlightStates(new Array(vals.length).fill("none"));
    }
  };

  const reset = () => {
    setValues(DEFAULT_VALUES);
    setCustomInput(DEFAULT_VALUES.join(","));
    setIsPlaying(false);
    setStep(0);
    setHighlightStates(new Array(DEFAULT_VALUES.length).fill("none"));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="heading-display text-3xl mb-2">
          Array Visualizer
          <span className="ml-3 inline-block align-middle clip-diamond-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-bd-cyan-dim text-bd-cyan">Free</span>
        </h1>
        <p className="text-sm text-bd-text-secondary">Interactive 3D array with traversal, insert, and delete operations. Each cube represents an element indexed by position.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT - 3D Canvas */}
        <div className="lg:col-span-2">
          <DiamondCard className="overflow-hidden p-0 h-[500px] relative">
            <Canvas
              gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
              shadows="soft"
              camera={{ position: [3.5, 3.2, 6], fov: 45 }}
              style={{ background: "#05060A" }}
            >
              <Scene values={values} highlightStates={highlightStates} activePulse={pulseRef.current} />
            </Canvas>
            {/* Overlay: step counter */}
            <div className="absolute top-3 right-3 glass px-3 py-1.5 rounded text-xs text-bd-text-muted font-mono">
              Step {step} / {totalSteps}
            </div>
          </DiamondCard>
        </div>

        {/* RIGHT - Theory Panel */}
        <div className="space-y-4">
          {/* What is an Array */}
          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-2 text-bd-cyan">What is an Array?</h3>
            <p className="text-xs text-bd-text-secondary leading-relaxed">{parsedFirstPara}</p>
          </DiamondCard>

          {/* Big-O Complexity Table */}
          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-3 text-bd-violet">Complexity</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-bd-border/30">
                  <th className="text-left py-1 text-bd-text-muted font-medium">Operation</th>
                  <th className="text-right py-1 text-bd-text-muted font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {BIG_O_TABLE.map(([op, time]) => (
                  <tr key={op} className="border-b border-bd-border/10">
                    <td className="py-1.5 text-bd-text-secondary">{op}</td>
                    <td className={`py-1.5 text-right font-mono ${time.startsWith("O(1)") ? "text-bd-emerald" : "text-bd-gold"}`}>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-bd-text-muted mt-2">*Amortized O(1) for dynamic arrays</p>
          </DiamondCard>

          {/* Pseudocode */}
          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-3 text-bd-gold">Pseudocode</h3>
            <div className="code-block p-3 text-xs font-mono">
              {PSEUDOCODE.map((line, i) => (
                <div
                  key={i}
                  className={`py-0.5 px-1 -mx-1 rounded transition-colors duration-200 ${
                    i === highlightedCodeLine ? "bg-bd-gold/15 text-bd-gold" :
                    line.startsWith("//") ? "text-bd-text-muted italic" : "text-bd-text-secondary"
                  }`}
                >
                  {line || "\u00A0"}
                </div>
              ))}
            </div>
          </DiamondCard>

          {/* Why This Matters */}
          <DiamondCard className="p-5 border-bd-gold/20 bg-bd-gold-dim/10">
            <h3 className="heading-section text-sm mb-2 text-bd-gold">Why This Matters</h3>
            <p className="text-xs text-bd-text-secondary leading-relaxed">{realWorldUseCase}</p>
          </DiamondCard>
        </div>
      </div>

      {/* BOTTOM - Controls */}
      <DiamondCard className="p-5 mt-6">
        <div className="flex flex-wrap items-center gap-4">
          <DiamondButton variant="ghost" size="sm" onClick={() => walkToStep(0)} disabled={step === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" /><rect x="14" y="6" width="4" height="12" /></svg>
          </DiamondButton>

          <DiamondButton variant="ghost" size="sm" onClick={() => walkToStep(Math.max(0, step - 1))} disabled={step === 0}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" /><polygon points="18,6 14,12 18,18" /></svg>
          </DiamondButton>

          <DiamondButton variant={isPlaying ? "ghost" : "primary"} size="sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
            )}
          </DiamondButton>

          <DiamondButton variant="ghost" size="sm" onClick={() => walkToStep(step + 1)} disabled={step >= totalSteps}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="14" y="6" width="4" height="12" /><polygon points="6,6 10,12 6,18" /></svg>
          </DiamondButton>

          <DiamondButton variant="ghost" size="sm" onClick={() => walkToStep(totalSteps)} disabled={step >= totalSteps}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" /><rect x="14" y="6" width="4" height="12" /></svg>
          </DiamondButton>

          <div className="w-px h-6 bg-bd-border" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-bd-text-muted">Speed</span>
            <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-20 accent-bd-cyan" />
            <span className="text-[10px] text-bd-text-muted font-mono w-4">{speed}x</span>
          </div>

          <div className="w-px h-6 bg-bd-border" />

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCustomInput()}
              placeholder="e.g. 10,25,5,80,45"
              className="flex-1 bg-bd-bg border border-bd-border rounded px-3 py-1.5 text-xs font-mono text-bd-text-primary placeholder:text-bd-text-muted focus:outline-none focus:border-bd-cyan/50"
            />
            <DiamondButton variant="secondary" size="sm" onClick={applyCustomInput}>Apply</DiamondButton>
            <DiamondButton variant="ghost" size="sm" onClick={reset}>Reset</DiamondButton>
          </div>
        </div>
      </DiamondCard>
    </div>
  );
}
