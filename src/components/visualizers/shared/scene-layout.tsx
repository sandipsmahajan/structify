"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { ReactNode } from "react";
import { Suspense } from "react";
import * as THREE from "three";

interface SceneLayoutProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#2D3366" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#6FE3FF" />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#B98CFF" />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#6FE3FF" distance={20} />
      <pointLight position={[0, -2, -2]} intensity={0.3} color="#B98CFF" distance={15} />
      <fog attach="fog" args={["#05060A", 10, 30]} />
      <Stars radius={20} depth={30} count={200} factor={2} saturation={0} fade speed={0.5} />
    </>
  );
}

function BackgroundPlane() {
  return (
    <mesh position={[0, 0, -8]} renderOrder={-1}>
      <planeGeometry args={[30, 20]} />
      <meshBasicMaterial color="#05060A" side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function GridPlane() {
  return (
    <gridHelper
      args={[20, 30, "#1E2130", "#0D0F16"]}
      position={[0, -3, 0]}
      rotation={[0, 0, 0]}
    />
  );
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
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
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
      <SceneLighting />
      <BackgroundPlane />
      <GridPlane />
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={25}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}
