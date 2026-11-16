import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CreateHabitModal from '@/components/create-habit-modal';
import {
  CreateHabitCard,
  DailyProgressCard,
  WeeklyActivityCard,
} from '@/components/dashboard-cards';
import HabitCard from '@/components/habit-card';
import { buildWeek } from '@/theme/dates';
import { bellGlyph, svg } from '@/theme/icons';
import { useHabits } from '@/hooks/use-habits';
import {
  categoryForLabel,
  colors,
  effects,
  gradients,
  hexA,
  parseDays,
  radii,
  WEEK_LETTERS,
  withFonts,
} from '@/theme/ritual';

/** Week-letter → weekday name, for the empty-state copy. */
const LETTER_NAMES = {
  L: 'lunes',
  M: 'martes',
  X: 'miércoles',
  J: 'jueves',
  V: 'viernes',
  S: 'sábado',
  D: 'domingo',
};

export default function TodayScreen() {
  const insets = useSafeAreaInsets();
  const week = useMemo(() => buildWeek(), []);
  const { habits, loading, error, stats, create, update, toggle, remove } = useHabits();

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const todayLetter = useMemo(
    () => week.days.find((d) => d.isToday)?.letter ?? 'L',
    [week]
  );
  const [selectedDay, setSelectedDay] = useState(null);
  const activeDay = selectedDay ?? todayLetter;

  /** Habits scheduled for the selected day (the strip filters the list). */
  const dayHabits = useMemo(
    () => habits.filter((h) => parseDays(h.days_of_week).includes(activeDay)),
    [habits, activeDay]
  );

  /** Per-letter totals so the strip can dot the days that have habits. */
  const schedule = useMemo(() => {
    const map = {};
    WEEK_LETTERS.forEach((l) => {
      map[l] = { total: 0, done: 0 };
    });
    habits.forEach((h) => {
      const isDone = Boolean(h.is_completed);
      parseDays(h.days_of_week).forEach((l) => {
        if (map[l]) {
          map[l].total += 1;
          if (isDone) map[l].done += 1;
        }
      });
    });
    return map;
  }, [habits]);

  const dayCompleted = dayHabits.filter((h) => h.is_completed).length;

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalVisible(true);
  }, []);
  const openEdit = useCallback((habit) => {
    setEditing(habit);
    setModalVisible(true);
  }, []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const handleToggle = useCallback(
    async (habit) => {
      if (busyId) return;
      setBusyId(habit.id);
      await toggle(habit);
      setBusyId(null);
    },
    [busyId, toggle]
  );

  const handleRemove = useCallback(
    async (habit) => {
      if (busyId) return;
      setBusyId(habit.id);
      await remove(habit.id);
      setBusyId(null);
    },
    [busyId, remove]
  );

  const header = (
    <View>
      {/* Header — RITUAL / Pequeños pasos, grandes cambios. */}
      <Text style={styles.brand}>R I T U A L</Text>
      <View style={styles.headerRow}>
        <View style={styles.headerTitles}>
          <Text style={styles.h1}>Pequeños pasos,</Text>
          <Text style={styles.h1}>grandes cambios.</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notificaciones"
          style={({ pressed }) => [styles.bell, pressed && { opacity: 0.7 }]}
        >
          <SvgXml xml={svg(bellGlyph, '#C4C0D2')} width={46} height={46} />
        </Pressable>
      </View>

      {/* Dashboard — daily progress ring + weekly activity + create button */}
      <View style={styles.dashboard}>
        <DailyProgressCard
          percent={stats.percent}
          level={Math.max(1, stats.completed + 1)}
          streakDays={stats.streakDays}
          style={styles.dashLeft}
        />
        <View style={styles.dashRight}>
          <WeeklyActivityCard />
          <CreateHabitCard onPress={openCreate} />
        </View>
      </View>

      {/* Week selector */}
      <View style={styles.weekBlock}>
        <View style={styles.weekHeader}>
          <Text style={styles.month}>{week.month}</Text>
          <Text style={styles.todayLabel}>{week.label}</Text>
        </View>

        <View style={styles.strip}>
          {week.days.map((day) => {
            const info = schedule[day.letter] ?? { total: 0, done: 0 };
            const hasHabits = info.total > 0;
            const allDone = hasHabits && info.done === info.total;
            const someDone = info.done > 0;
            const isToday = day.isToday;
            const isActive = day.letter === activeDay;
            const showDot = isToday || hasHabits;
            const dotColor =
              hasHabits && allDone
                ? '#F5C88C'
                : hasHabits && someDone
                  ? '#7DDED7'
                  : isToday
                    ? colors.todayDot
                    : 'rgba(255,255,255,0.25)';

            const cellStyle = [
              styles.day,
              isToday && styles.dayToday,
              isActive && !isToday && styles.daySelected,
            ];
            const letterStyle = [
              styles.dayLetter,
              isToday && { color: colors.todayLetter },
              isActive && !isToday && { color: colors.tabActive },
            ];
            const numberStyle = [
              styles.dayNumber,
              isToday && styles.dayNumberToday,
              isActive && !isToday && styles.dayNumberSelected,
            ];

            const cell = (
              <>
                <Text style={letterStyle}>{day.letter}</Text>
                <Text style={numberStyle}>{String(day.number).padStart(2, '0')}</Text>
                <View
                  style={[
                    styles.dayDot,
                    !showDot && styles.dayDotHidden,
                    { backgroundColor: dotColor },
                  ]}
                />
              </>
            );

            return (
              <Pressable
                key={day.letter}
                onPress={() => setSelectedDay(day.letter)}
                accessibilityRole="button"
                accessibilityLabel={`Ver hábitos de ${LETTER_NAMES[day.letter]}`}
                accessibilityState={{ selected: isActive }}
                style={({ pressed }) => [styles.dayTouch, pressed && { opacity: 0.75 }]}
              >
                {isToday ? (
                  <LinearGradient
                    colors={gradients.todayCell}
                    locations={gradients.todayCellLocations}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={cellStyle}
                  >
                    {cell}
                  </LinearGradient>
                ) : (
                  <View style={cellStyle}>{cell}</View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Habits heading — Tus hábitos [3 / 4] … DISEÑA TU DÍA */}
      <View style={styles.heading}>
        <Text style={styles.headingTitle}>Tus hábitos</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>
            {dayCompleted} / {dayHabits.length}
          </Text>
        </View>
        <Text style={styles.headingMeta}>DISEÑA TU DÍA</Text>
      </View>

      {!!error && (
        <View style={styles.error}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={dayHabits}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        ListEmptyComponent={
          loading ? (
            <View style={styles.empty}>
              <ActivityIndicator color={colors.tabActive} />
            </View>
          ) : habits.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Aún no hay hábitos</Text>
              <Text style={styles.emptyBody}>
                Pulsa “Crear Hábito” para diseñar tu día.
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>Sin hábitos este día</Text>
              <Text style={styles.emptyBody}>
                No programaste nada para {LETTER_NAMES[activeDay]}.
              </Text>
            </View>
          )
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item, index }) => (
          <HabitCard
            habit={item}
            category={categoryForLabel(item.category, item, index)}
            onToggle={handleToggle}
            onEdit={openEdit}
            onRemove={handleRemove}
            busy={busyId === item.id}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18 },
        ]}
      />

      <CreateHabitModal
        key={editing?.id ?? 'create'}
        visible={modalVisible}
        habit={editing}
        onClose={closeModal}
        onSubmit={create}
        onUpdate={update}
      />
    </View>
  );
}

const styles = withFonts(StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 124,
  },

  // --- Header ---
  brand: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600',
    letterSpacing: 2,
    color: colors.brand,
  },
  headerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerTitles: { flex: 1 },
  h1: {
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '600',
    letterSpacing: -0.9,
    color: colors.heading,
  },
  bell: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    ...effects.glass,
  },

  // --- Dashboard ---
  dashboard: {
    flexDirection: 'row',
    gap: 12,
  },
  dashLeft: {
    width: '55.1%',
  },
  dashRight: {
    flex: 1,
    gap: 12,
  },

  // --- Week selector ---
  weekBlock: {
    marginTop: 23,
    marginBottom: 13,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 12,
  },
  month: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
    color: colors.monthLabel,
  },
  todayLabel: {
    fontSize: 10,
    lineHeight: 12,
    color: colors.todayMeta,
  },
  strip: {
    marginTop: 12,
    height: 66,
    borderRadius: radii.glass,
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    flexDirection: 'row',
    gap: 3,
    paddingHorizontal: 7,
    paddingTop: 6,
    overflow: 'hidden',
    ...effects.glass,
  },
  dayTouch: {
    width: 51,
    height: 54,
  },
  day: {
    width: 51,
    height: 54,
    borderRadius: radii.dayCell,
    alignItems: 'center',
    paddingTop: 7,
    overflow: 'hidden',
  },
  dayToday: {
    borderWidth: 1,
    borderColor: 'rgba(255, 228, 197, 0.65)',
    shadowColor: '#F3AC61',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 15,
    elevation: 4,
  },
  daySelected: {
    borderWidth: 1,
    borderColor: 'rgba(249, 200, 134, 0.55)',
    backgroundColor: 'rgba(249, 200, 134, 0.08)',
  },
  dayLetter: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '500',
    color: colors.dayLetter,
  },
  dayNumber: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '500',
    letterSpacing: -0.4,
    color: colors.dayNumber,
  },
  dayNumberToday: {
    fontWeight: '700',
    color: colors.todayNumber,
  },
  dayNumberSelected: {
    fontWeight: '700',
    color: colors.tabActive,
  },
  dayDot: {
    marginTop: 5,
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  dayDotHidden: {
    backgroundColor: 'transparent',
  },

  // --- Habits heading ---
  heading: {
    height: 48,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headingTitle: {
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '600',
    letterSpacing: -0.7,
    color: colors.headingAlt,
  },
  count: {
    marginLeft: 16,
    marginTop: 3,
    height: 21,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 200, 134, 0.09)',
  },
  countText: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    color: colors.tabActive,
  },
  headingMeta: {
    marginLeft: 'auto',
    marginRight: 20,
    marginTop: 8,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '500',
    letterSpacing: 1.33,
    color: colors.muted,
  },

  // --- Feedback ---
  error: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(240, 168, 168, 0.35)',
    backgroundColor: hexA('#F0A8A8', 0.08),
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  errorText: {
    fontSize: 11,
    color: '#F0A8A8',
  },
  empty: {
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    paddingHorizontal: 20,
    paddingVertical: 28,
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
