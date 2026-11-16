import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import {
  DailyProgressCard,
  WeeklyActivityCard,
} from '@/components/dashboard-cards';
import HabitCard from '@/components/habit-card';
import { useHabits } from '@/hooks/use-habits';
import { flameGlyph, svg } from '@/theme/icons';
import { categoryForHabit, colors, effects, radii, withFonts } from '@/theme/ritual';

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { habits, stats, toggle, remove } = useHabits();
  const [busyId, setBusyId] = useState(null);

  const handleToggle = async (habit) => {
    if (busyId) return;
    setBusyId(habit.id);
    await toggle(habit);
    setBusyId(null);
  };

  const handleRemove = async (habit) => {
    if (busyId) return;
    setBusyId(habit.id);
    await remove(habit.id);
    setBusyId(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
    >
      <Text style={styles.brand}>P R O G R E S O</Text>
      <Text style={styles.h1}>Tu constancia,{'\n'}día a día.</Text>

      <View style={styles.dashboard}>
        <DailyProgressCard
          percent={stats.percent}
          level={Math.max(1, stats.completed + 1)}
          streakDays={stats.streakDays}
          style={styles.dashLeft}
        />
        <View style={styles.dashRight}>
          <WeeklyActivityCard />
          <View style={styles.streakCard}>
            <SvgXml xml={svg(flameGlyph, colors.streak)} width={15} height={15} />
            <View style={styles.streakCopy}>
              <Text style={styles.streakLabel}>RACHA ACTUAL</Text>
              <Text style={styles.streakValue}>
                {stats.streakDays} {stats.streakDays === 1 ? 'día' : 'días'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.summary}>
        <SummaryTile label="HECHOS" value={`${stats.completed}`} tone="#7DDED7" />
        <SummaryTile label="TOTAL" value={`${stats.total}`} tone="#BBA0F0" />
        <SummaryTile label="RESTANTES" value={`${stats.total - stats.completed}`} tone="#EEC28A" />
      </View>

      <Text style={styles.sectionTitle}>Rendimiento</Text>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Todavía no hay hábitos que seguir.
          </Text>
        </View>
      ) : (
        habits.map((habit, index) => (
          <View key={habit.id} style={styles.row}>
            <HabitCard
              habit={habit}
              category={categoryForHabit(habit, index)}
              onToggle={handleToggle}
              onRemove={handleRemove}
              busy={busyId === habit.id}
            />
          </View>
        ))
      )}
    </ScrollView>
  );
}

function SummaryTile({ label, value, tone }) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileValue, { color: tone }]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = withFonts(StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingBottom: 124,
  },
  brand: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.brand,
  },
  h1: {
    marginTop: 12,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.9,
    color: colors.heading,
  },
  dashboard: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
  },
  dashLeft: { width: '55.1%' },
  dashRight: { flex: 1, gap: 12 },
  streakCard: {
    height: 71,
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...effects.glass,
  },
  streakCopy: { flex: 1 },
  streakLabel: {
    fontSize: 7,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.mutedAlt,
  },
  streakValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.streak,
  },
  summary: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    height: 78,
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    alignItems: 'center',
    justifyContent: 'center',
    ...effects.glass,
  },
  tileValue: {
    fontSize: 23,
    fontWeight: '600',
    letterSpacing: -0.6,
  },
  tileLabel: {
    marginTop: 4,
    fontSize: 7,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.muted,
  },
  sectionTitle: {
    marginTop: 26,
    marginBottom: 14,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: -0.7,
    color: colors.headingAlt,
  },
  row: { marginBottom: 10 },
  empty: {
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    paddingVertical: 26,
    alignItems: 'center',
    ...effects.glass,
  },
  emptyText: {
    fontSize: 11,
    color: colors.body,
  },
}));
