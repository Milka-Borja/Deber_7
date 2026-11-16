import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';

import { checkMark, deleteIcon, editIcon, svg } from '@/theme/icons';
import {
  colors,
  effects,
  gradients,
  hexA,
  parseDays,
  radii,
  withFonts,
  WEEK_LETTERS,
} from '@/theme/ritual';

const CIRCLE = 40;
const INNER = 30;

/**
 * Habit row card — 1:1 with the four cards in Figma's "Habit list" frame
 * (392 x 102, radius 18, gradient body, category-tinted gradient border,
 * 40pt check circle on the left, 27pt actions on the right).
 */
function HabitCard({ habit, category, onToggle, onEdit, onRemove, busy }) {
  const { color, label } = category;
  const days = parseDays(habit.days_of_week);
  const done = Boolean(habit.is_completed);
  const [confirming, setConfirming] = useState(false);

  const confirmRemove = () => {
    setConfirming(false);
    onRemove?.(habit);
  };

  return (
    <View style={styles.shadow}>
      {/* 1pt gradient border — 139deg category tint fading into white */}
      <LinearGradient
        colors={[hexA(color, 0.27), gradients.cardBorderStart, gradients.cardBorderEnd]}
        locations={[0.01, 0.25, 0.77]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.border}
      >
        <LinearGradient
          colors={gradients.card}
          locations={gradients.cardLocations}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.body}
        >
          {/* Top edge light */}
          <LinearGradient
            colors={[hexA(color, 0), hexA(color, 0.35), hexA(color, 0)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.edgeLight}
          />

          {/* Check circle */}
          <Pressable
            onPress={() => onToggle?.(habit)}
            disabled={busy}
            hitSlop={8}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: done }}
            accessibilityLabel={`Marcar ${habit.name} como ${done ? 'pendiente' : 'completado'}`}
            style={styles.checkTouch}
          >
            <View
              style={[
                styles.checkOuter,
                {
                  backgroundColor: hexA(color, 0.07),
                  borderColor: hexA(color, 0.45),
                  shadowColor: color,
                },
              ]}
            >
              <View
                style={[
                  styles.checkInner,
                  { backgroundColor: hexA(color, 0.15), borderColor: hexA(color, 0.25) },
                ]}
              >
                {done ? (
                  <SvgXml xml={svg(checkMark, color)} width={22} height={22} />
                ) : (
                  <View
                    style={[
                      styles.checkDot,
                      { backgroundColor: hexA(color, 0.06), borderColor: hexA(color, 0.5) },
                    ]}
                  />
                )}
              </View>
            </View>
          </Pressable>

          {/* Category / time / goal badges, title, subtitle, day chips */}
          <View style={styles.content} numberOfLines={1}>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: hexA(color, 0.1) }]}>
                <Text style={[styles.badgeText, { color }]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
              {!!habit.reminder_time && (
                <View style={[styles.badge, styles.badgeMuted]}>
                  <Text style={[styles.badgeText, styles.badgeMutedText]} numberOfLines={1}>
                    {habit.reminder_time}
                  </Text>
                </View>
              )}
              {!!habit.goal && (
                <View style={[styles.badge, styles.badgeMuted, styles.badgeGoal]}>
                  <Text style={[styles.badgeText, styles.badgeMutedText]} numberOfLines={1} ellipsizeMode="tail">
                    {habit.goal}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {habit.name}
            </Text>

            <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
              {habit.description ||
                (done ? 'Completado hoy  ·  +100 XP' : 'Pendiente  ·  mantén tu racha')}
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
                        ? { backgroundColor: hexA(color, 0.1), borderColor: hexA(color, 0.22) }
                        : { backgroundColor: colors.chipIdleFill, borderColor: colors.chipIdleStroke },
                    ]}
                  >
                    <Text style={[styles.chipText, { color: active ? color : colors.dim }]}>
                      {letter}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Edit + delete (stacked on the right edge) */}
          <Pressable
            onPress={() => onEdit?.(habit)}
            disabled={busy}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Editar ${habit.name}`}
            style={styles.edit}
          >
            <SvgXml xml={svg(editIcon, '#C4C0D2')} width={27} height={27} />
          </Pressable>

          <Pressable
            onPress={() => setConfirming(true)}
            disabled={busy || confirming}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar ${habit.name}`}
            style={styles.delete}
          >
            <SvgXml xml={svg(deleteIcon, '#F0A8A8')} width={27} height={27} />
          </Pressable>

          {/* Delete confirmation — covers the card so nothing else can be tapped */}
          {confirming && (
            <View style={styles.confirmOverlay}>
              <View style={styles.confirmRow}>
                <SvgXml xml={svg(deleteIcon, '#F0A8A8')} width={30} height={30} />
                <View style={styles.confirmTexts}>
                  <Text style={styles.confirmTitle} numberOfLines={1}>
                    ¿Eliminar hábito?
                  </Text>
                  <Text style={styles.confirmBody} numberOfLines={1}>
                    {habit.name}
                  </Text>
                </View>
                <Pressable
                  onPress={() => setConfirming(false)}
                  hitSlop={6}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnGhost, pressed && { opacity: 0.7 }]}
                >
                  <Text style={styles.confirmBtnGhostText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={confirmRemove}
                  hitSlop={6}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.confirmBtn, styles.confirmBtnDanger, pressed && { opacity: 0.8 }]}
                >
                  <Text style={styles.confirmBtnDangerText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}

const styles = withFonts(StyleSheet.create({
  shadow: {
    ...effects.card,
    borderRadius: radii.card + 1,
  },
  border: {
    borderRadius: radii.card + 1,
    padding: 1,
  },
  body: {
    borderRadius: radii.card,
    height: 102,
    overflow: 'hidden',
  },
  edgeLight: {
    position: 'absolute',
    top: 0,
    left: '6%',
    width: '46%',
    height: 1,
    borderRadius: 1,
  },
  checkTouch: {
    position: 'absolute',
    left: 15,
    top: 30,
  },
  checkOuter: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  checkInner: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.4,
  },
  content: {
    position: 'absolute',
    left: 72,
    top: 11,
    right: 50,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badge: {
    height: 15,
    borderRadius: radii.badge,
    paddingHorizontal: 7,
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeMuted: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeMutedText: {
    color: colors.muted,
  },
  badgeGoal: {
    maxWidth: 120,
  },
  badgeText: {
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.cardTitle,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 9,
    lineHeight: 11,
    color: colors.body,
  },
  days: {
    marginTop: 9,
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    width: 25,
    height: 21,
    borderRadius: radii.chip,
    borderWidth: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 8,
    fontWeight: '500',
  },
  edit: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  delete: {
    position: 'absolute',
    right: 14,
    top: 47,
  },

  // --- Delete confirmation ---
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 7, 11, 0.9)',
    borderRadius: radii.card,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmTexts: {
    flex: 1,
    minWidth: 0,
  },
  confirmTitle: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    color: '#F0A8A8',
  },
  confirmBody: {
    marginTop: 1,
    fontSize: 9,
    lineHeight: 11,
    color: colors.body,
  },
  confirmBtn: {
    height: 28,
    borderRadius: radii.chip,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  confirmBtnGhost: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  confirmBtnGhostText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.dim,
  },
  confirmBtnDanger: {
    backgroundColor: 'rgba(240, 168, 168, 0.16)',
    borderColor: 'rgba(240, 168, 168, 0.5)',
  },
  confirmBtnDangerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F0A8A8',
  },
}));

export default memo(HabitCard);
