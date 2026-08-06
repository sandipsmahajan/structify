"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";
import { Suspense } from "react";

interface SceneLayoutProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

export function SceneLayout({ children, cameraPosition = [0, 3, 12] }: SceneLayoutProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
      frameloop="always"
      onCreated={({ gl: renderer }) => {
        const canvas = renderer.domElement;
        const onContextLost = (event: Event) => {
          event.preventDefault();
        };
        const onContextRestored = () => {
          renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        };
        canvas.addEventListener("webglcontextlost", onContextLost);
        canvas.addEventListener("webglcontextrestored", onContextRestored);
        return () => {
          canvas.removeEventListener("webglcontextlost", onContextLost);
          canvas.removeEventListener("webglcontextrestored", onContextRestored);
        };
      }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1} />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#B98CFF" />
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <OrbitControls enableDamping dampingFactor={0.1} />
    </Canvas>
  );
}
