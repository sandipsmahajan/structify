export type StructureType = "array" | "linked-list" | "bst" | "sorting" | "graph";

export type OperationType =
  | "insert"
  | "delete"
  | "traverse"
  | "sort"
  | "swap"
  | "compare"
  | "highlight"
  | "reset";

export interface AnimationStep {
  id: number;
  type: OperationType;
  indices: number[];
  values?: number[];
  description: string;
  codeLine: number;
}

export interface VisualizerData {
  structureType: StructureType;
  values: number[];
  labels?: string[];
  edges?: [number, number][];
  isDirected?: boolean;
}

export interface VisualizerConfig {
  data: VisualizerData;
  animationSteps: AnimationStep[];
  pseudocode: string[];
  speed: number;
  isPlaying: boolean;
  currentStep: number;
  comparisons: number;
  swaps: number;
}

export interface VisualizerControls {
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setData: (data: VisualizerData) => void;
}
