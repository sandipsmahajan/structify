import type { AnimationStep, VisualizerData } from "./types";

function generateArraySteps(data: VisualizerData): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const values = [...data.values];

  for (let i = 0; i < values.length; i++) {
    steps.push({
      id: steps.length,
      type: "traverse",
      indices: [i],
      values: [values[i]],
      description: `Access element at index ${i}: ${values[i]}`,
      codeLine: 1,
    });
  }

  steps.push({ id: steps.length, type: "compare", indices: [0, values.length - 1], description: "Scan complete", codeLine: 2 });

  return steps;
}

function generateLinkedListSteps(data: VisualizerData): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const values = [...data.values];

  values.forEach((val, i) => {
    steps.push({
      id: steps.length,
      type: "traverse",
      indices: [i],
      values: [val],
      description: `Visit node ${i} with value ${val}`,
      codeLine: 1,
    });
  });

  return steps;
}

function generateBstSteps(data: VisualizerData): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const values = [...data.values].sort((a, b) => a - b);

  interface BstNode { value: number; left?: BstNode; right?: BstNode; depth: number; index: number }
  const root: BstNode = { value: values[Math.floor(values.length / 2)], depth: 0, index: 0 };

  const insert = (node: BstNode, value: number, idx: number) => {
    steps.push({ id: steps.length, type: "compare", indices: [node.index], values: [value, node.value], description: `Compare ${value} with ${node.value}`, codeLine: 1 });
    if (value < node.value) {
      steps.push({ id: steps.length, type: "traverse", indices: [idx], description: `${value} < ${node.value}, go left`, codeLine: 2 });
    } else if (value > node.value) {
      steps.push({ id: steps.length, type: "traverse", indices: [idx], description: `${value} > ${node.value}, go right`, codeLine: 3 });
    } else {
      return;
    }
    steps.push({ id: steps.length, type: "insert", indices: [idx], values: [value], description: `Insert ${value}`, codeLine: 4 });
  };

  for (let i = 0; i < values.length; i++) {
    if (i !== Math.floor(values.length / 2)) {
      insert(root, values[i], i);
    }
  }

  steps.push({ id: steps.length, type: "traverse", indices: [root.index], values: [root.value], description: "BST constructed", codeLine: 5 });
  return steps;
}

function generateSortingSteps(data: VisualizerData): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const arr = [...data.values];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({ id: steps.length, type: "compare", indices: [j, j + 1], values: [arr[j], arr[j + 1]], description: `Compare ${arr[j]} and ${arr[j + 1]}`, codeLine: 1 });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({ id: steps.length, type: "swap", indices: [j, j + 1], values: [arr[j], arr[j + 1]], description: `Swap ${arr[j]} and ${arr[j + 1]}`, codeLine: 2 });
      }
    }
  }
  return steps;
}

function generateGraphSteps(data: VisualizerData): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const n = data.values.length;
  const visited = new Set<number>();
  const queue: number[] = [0];
  visited.add(0);

  steps.push({ id: steps.length, type: "highlight", indices: [0], values: [data.values[0]], description: "BFS: Start at node 0", codeLine: 1 });

  while (queue.length > 0) {
    const node = queue.shift()!;
    steps.push({ id: steps.length, type: "traverse", indices: [node], values: [data.values[node]], description: `Visit node ${node} (${data.values[node]})`, codeLine: 2 });

    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (neighbor !== node && !visited.has(neighbor) && Math.random() > 0.5) {
        visited.add(neighbor);
        queue.push(neighbor);
        steps.push({ id: steps.length, type: "insert", indices: [node, neighbor], values: [data.values[node], data.values[neighbor]], description: `Add edge ${node}→${neighbor}`, codeLine: 3 });
      }
    }
  }
  return steps;
}

export function generateAnimationSteps(data: VisualizerData): AnimationStep[] {
  switch (data.structureType) {
    case "array": return generateArraySteps(data);
    case "linked-list": return generateLinkedListSteps(data);
    case "bst": return generateBstSteps(data);
    case "sorting": return generateSortingSteps(data);
    case "graph": return generateGraphSteps(data);
    default: return [];
  }
}
