import type { ComponentProps } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type LandingCard = {
  title: string;
  description: string;
  icon: IconName;
  color: string;
};

export const stats = [
  { value: '400+', label: 'Concepts', icon: 'atom' as IconName },
  { value: '2500+', label: 'Problems', icon: 'clipboard-check-outline' as IconName },
  { value: '100+', label: 'Scenarios', icon: 'briefcase-check-outline' as IconName },
  { value: '50+', label: 'Patterns', icon: 'trophy-outline' as IconName },
];

export const topics = [
  { title: 'Arrays', color: '#EA580C', icon: 'view-grid-outline' as IconName },
  { title: 'Linked List', color: '#16A34A', icon: 'link-variant' as IconName },
  { title: 'Stack', color: '#2563EB', icon: 'layers-outline' as IconName },
  { title: 'Queue', color: '#7C3AED', icon: 'format-list-numbered' as IconName },
  { title: 'Trees', color: '#15803D', icon: 'graph-outline' as IconName },
  { title: 'Graphs', color: '#4F46E5', icon: 'graphql' as IconName },
  { title: 'Heaps', color: '#F59E0B', icon: 'triangle-outline' as IconName },
  { title: 'Hash Table', color: '#EF4444', icon: 'table-key' as IconName },
];

export const roadmap = [
  { title: 'Foundations', description: 'Time complexity, recursion, math, and logic building.', icon: 'compass-outline' as IconName, color: '#7C3AED' },
  { title: 'Linear Data', description: 'Arrays, strings, linked lists, stacks, queues, and deques.', icon: 'view-list-outline' as IconName, color: '#2563EB' },
  { title: 'Hashing', description: 'Hash tables, collision resolution, hash functions, and maps.', icon: 'pound' as IconName, color: '#16A34A' },
  { title: 'Trees', description: 'Binary trees, BST, AVL, red-black trees, and segment trees.', icon: 'file-tree-outline' as IconName, color: '#EA580C' },
  { title: 'Graphs', description: 'BFS, DFS, topological sort, MST, and shortest paths.', icon: 'graphql' as IconName, color: '#4F46E5' },
];

export const features: LandingCard[] = [
  { title: 'Visual First', description: 'Understand concepts through structured animation-style flows.', icon: 'eye-outline', color: '#4F46E5' },
  { title: 'Real World', description: 'Connect each structure to familiar products and workflows.', icon: 'earth', color: '#2563EB' },
  { title: 'Active Practice', description: 'Move from learning to curated challenges without losing context.', icon: 'code-tags', color: '#16A34A' },
  { title: 'Interview Ready', description: 'Master the recurring patterns companies ask for.', icon: 'trophy-outline', color: '#EA580C' },
];

export const engineSteps = [
  { title: 'Story', description: 'Introduce the concept through a simple narrative.', icon: 'book-open-page-variant-outline' as IconName },
  { title: 'Visualize', description: 'See how the structure changes step by step.', icon: 'monitor-play' as IconName },
  { title: 'Simulate', description: 'Try operations and inspect the result.', icon: 'tune-variant' as IconName },
  { title: 'Practice', description: 'Solve focused problems that reinforce the concept.', icon: 'code-braces' as IconName },
  { title: 'Patterns', description: 'Recognize reusable techniques across problems.', icon: 'puzzle-outline' as IconName },
  { title: 'Interview', description: 'Answer production-style questions with confidence.', icon: 'briefcase-outline' as IconName },
];

export const realLifeExamples = [
  { title: 'Arrays', description: 'Spotify playlists', icon: 'playlist-music-outline' as IconName },
  { title: 'Linked List', description: 'Maps routes', icon: 'map-marker-path' as IconName },
  { title: 'Stack', description: 'Browser history', icon: 'archive-arrow-up-outline' as IconName },
  { title: 'Queue', description: 'Printer queue', icon: 'account-group-outline' as IconName },
  { title: 'Tree', description: 'File system', icon: 'folder-tree-outline' as IconName },
  { title: 'Graph', description: 'Social networks', icon: 'graphql' as IconName },
];

export const testimonials = [
  { quote: 'Structify made DSA so visual that I finally understood recursion.', name: 'Ananya Sharma', role: 'SDE at Google' },
  { quote: 'The roadmap helped me stop jumping between random playlists.', name: 'Rohan Verma', role: 'SDE at Microsoft' },
  { quote: 'Practice and patterns in one place made interviews feel manageable.', name: 'Priya Nair', role: 'SWE at Amazon' },
];

export const progressStages = [
  { title: 'Beginner', description: 'Start your journey', icon: 'flag-outline' as IconName },
  { title: 'Adventurer', description: 'Build foundations', icon: 'binoculars' as IconName },
  { title: 'Solver', description: 'Crack complex problems', icon: 'shield-check-outline' as IconName },
  { title: 'Champion', description: 'Get interview ready', icon: 'trophy-award' as IconName },
];

export const plans = [
  { title: 'Monthly', price: '₹499', cadence: '/month', features: ['Full access', 'All concepts', 'Practice problems', 'Progress tracking'] },
  { title: 'Yearly', price: '₹2,999', cadence: '/year', features: ['Everything in Monthly', 'Mock tests', 'Interview patterns', 'Priority support'], popular: true },
  { title: 'Lifetime', price: '₹7,999', cadence: 'once', features: ['One-time payment', 'Everything forever', 'All future updates', 'Lifetime support'] },
];
