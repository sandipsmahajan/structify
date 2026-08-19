import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HorizontalCards, InfoCard, JourneyMap, PlanCard, PrimaryButton, Section, StatPill } from '../src/components/landing';
import { engineSteps, features, plans, progressStages, realLifeExamples, roadmap, stats, testimonials, topics } from '../src/content/landing';
import { theme } from '../src/theme';

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
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
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
