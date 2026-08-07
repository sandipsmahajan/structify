"use client";

import { DiamondButton } from "@/components/ui/diamond-button";

interface Props {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  customInput: string;
  onInputChange: (val: string) => void;
  onApply: () => void;
  onPreset: (values: number[]) => void;
  presets: { label: string; values: number[] }[];
}

export function ControlsPanel({
  isPlaying, currentStep, totalSteps, speed,
  onPlay, onPause, onStepForward, onStepBack, onReset,
  onSpeedChange,
  customInput, onInputChange, onApply,
  presets, onPreset,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <DiamondButton variant="ghost" size="sm" onClick={onReset} disabled={currentStep === 0}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" /><rect x="14" y="6" width="4" height="12" /></svg>
        </DiamondButton>

        <DiamondButton variant="ghost" size="sm" onClick={onStepBack} disabled={currentStep === 0}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" /><polygon points="18,6 14,12 18,18" /></svg>
        </DiamondButton>

        <DiamondButton variant={isPlaying ? "ghost" : "primary"} size="sm" onClick={isPlaying ? onPause : onPlay}>
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
          )}
        </DiamondButton>

        <DiamondButton variant="ghost" size="sm" onClick={onStepForward} disabled={currentStep >= totalSteps}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="14" y="6" width="4" height="12" /><polygon points="6,6 10,12 6,18" /></svg>
        </DiamondButton>

        <DiamondButton variant="ghost" size="sm" onClick={() => { onReset(); onPlay(); }} disabled={currentStep >= totalSteps}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="10,4 4,12 10,20" /><polygon points="18,4 12,12 18,20" /></svg>
        </DiamondButton>

        <div className="w-px h-6 bg-bd-border" />

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-bd-text-muted">Speed</span>
          <input type="range" min="1" max="10" value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} className="w-20 accent-bd-cyan" />
          <span className="text-[10px] text-bd-text-muted font-mono w-4">{speed}x</span>
        </div>

        <div className="text-xs text-bd-text-muted font-mono ml-auto">
          Step {currentStep} / {totalSteps}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onApply()}
          placeholder="e.g. 10,25,5,80,45"
          className="flex-1 max-w-xs bg-bd-bg border border-bd-border rounded px-3 py-1.5 text-xs font-mono text-bd-text-primary placeholder:text-bd-text-muted focus:outline-none focus:border-bd-cyan/50"
        />
        <DiamondButton variant="secondary" size="sm" onClick={onApply}>Apply</DiamondButton>
        <DiamondButton variant="ghost" size="sm" onClick={() => onPreset(presets[0]?.values ?? [])}>Reset</DiamondButton>
      </div>

      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] text-bd-text-muted leading-6">Scenarios:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => onPreset(p.values)}
              className="text-[10px] px-2 py-1 rounded border border-bd-border hover:border-bd-cyan/40 text-bd-text-secondary hover:text-bd-cyan transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
