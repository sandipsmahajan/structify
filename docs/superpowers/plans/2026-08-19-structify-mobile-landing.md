# Structify Mobile Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new Expo React Native app that adapts `references/landing_page.png` into a polished, mobile-native Structify landing page.

**Architecture:** Create a small Expo app with a single routed home screen. Keep content arrays in `src/content/landing.ts`, reusable view primitives in `src/components/landing.tsx`, and the screen assembly in `app/index.tsx` so layout data and presentation stay easy to review.

**Tech Stack:** Expo, React Native, TypeScript, expo-router, react-native-safe-area-context, @expo/vector-icons, react-native-reanimated.

## Global Constraints

- Use a mobile-native adaptation rather than an exact desktop clone.
- Preserve the reference page's brand, content hierarchy, playful educational tone, and broad section coverage.
- Convert wide desktop rows into readable vertical sections and horizontal carousels suitable for phone screens.
- Use vector icons only, no emoji icons.
- All pressable controls must provide visible pressed feedback.
- Touch targets should be at least 44x44 points.
- Text must wrap cleanly on small devices without clipping.
- This is a static landing page implementation; no backend, authentication, payments, or real course data integration.

---

## File Structure

- Create `package.json`: Expo scripts and runtime dependencies.
- Create `app.json`: Expo app metadata.
- Create `tsconfig.json`: Expo TypeScript configuration.
- Create `babel.config.js`: Expo and Reanimated Babel configuration.
- Create `app/_layout.tsx`: Root router layout.
- Create `app/index.tsx`: Landing screen composition.
- Create `src/content/landing.ts`: Typed arrays for topics, roadmap, stats, examples, testimonials, pricing, and journey steps.
- Create `src/components/landing.tsx`: Reusable cards, buttons, chips, section wrappers, and map visual.
- Create `src/theme.ts`: Shared color, spacing, and shadow tokens.

---

### Task 1: Scaffold Expo App

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `app/_layout.tsx`

**Interfaces:**
- Produces: Expo app shell with `npm run typecheck` and `npm start` scripts.
- Produces: root router that renders `app/index.tsx` when Task 4 creates it.

- [ ] **Step 1: Create scaffold files**

```json
{
  "scripts": {
    "start": "expo start --web --host 0.0.0.0",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@expo/vector-icons": "^14.0.4",
    "expo": "^52.0.0",
    "expo-router": "^4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-gesture-handler": "^2.20.2",
    "react-native-reanimated": "^3.16.1",
    "react-native-safe-area-context": "^4.12.0",
    "react-native-screens": "^4.1.0",
    "typescript": "^5.3.3"
  },
  "devDependencies": {}
}
```

```json
{
  "expo": {
    "name": "Structify Mobile",
    "slug": "structify-mobile",
    "scheme": "structify",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "plugins": ["expo-router"],
    "web": {
      "bundler": "metro"
    }
  }
}
```

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["app", "src"]
}
```

```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

```tsx
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Run scaffold validation**

Run: `npm run typecheck`
Expected: typecheck fails because `app/index.tsx` does not exist yet, or passes if Expo accepts an empty route tree.

---

### Task 2: Add Theme And Content Model

**Files:**
- Create: `src/theme.ts`
- Create: `src/content/landing.ts`

**Interfaces:**
- Produces: `theme` object with colors, spacing, radii, and shadows.
- Produces: named arrays `stats`, `roadmap`, `features`, `engineSteps`, `realLifeExamples`, `testimonials`, `progressStages`, and `plans`.
- Consumes: no app-specific code from previous tasks.

- [ ] **Step 1: Create theme tokens**

```ts
export const theme = {
  colors: {
    background: '#EEF2FF',
    surface: '#FFFFFF',
    surfaceSoft: '#F8FAFF',
    primary: '#4F46E5',
    primaryDark: '#3730A3',
    secondary: '#818CF8',
    accent: '#EA580C',
    green: '#16A34A',
    pink: '#DB2777',
    cyan: '#0891B2',
    text: '#1E1B4B',
    muted: '#5B5F7A',
    border: '#C7D2FE',
    white: '#FFFFFF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  shadow: {
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 6,
  },
} as const;
```

- [ ] **Step 2: Create typed content arrays**

```ts
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
```

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`
Expected: fails only if `app/index.tsx` is still missing; content and theme files should not report type errors.

---

### Task 3: Build Landing Components

**Files:**
- Create: `src/components/landing.tsx`

**Interfaces:**
- Consumes: `theme` from `src/theme.ts`.
- Consumes: `topics` item shape from `src/content/landing.ts`.
- Produces: `PrimaryButton`, `Section`, `InfoCard`, `HorizontalCards`, `JourneyMap`, `StatPill`, and `PlanCard`.

- [ ] **Step 1: Create reusable landing components**

```tsx
import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { IconName, LandingCard, topics } from '@/content/landing';
import { theme } from '@/theme';

type Topic = (typeof topics)[number];

export function PrimaryButton({ label, variant = 'primary' }: { label: string; variant?: 'primary' | 'secondary' }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.button, variant === 'secondary' && styles.secondaryButton, pressed && styles.pressed]}
    >
      <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryButtonText]}>{label}</Text>
      <MaterialCommunityIcons name="arrow-right" size={18} color={variant === 'secondary' ? theme.colors.primary : theme.colors.white} />
    </Pressable>
  );
}

export function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

export function InfoCard({ item }: { item: LandingCard }) {
  return (
    <View style={styles.infoCard}>
      <View style={[styles.iconBubble, { backgroundColor: `${item.color}18` }]}>
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.description}</Text>
    </View>
  );
}

export function HorizontalCards({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
      {children}
    </ScrollView>
  );
}

export function StatPill({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  return (
    <View style={styles.statPill}>
      <MaterialCommunityIcons name={icon} size={20} color={theme.colors.primary} />
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

export function JourneyMap({ items }: { items: Topic[] }) {
  const [selected, setSelected] = useState(items[0]?.title ?? 'Arrays');

  return (
    <View style={styles.mapCard}>
      <Text style={styles.mapEyebrow}>Your DSA journey starts here</Text>
      <View style={styles.mapIsland}>
        <View style={styles.pathLine} />
        {items.map((item, index) => {
          const isSelected = selected === item.title;
          return (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${item.title} topic`}
              onPress={() => setSelected(item.title)}
              style={({ pressed }) => [
                styles.topicBadge,
                { backgroundColor: item.color, transform: [{ translateY: index % 2 === 0 ? -8 : 12 }] },
                isSelected && styles.topicSelected,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name={item.icon} size={16} color={theme.colors.white} />
              <Text style={styles.topicText}>{item.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function PlanCard({ plan }: { plan: { title: string; price: string; cadence: string; features: string[]; popular?: boolean } }) {
  return (
    <View style={[styles.planCard, plan.popular && styles.popularPlan]}>
      {plan.popular ? <Text style={styles.popularLabel}>Most Popular</Text> : null}
      <Text style={styles.planTitle}>{plan.title}</Text>
      <Text style={styles.planPrice}>{plan.price} <Text style={styles.planCadence}>{plan.cadence}</Text></Text>
      {plan.features.map((feature) => (
        <View key={feature} style={styles.planFeature}>
          <MaterialCommunityIcons name="check-circle-outline" size={17} color={theme.colors.green} />
          <Text style={styles.planFeatureText}>{feature}</Text>
        </View>
      ))}
      <PrimaryButton label="Get Started" variant={plan.popular ? 'primary' : 'secondary'} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: theme.spacing.xxl, gap: theme.spacing.md },
  sectionTitle: { color: theme.colors.text, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  sectionSubtitle: { color: theme.colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  button: { minHeight: 48, borderRadius: theme.radius.md, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, backgroundColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm, ...theme.shadow },
  secondaryButton: { backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, shadowOpacity: 0.04 },
  buttonText: { color: theme.colors.white, fontWeight: '800', fontSize: 14 },
  secondaryButtonText: { color: theme.colors.primary },
  pressed: { opacity: 0.78 },
  infoCard: { width: 170, minHeight: 150, backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, ...theme.shadow, shadowOpacity: 0.07 },
  iconBubble: { width: 48, height: 48, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { marginTop: theme.spacing.md, color: theme.colors.text, fontSize: 15, fontWeight: '800' },
  cardText: { marginTop: theme.spacing.xs, color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
  horizontalCards: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.xs, paddingVertical: theme.spacing.sm },
  statPill: { minWidth: 132, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, backgroundColor: theme.colors.white, borderRadius: theme.radius.md, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border },
  statValue: { color: theme.colors.text, fontWeight: '900', fontSize: 14 },
  statLabel: { color: theme.colors.muted, fontSize: 11, marginTop: 1 },
  mapCard: { backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, ...theme.shadow },
  mapEyebrow: { textAlign: 'center', color: theme.colors.primaryDark, fontSize: 13, fontWeight: '800', marginBottom: theme.spacing.lg },
  mapIsland: { minHeight: 230, borderRadius: 28, backgroundColor: '#DCFCE7', padding: theme.spacing.lg, flexDirection: 'row', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: theme.spacing.md, overflow: 'hidden' },
  pathLine: { position: 'absolute', top: 108, left: 20, right: 20, height: 8, borderRadius: 99, backgroundColor: '#FDE68A', transform: [{ rotate: '-8deg' }] },
  topicBadge: { minHeight: 44, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 2, borderColor: 'rgba(255,255,255,0.76)' },
  topicSelected: { borderColor: theme.colors.text },
  topicText: { color: theme.colors.white, fontWeight: '900', fontSize: 12 },
  planCard: { width: 244, backgroundColor: theme.colors.white, borderRadius: theme.radius.lg, padding: theme.spacing.lg, borderWidth: 1, borderColor: theme.colors.border, gap: theme.spacing.md, ...theme.shadow, shadowOpacity: 0.07 },
  popularPlan: { borderColor: theme.colors.accent, borderWidth: 2 },
  popularLabel: { alignSelf: 'flex-start', backgroundColor: '#FFEDD5', color: theme.colors.accent, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: 4, fontSize: 11, fontWeight: '900' },
  planTitle: { color: theme.colors.text, fontSize: 16, fontWeight: '800' },
  planPrice: { color: theme.colors.primaryDark, fontSize: 26, fontWeight: '900' },
  planCadence: { color: theme.colors.muted, fontSize: 12, fontWeight: '700' },
  planFeature: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  planFeatureText: { color: theme.colors.muted, fontSize: 13, flex: 1 },
});
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: component file has no type errors; route may still be missing until Task 4.

---

### Task 4: Assemble Landing Screen

**Files:**
- Create: `app/index.tsx`

**Interfaces:**
- Consumes: all content arrays from `src/content/landing.ts`.
- Consumes: all component exports from `src/components/landing.tsx`.
- Produces: complete static landing screen.

- [ ] **Step 1: Create landing screen**

```tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { features, engineSteps, plans, progressStages, realLifeExamples, roadmap, stats, testimonials, topics } from '@/content/landing';
import { HorizontalCards, InfoCard, JourneyMap, PlanCard, PrimaryButton, Section, StatPill } from '@/components/landing';
import { theme } from '@/theme';

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <MaterialCommunityIcons name="cube-outline" size={28} color={theme.colors.white} />
          </View>
          <View style={styles.brandTextWrap}>
            <Text style={styles.brand}>Structify</Text>
            <Text style={styles.tagline}>Visualize. Understand. Master DSA.</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Interactive DSA learning</Text>
          <Text style={styles.headline}>The visual way to master Data Structures & Algorithms</Text>
          <Text style={styles.heroCopy}>Learn from scratch to advanced with animation-style journeys, real world examples, and hands-on practice designed for interview readiness.</Text>
          <View style={styles.heroActions}>
            <PrimaryButton label="Start Learning" />
            <PrimaryButton label="Roadmap" variant="secondary" />
          </View>
          <View style={styles.chips}>
            {['Animations', 'Real World', 'Hands-on', 'Interview'].map((chip) => (
              <View key={chip} style={styles.chip}><Text style={styles.chipText}>{chip}</Text></View>
            ))}
          </View>
        </View>

        <JourneyMap items={topics} />

        <HorizontalCards>
          {stats.map((stat) => <StatPill key={stat.label} {...stat} />)}
        </HorizontalCards>

        <Section title="Complete DSA Roadmap" subtitle="From foundations to advanced problem solving techniques, structured for a smooth learning journey.">
          <HorizontalCards>
            {roadmap.map((item) => <InfoCard key={item.title} item={item} />)}
          </HorizontalCards>
        </Section>

        <Section title="Why Structify is different">
          <HorizontalCards>
            {features.map((item) => <InfoCard key={item.title} item={item} />)}
          </HorizontalCards>
        </Section>

        <Section title="The learning engine" subtitle="A six-step model that turns abstract structures into memorable problem-solving patterns.">
          <View style={styles.engineGrid}>
            {engineSteps.map((step, index) => (
              <View key={step.title} style={styles.engineCard}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <MaterialCommunityIcons name={step.icon} size={28} color={theme.colors.primary} />
                <Text style={styles.engineTitle}>{step.title}</Text>
                <Text style={styles.engineText}>{step.description}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="DSA in real life">
          <View style={styles.exampleGrid}>
            {realLifeExamples.map((example) => (
              <View key={example.title} style={styles.exampleCard}>
                <MaterialCommunityIcons name={example.icon} size={26} color={theme.colors.primary} />
                <Text style={styles.exampleTitle}>{example.title}</Text>
                <Text style={styles.exampleText}>{example.description}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Loved by learners everywhere">
          <HorizontalCards>
            {testimonials.map((testimonial) => (
              <View key={testimonial.name} style={styles.testimonialCard}>
                <MaterialCommunityIcons name="format-quote-open" size={28} color={theme.colors.primary} />
                <Text style={styles.quote}>{testimonial.quote}</Text>
                <Text style={styles.person}>{testimonial.name}</Text>
                <Text style={styles.role}>{testimonial.role}</Text>
              </View>
            ))}
          </HorizontalCards>
        </Section>

        <Section title="Your progress, your victory">
          <View style={styles.progressGrid}>
            {progressStages.map((stage) => (
              <View key={stage.title} style={styles.progressCard}>
                <MaterialCommunityIcons name={stage.icon} size={30} color={theme.colors.accent} />
                <Text style={styles.progressTitle}>{stage.title}</Text>
                <Text style={styles.progressText}>{stage.description}</Text>
              </View>
            ))}
          </View>
        </Section>

        <View style={styles.ctaBand}>
          <MaterialCommunityIcons name="trophy-outline" size={52} color="#FDE68A" />
          <Text style={styles.ctaTitle}>Ready to master DSA?</Text>
          <Text style={styles.ctaText}>Join structured lessons, visual examples, and interview-focused practice in one place.</Text>
          <PrimaryButton label="Start Learning for Free" />
        </View>

        <Section title="Choose your plan">
          <HorizontalCards>
            {plans.map((plan) => <PlanCard key={plan.title} plan={plan} />)}
          </HorizontalCards>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  screen: { flex: 1 },
  content: { paddingHorizontal: theme.spacing.lg, paddingBottom: 48 },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  brandMark: { width: 44, height: 44, borderRadius: 16, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', ...theme.shadow },
  brandTextWrap: { flex: 1 },
  brand: { color: theme.colors.text, fontSize: 22, fontWeight: '900' },
  tagline: { color: theme.colors.muted, fontSize: 11, marginTop: 2 },
  hero: { paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.xl, gap: theme.spacing.md },
  eyebrow: { alignSelf: 'flex-start', color: theme.colors.primary, fontSize: 13, fontWeight: '900', backgroundColor: theme.colors.white, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: 7, overflow: 'hidden' },
  headline: { color: theme.colors.text, fontSize: 40, lineHeight: 45, fontWeight: '900' },
  heroCopy: { color: theme.colors.muted, fontSize: 15, lineHeight: 23 },
  heroActions: { gap: theme.spacing.md, marginTop: theme.spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  chip: { backgroundColor: theme.colors.white, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.pill, paddingHorizontal: theme.spacing.md, paddingVertical: 8 },
  chipText: { color: theme.colors.primaryDark, fontWeight: '800', fontSize: 12 },
  engineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  engineCard: { width: '47.8%', minHeight: 174, backgroundColor: theme.colors.white, borderRadius: theme.radius.md, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, gap: theme.spacing.sm },
  stepNumber: { alignSelf: 'flex-start', backgroundColor: theme.colors.primary, color: theme.colors.white, borderRadius: theme.radius.pill, paddingHorizontal: 9, paddingVertical: 4, fontSize: 11, fontWeight: '900', overflow: 'hidden' },
  engineTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
  engineText: { color: theme.colors.muted, fontSize: 12, lineHeight: 17 },
  exampleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  exampleCard: { width: '47.8%', minHeight: 124, backgroundColor: theme.colors.white, borderRadius: theme.radius.md, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
  exampleTitle: { color: theme.colors.text, fontWeight: '900', fontSize: 14 },
  exampleText: { color: theme.colors.muted, fontSize: 11, textAlign: 'center' },
  testimonialCard: { width: 260, backgroundColor: theme.colors.white, borderRadius: theme.radius.lg, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.lg, gap: theme.spacing.sm },
  quote: { color: theme.colors.text, fontSize: 14, lineHeight: 21, fontWeight: '600' },
  person: { color: theme.colors.text, fontWeight: '900', marginTop: theme.spacing.sm },
  role: { color: theme.colors.muted, fontSize: 12 },
  progressGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  progressCard: { width: '47.8%', backgroundColor: theme.colors.white, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, padding: theme.spacing.md, alignItems: 'center', minHeight: 126, justifyContent: 'center', gap: 6 },
  progressTitle: { color: theme.colors.text, fontSize: 14, fontWeight: '900' },
  progressText: { color: theme.colors.muted, fontSize: 11, textAlign: 'center' },
  ctaBand: { marginTop: theme.spacing.xxl, borderRadius: 28, padding: theme.spacing.xl, backgroundColor: theme.colors.primary, gap: theme.spacing.md, alignItems: 'flex-start', ...theme.shadow },
  ctaTitle: { color: theme.colors.white, fontSize: 28, lineHeight: 33, fontWeight: '900' },
  ctaText: { color: '#E0E7FF', fontSize: 14, lineHeight: 21 },
});
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: PASS with no TypeScript errors.

---

### Task 5: Verify And Preview

**Files:**
- Modify only if verification reveals a concrete bug in previous files.

**Interfaces:**
- Consumes: complete app from Tasks 1-4.
- Produces: verified app and preview URL if the dev server starts.

- [ ] **Step 1: Run TypeScript verification**

Run: `npm run typecheck`
Expected: PASS with no TypeScript errors.

- [ ] **Step 2: Start Expo web server**

Run: `npm start`
Expected: Expo web server starts successfully and serves the landing app.

- [ ] **Step 3: Inspect preview manually**

Expected: page shows mobile Structify landing screen with hero, map, roadmap, differentiators, learning engine, examples, testimonials, progress, CTA, and pricing. No missing import errors or red error overlay should appear.

---

## Self-Review

- Spec coverage: app scaffold, visual system, hero, map, stats, roadmap, differentiators, learning engine, real-life examples, testimonials, progress, pricing, interaction, accessibility, and verification are covered.
- Placeholder scan: no placeholder sections remain.
- Type consistency: `IconName`, `LandingCard`, `theme`, content arrays, and component prop names are consistent across tasks.
