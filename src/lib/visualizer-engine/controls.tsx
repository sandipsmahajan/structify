"use client";

import { DiamondButton } from "@/components/ui/diamond-button";
import type { VisualizerControls } from "@/lib/visualizer-engine/types";

interface ControlsProps {
  controls: VisualizerControls;
  isPlaying: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
}

export function VisualizerControlsPanel({
  controls,
  isPlaying,
  speed,
  currentStep,
  totalSteps,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 glass border-b border-bd-border/40">
      <div className="flex items-center gap-2">
        <DiamondButton
          variant="secondary"
          size="sm"
          onClick={isPlaying ? controls.pause : controls.play}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
          )}
        </DiamondButton>

        <DiamondButton variant="secondary" size="sm" onClick={controls.stepBack} disabled={currentStep <= 0}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 20L9 12l10-8v16zM5 19V5" /></svg>
        </DiamondButton>

        <DiamondButton variant="secondary" size="sm" onClick={controls.stepForward} disabled={currentStep >= totalSteps - 1}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4l10 8-10 8V4zM19 5v14" /></svg>
        </DiamondButton>

        <DiamondButton variant="ghost" size="sm" onClick={controls.reset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6M23 20v-6h-6" /><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" /></svg>
        </DiamondButton>
      </div>

      <div className="flex items-center gap-2 text-xs text-bd-text-secondary">
        <span>Speed:</span>
        <select
          value={speed}
          onChange={(e) => controls.setSpeed(Number(e.target.value))}
          className="bg-bd-raised border border-bd-border rounded px-2 py-1 text-bd-text-primary text-xs"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      <div className="flex-1 mx-4">
        <div className="h-1.5 bg-bd-raised rounded-full overflow-hidden">
          <div
            className="h-full bg-bd-cyan transition-all duration-150 ease-crystal rounded-full"
            style={{ width: `${totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      <span className="text-xs text-bd-text-muted font-mono">
        {currentStep + 1} / {totalSteps}
      </span>
    </div>
  );
}
