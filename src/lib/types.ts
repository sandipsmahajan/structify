export type Difficulty = "Easy" | "Medium" | "Hard";

export type LessonSectionId =
  | "Overview"
  | "Motivation"
  | "Problem Statement"
  | "Real-world Example"
  | "Interactive Visualization"
  | "Step-by-step Animation"
  | "Complexity Analysis"
  | "Dry Run"
  | "Pseudo Code"
  | "Java"
  | "Python"
  | "C++"
  | "JavaScript"
  | "Interactive Playground"
  | "Quiz"
  | "Practice Problems"
  | "Interview Questions"
  | "Common Mistakes"
  | "Summary"
  | "Related Lessons";

export type VisualizationEvent = {
  id: string;
  label: string;
  explanation: string;
  activeIndexes: number[];
  values: number[];
  codeLine: number;
  operationCount?: number;
  memoryUnits?: number;
};

export type CodeExamples = Record<"Java" | "Python" | "C++" | "JavaScript" | "Go", string>;

export type QuizQuestion = {
  type: "MCQ" | "Drag and Drop" | "True/False" | "Predict Output";
  prompt: string;
  options: string[];
  answer: string;
};

export type PracticeProblem = {
  title: string;
  difficulty: Difficulty;
  pattern: string;
  company: string;
  acceptance: number;
};

export type Lesson = {
  slug: string;
  title: string;
  course: string;
  duration: string;
  xp: number;
  summary: string;
  prerequisites: string[];
  sections: Record<LessonSectionId, string[]>;
  examples: string[];
  visualization: VisualizationEvent[];
  code: CodeExamples;
  quiz: QuizQuestion[];
  practice: PracticeProblem[];
  interview: string[];
  nextLesson?: string;
  unlockRequirements?: string[];
};

export type Course = {
  id: string;
  title: string;
  level: "Foundation" | "Core" | "Advanced" | "Interview";
  status: "available" | "locked" | "completed";
  progress: number;
  prerequisites: string[];
  lessons: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  excerpt: string;
};
