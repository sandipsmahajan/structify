import { ReactNode, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { IconName, LandingCard } from '../content/landing';
import { theme } from '../theme';

type Topic = { title: string; color: string; icon: IconName };

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
      <Text style={styles.planPrice}>
        {plan.price} <Text style={styles.planCadence}>{plan.cadence}</Text>
      </Text>
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
