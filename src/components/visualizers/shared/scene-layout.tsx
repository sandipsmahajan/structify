"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

interface SceneLayoutProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

export function SceneLayout({ children, cameraPosition = [0, 3, 12] }: SceneLayoutProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#B98CFF" />
      {children}
      <OrbitControls enableDamping dampingFactor={0.1} />
    </Canvas>
  );
}
