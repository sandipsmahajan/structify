# Structify Mobile Landing Design

## Goal

Build a new Expo React Native app that adapts the provided `references/landing_page.png` into a polished mobile-first landing page for Structify, a visual DSA learning product.

## Approved Approach

Use a mobile-native adaptation rather than an exact desktop clone. Preserve the reference page's brand, content hierarchy, playful educational tone, and broad section coverage, while converting wide desktop rows into readable vertical sections and horizontal carousels suitable for phone screens.

## Stack

- Expo with TypeScript
- React Native functional components
- `expo-router` for app structure
- `react-native-safe-area-context` for safe areas
- `react-native-reanimated` for subtle entrance and press motion where useful
- `@expo/vector-icons` for consistent vector icons

## Visual System

- Style: playful educational claymorphism with soft surfaces, rounded cards, restrained depth, and clear structure.
- Primary color: indigo `#4F46E5`.
- Accent color: orange `#EA580C` for CTAs and selected highlight moments.
- Background: soft indigo tint `#EEF2FF` with white elevated surfaces.
- Text: dark navy `#1E1B4B` for strong readability.
- Typography: use system fonts by default for reliability; use heavier weights and friendly spacing to evoke the reference without adding font-loading complexity.
- Icons: vector icons only, no emoji icons.

## Screen Structure

1. Safe-area header with logo mark, Structify wordmark, and compact action controls.
2. Hero section with large headline, short value copy, primary CTA, secondary roadmap action, and feature chips.
3. Journey map visual recreated as layered React Native shapes and topic badges for Arrays, Linked List, Stack, Queue, Trees, Graphs, Heaps, and Hash Table.
4. Stat strip for concepts, practice problems, scenarios, interview patterns, and progress tracking.
5. DSA roadmap section with horizontally scrollable topic cards.
6. Differentiators section with concise benefit cards.
7. Learning engine section showing the six-step progression from story to interview readiness.
8. Real-life DSA examples section with compact cards.
9. Testimonials and progress journey sections adapted into swipeable or stacked cards.
10. Pricing and final CTA section with three plan cards and a strong learning CTA.

## Interaction And Accessibility

- All pressable controls must provide visible pressed feedback.
- Touch targets should be at least 44x44 points.
- Text must wrap cleanly on small devices without clipping.
- Section content must remain accessible with readable contrast.
- Icons and controls should include accessibility labels where the visual alone is not enough.
- Motion should be subtle and non-blocking.

## Verification

- Install dependencies successfully.
- Run the TypeScript or Expo validation command available in the scaffold.
- Start the development server for preview if the environment supports it.
- Check that the landing screen renders without missing imports or runtime syntax errors.

## Scope Boundaries

- This is a static landing page implementation; no backend, authentication, payments, or real course data integration.
- Visual map elements are recreated with native layout primitives and icons rather than requiring the exact bitmap illustration.
- Pricing buttons and navigation actions can be presentational unless a routing target already exists.
