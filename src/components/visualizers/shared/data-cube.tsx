"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface DataCubeProps {
  position: [number, number, number];
  value: number;
  color?: string;
  highlightColor?: string;
  isHighlighted?: boolean;
  scale?: number;
  onClick?: () => void;
}

export function DataCube({
  position,
  value,
  color = "#6FE3FF",
  highlightColor = "#B98CFF",
  isHighlighted = false,
  scale = 1,
  onClick,
}: DataCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgeColor = isHighlighted ? highlightColor : "#1E2130";
  const faceColor = isHighlighted ? highlightColor : color;
  const faceOpacity = isHighlighted ? 0.4 : 0.15;

  useFrame(() => {
    if (meshRef.current && isHighlighted) {
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef} onClick={onClick}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial
          color={faceColor}
          transparent
          opacity={faceOpacity}
          metalness={0.1}
          roughness={0.3}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.9, 0.9, 0.9)]} />
        <lineBasicMaterial color={edgeColor} linewidth={1} />
      </lineSegments>
      <Text
        position={[0, 0, 0.5]}
        fontSize={0.35}
        color={isHighlighted ? "#FFFFFF" : "#E8ECF1"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.ttf"
      >
        {String(value)}
      </Text>
    </group>
  );
}
