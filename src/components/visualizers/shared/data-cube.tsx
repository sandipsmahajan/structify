"use client";

import { useRef, useMemo } from "react";
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
  heightScale?: number;
  onClick?: () => void;
}

export function DataCube({
  position,
  value,
  color = "#6FE3FF",
  highlightColor = "#E8C46A",
  isHighlighted = false,
  scale = 1,
  heightScale = 1,
  onClick,
}: DataCubeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const resolvedColor = useMemo(() => new THREE.Color(isHighlighted ? highlightColor : color), [color, highlightColor, isHighlighted]);
  const glowColor = useMemo(() => new THREE.Color(isHighlighted ? highlightColor : color).multiplyScalar(1.5), [color, highlightColor, isHighlighted]);

  const emissiveColor = useMemo(() => {
    if (isHighlighted) return new THREE.Color(highlightColor).multiplyScalar(0.6);
    return new THREE.Color(color).multiplyScalar(0.2);
  }, [color, highlightColor, isHighlighted]);

  const normalColor = useMemo(() => {
    const c = new THREE.Color(color);
    return [c.clone().multiplyScalar(0.3), c.clone().multiplyScalar(0.5)];
  }, [color]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = Date.now() * 0.001;

    if (isHighlighted) {
      groupRef.current.rotation.y += delta * 0.6;
      const pulse = 1 + Math.sin(t * 3) * 0.06;
      groupRef.current.scale.setScalar(pulse * scale);
      if (glowRef.current) {
        glowRef.current.scale.setScalar(1.06 + Math.sin(t * 4) * 0.04);
        (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 5) * 0.08;
      }
    } else {
      if (groupRef.current.scale.x !== scale) {
        groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      }
      if (groupRef.current.rotation.y !== 0) {
        groupRef.current.rotation.y *= 0.95;
      }
    }
  });

  const boxHeight = 0.7 + heightScale * 1.2;
  const boxWidth = 0.85;

  return (
    <group ref={groupRef} position={position}>
      {isHighlighted && (
        <mesh ref={glowRef} position={[0, 0, 0]}>
          <boxGeometry args={[boxWidth * 1.06, boxHeight * 1.06, boxWidth * 1.06]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.12}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh ref={meshRef} onClick={onClick} castShadow>
        <boxGeometry args={[boxWidth, boxHeight, boxWidth]} />
        <meshPhysicalMaterial
          color={resolvedColor}
          emissive={emissiveColor}
          emissiveIntensity={isHighlighted ? 0.8 : 0.3}
          transparent
          opacity={isHighlighted ? 0.55 : 0.25}
          metalness={0.15}
          roughness={0.25}
          clearcoat={0.1}
          clearcoatRoughness={0.2}
        />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(boxWidth, boxHeight, boxWidth)]} />
        <lineBasicMaterial
          color={isHighlighted ? highlightColor : normalColor[0]}
          linewidth={1}
          transparent
          opacity={isHighlighted ? 0.9 : 0.5}
        />
      </lineSegments>

      <Text
        position={[0, 0, boxWidth / 2 + 0.05]}
        fontSize={isHighlighted ? 0.32 : 0.28}
        color={isHighlighted ? "#FFFFFF" : "#E8ECF1"}
        anchorX="center"
        anchorY="middle"
        fontWeight={isHighlighted ? "bold" : "normal"}
      >
        {String(value)}
      </Text>
    </group>
  );
}
