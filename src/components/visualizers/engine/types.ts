export interface ArrayStep {
  type: "visit" | "highlight" | "insert" | "delete" | "compare" | "swap" | "reset";
  index: number;
  value?: number;
  description: string;
  codeLine: number;
}

export interface ArrayConfig {
  initialValues: number[];
  steps: ArrayStep[];
}

export interface PlaybackState {
  isPlaying: boolean;
  currentStep: number;
  speed: number;
}
