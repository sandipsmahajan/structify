"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface EdgeConnectorProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  active: boolean;
  pulseSpeed?: number;
}

export function EdgeConnector({ start, end, color, active, pulseSpeed = 3 }: EdgeConnectorProps) {
  const lineRef = useRef<THREE.Mesh>(null);
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start.toString(), end.toString()]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  useFrame((_, delta) => {
    if (!lineRef.current || !active) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.3 + Math.sin(Date.now() * 0.005 * pulseSpeed) * 0.3;
  });

  return (
    <line ref={lineRef as never}>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial
        color={active ? color : "#555A6A"}
        linewidth={1}
        transparent
        opacity={active ? 0.6 : 0.3}
      />
    </line>
  );
}

interface TraversalPulseProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

export function TraversalPulse({ start, end, color }: TraversalPulseProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!sphereRef.current) return;
    progress.current += delta * 1.5;
    if (progress.current > 1) {
      sphereRef.current.visible = false;
      return;
    }
    const t = progress.current;
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t;
    const z = start[2] + (end[2] - start[2]) * t;
    sphereRef.current.position.set(x, y, z);
  });

  const geometry = useMemo(() => new THREE.SphereGeometry(0.15, 8, 8), []);

  return (
    <mesh ref={sphereRef} geometry={geometry}>
      <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} />
    </mesh>
  );
}
