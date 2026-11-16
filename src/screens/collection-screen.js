import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { useHabits } from '@/hooks/use-habits';
import { checkMark, svg } from '@/theme/icons';
import {
  categoryForHabit,
  colors,
  effects,
  hexA,
  parseDays,
  radii,
  withFonts,
  WEEK_LETTERS,
} from '@/theme/ritual';

export default function CollectionScreen() {
  const insets = useSafeAreaInsets();
  const { habits, loading, stats, toggle } = useHabits();
  const [busyId, setBusyId] = useState(null);

  const handleToggle = async (habit) => {
    if (busyId) return;
    setBusyId(habit.id);
    await toggle(habit);
    setBusyId(null);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
    >
      <Text style={styles.brand}>C O L E C C I Ó N</Text>
      <Text style={styles.h1}>Todos tus hábitos.</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          {stats.total} {stats.total === 1 ? 'hábito' : 'hábitos'} guardados
        </Text>
        <View style={styles.count}>
          <Text style={styles.countText}>
            {stats.completed} / {stats.total}
          </Text>
        </View>
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            {loading ? 'Cargando colección…' : 'Tu colección está vacía'}
          </Text>
          <Text style={styles.emptyBody}>
            Crea tu primer hábito en la pestaña “Hoy” y aparecerá aquí.
          </Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {habits.map((habit, index) => {
            const category = categoryForHabit(habit, index);
            const days = parseDays(habit.days_of_week);
            const done = Boolean(habit.is_completed);
            const busy = busyId === habit.id;

            return (
              <View key={habit.id} style={styles.cardWrap}>
                <View
                  style={[
                    styles.card,
                    { borderColor: hexA(category.color, 0.22) },
                  ]}
                >
                  <View style={styles.cardTop}>
                    <View
                      style={[styles.badge, { backgroundColor: hexA(category.color, 0.1) }]}
                    >
                      <Text style={[styles.badgeText, { color: category.color }]}>
                        {category.label}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() => handleToggle(habit)}
                      disabled={busy}
                      hitSlop={8}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: done }}
                      accessibilityLabel={`Marcar ${habit.name} como ${
                        done ? 'pendiente' : 'completado'
                      }`}
                      style={[
                        styles.check,
                        done
                          ? {
                              backgroundColor: hexA(category.color, 0.15),
                              borderColor: hexA(category.color, 0.5),
                            }
                          : {
                              backgroundColor: colors.chipIdleFill,
                              borderColor: colors.chipIdleStroke,
                            },
                      ]}
                    >
                      {done && (
                        <SvgXml xml={svg(checkMark, category.color)} width={16} height={16} />
                      )}
                    </Pressable>
                  </View>

                  <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                    {habit.name}
                  </Text>

                  <View style={styles.days}>
                    {WEEK_LETTERS.map((letter) => {
                      const active = days.includes(letter);
                      return (
                        <View
                          key={letter}
                          style={[
                            styles.chip,
                            active
                              ? {
                                  backgroundColor: hexA(category.color, 0.1),
                                  borderColor: hexA(category.color, 0.22),
                                }
                              : {
                                  backgroundColor: colors.chipIdleFill,
                                  borderColor: colors.chipIdleStroke,
                                },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: active ? category.color : colors.dim },
                            ]}
                          >
                            {letter}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  <Text style={styles.status}>
                    {done ? 'Completado' : 'Pendiente'} · {days.length}{' '}
                    {days.length === 1 ? 'día' : 'días'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
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
  metaRow: {
    marginTop: 20,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 11,
    color: colors.body,
  },
  count: {
    height: 21,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 200, 134, 0.09)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.tabActive,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrap: {
    width: '48.4%',
  },
  card: {
    minHeight: 148,
    borderRadius: radii.glass,
    borderWidth: 1,
    backgroundColor: colors.glassFill,
    padding: 14,
    ...effects.glass,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    height: 15,
    borderRadius: radii.badge,
    paddingHorizontal: 7,
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 1,
  },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  name: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.cardTitle,
    minHeight: 36,
  },
  days: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  chip: {
    width: 20,
    height: 18,
    borderRadius: radii.chip,
    borderWidth: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 7,
    fontWeight: '500',
  },
  status: {
    marginTop: 10,
    fontSize: 9,
    color: colors.body,
  },
  empty: {
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    ...effects.glass,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.cardTitle,
  },
  emptyBody: {
    marginTop: 6,
    fontSize: 11,
    textAlign: 'center',
    color: colors.body,
  },
}));
