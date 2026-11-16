import React, { memo, useId } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient as SvgGradient,
  Rect,
  Stop,
  SvgXml,
} from 'react-native-svg';

import { flameGlyph, svg } from '@/theme/icons';
import { colors, effects, gradients, radii, withFonts } from '@/theme/ritual';

const RING_BOX = 176;
const CENTER = RING_BOX / 2;
const R_OUTER = 62.5;
const R_INNER = 57;
const CIRC = 2 * Math.PI * R_OUTER;
const CIRC_INNER = 2 * Math.PI * R_INNER;
const TICK_COUNT = 40;
const TICK_RADIUS = 79;

/** Shared glass container: rgba(255,255,255,0.06) fill, hairline stroke, deep shadow. */
export function GlassCard({ style, children, ...rest }) {
  return (
    <View style={[styles.glass, style]} {...rest}>
      {children}
    </View>
  );
}

/**
 * "Daily progress" card from the Figma dashboard (216 x 222): 40 radial ticks,
 * amber progress arc with glow, inner cyan arc, live percentage, level badge
 * and streak row. The percentage comes from real habit data.
 */
export const DailyProgressCard = memo(function DailyProgressCard({
  percent = 0,
  level = 1,
  streakDays = 0,
  style,
}) {
  // React 19 returns ids like «r0» — strip everything unsafe for `url(#…)`.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '') || 'ring';
  const p = Math.max(0, Math.min(100, percent)) / 100;
  const theta = (-90 + 360 * p) * (Math.PI / 180);
  const endpoint = {
    x: CENTER + R_OUTER * Math.cos(theta),
    y: CENTER + R_OUTER * Math.sin(theta),
  };

  return (
    <View style={[styles.glass, styles.progress, style]}>
      <View style={styles.progressHeader}>
        <Text style={styles.eyebrow}>TU CONSTANCIA</Text>
        <View style={styles.liveDot} />
      </View>

      <View style={styles.ring}>
        <Svg width={RING_BOX} height={RING_BOX}>
        <Defs>
          <SvgGradient id={`amber-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFD696" />
            <Stop offset="0.5" stopColor="#F2A548" />
            <Stop offset="1" stopColor="#FFD696" />
          </SvgGradient>
          <SvgGradient id={`cyan-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9DF8EE" />
            <Stop offset="0.5" stopColor="#287E92" />
            <Stop offset="1" stopColor="#9DF8EE" />
          </SvgGradient>
        </Defs>

        {/* 40 radial ticks — every 5th one is brighter */}
        <G>
          {Array.from({ length: TICK_COUNT }, (_, i) => (
            <Rect
              key={i}
              x={CENTER - 0.5}
              y={CENTER - TICK_RADIUS - 2}
              width={1}
              height={4}
              rx={1}
              fill={i % 5 === 0 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.09)'}
              transform={`rotate(${i * 9} ${CENTER} ${CENTER})`}
            />
          ))}
        </G>

        {/* Track */}
        <Circle
          cx={CENTER}
          cy={CENTER}
          r={R_OUTER}
          strokeWidth={7}
          stroke="rgba(255,255,255,0.065)"
        />

        {p > 0 && (
          <>
            {/* Soft amber bloom behind the arc (Figma: 9px blur, 0.4 alpha) */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={R_OUTER}
              strokeWidth={18}
              stroke="#F4B350"
              strokeOpacity={0.16}
              fill="none"
              strokeDasharray={`${CIRC * p} ${CIRC}`}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
            {/* Amber progress arc */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={R_OUTER}
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
              stroke={`url(#amber-${uid})`}
              strokeDasharray={`${CIRC * p} ${CIRC}`}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
            {/* Inner cyan arc */}
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={R_INNER}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.85}
              fill="none"
              stroke={`url(#cyan-${uid})`}
              strokeDasharray={`${CIRC_INNER * p} ${CIRC_INNER}`}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
            <Circle cx={endpoint.x} cy={endpoint.y} r={4} fill="#FFE3A4" />
          </>
        )}
        </Svg>
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{Math.round(percent)}</Text>
        <Text style={styles.valueUnit}>%</Text>
      </View>
      <Text style={styles.valueCaption}>DEL OBJETIVO</Text>

      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>NIVEL {level}</Text>
      </View>

      <View style={styles.streakRow}>
        <SvgXml xml={svg(flameGlyph, colors.streak)} width={15} height={15} />
        <Text style={styles.streakText}>
          RACHA: {streakDays} {streakDays === 1 ? 'DÍA' : 'DÍAS'}
        </Text>
      </View>
    </View>
  );
});

const DAY_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const BAR_HEIGHTS = [21, 31, 24, 42, 33, 49, 37];
const ACTIVE_INDEX = 4;

/** "Weekly activity" card from the Figma dashboard (164 x 139). */
export const WeeklyActivityCard = memo(function WeeklyActivityCard({ style }) {
  return (
    <View style={[styles.glass, styles.weekly, style]}>
      <Text style={styles.eyebrow}>ESTA SEMANA</Text>

      <View style={styles.weeklyDelta}>
        <Text style={styles.weeklyPercent}>+18%</Text>
        <Text style={styles.weeklyMeta}>vs. anterior</Text>
      </View>

      <View style={styles.bars}>
        {BAR_HEIGHTS.map((h, i) => {
          const active = i === ACTIVE_INDEX;
          return (
            <View key={DAY_LABELS[i]} style={[styles.barSlot, { height: 49 }]}>
              <LinearGradient
                colors={active ? gradients.activityBarActive : gradients.activityBar}
                locations={active ? [0, 0.36, 0.76] : gradients.activityBarLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.bar,
                  { height: h },
                  active && {
                    shadowColor: '#F6BC70',
                    shadowOpacity: 0.25,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 0 },
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.barLabels}>
        {DAY_LABELS.map((label, i) => (
          <Text
            key={label}
            style={[styles.barLabel, i === ACTIVE_INDEX && { color: colors.weekDayActive }]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
});

/** "+ Crear Hábito" card from the Figma dashboard (164 x 71). */
export const CreateHabitCard = memo(function CreateHabitCard({ onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Crear hábito"
      style={({ pressed }) => [styles.createWrap, pressed && { opacity: 0.85 }, style]}
    >
      <LinearGradient
        colors={gradients.create}
        locations={gradients.createLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.create}
      >
        <Text style={styles.createTitle}>Crear Hábito</Text>
      </LinearGradient>
    </Pressable>
  );
});

const styles = withFonts(StyleSheet.create({
  glass: {
    backgroundColor: colors.glassFill,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    borderRadius: radii.glass,
    ...effects.glass,
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1.33,
    color: colors.mutedAlt,
  },

  // --- Daily progress ---
  progress: {
    height: 222,
    overflow: 'hidden',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  liveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.liveDot,
    marginRight: 3,
  },
  ring: {
    position: 'absolute',
    top: 26,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  valueRow: {
    position: 'absolute',
    top: 81,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 43,
    lineHeight: 52,
    fontWeight: '600',
    letterSpacing: -2,
    color: colors.ringValue,
  },
  valueUnit: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
    color: colors.ringUnit,
    marginLeft: 2,
    marginBottom: 10,
  },
  valueCaption: {
    position: 'absolute',
    top: 132,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.ringCaption,
  },
  levelBadge: {
    position: 'absolute',
    top: 150,
    alignSelf: 'center',
    height: 17,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: colors.levelBadgeBg,
  },
  levelText: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.7,
    color: colors.levelBadgeText,
  },
  streakRow: {
    position: 'absolute',
    top: 193,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  streakText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: colors.streak,
  },

  // --- Weekly activity ---
  weekly: {
    height: 139,
    paddingHorizontal: 14,
    paddingTop: 15,
    overflow: 'hidden',
  },
  weeklyDelta: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  weeklyPercent: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.6,
    color: colors.weekTitle,
  },
  weeklyMeta: {
    fontSize: 8,
    color: colors.weekMeta,
    marginLeft: 13,
    marginBottom: 4,
  },
  bars: {
    position: 'absolute',
    left: 15,
    top: 62,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  barSlot: {
    width: 9,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 9,
    borderRadius: 3,
  },
  barLabels: {
    position: 'absolute',
    left: 15,
    top: 119,
    flexDirection: 'row',
    gap: 10,
  },
  barLabel: {
    width: 9,
    textAlign: 'center',
    fontSize: 7,
    fontWeight: '500',
    color: colors.weekDayLabel,
  },

  // --- Create habit ---
  createWrap: {
    borderRadius: radii.create,
    ...effects.create,
  },
  create: {
    height: 71,
    borderRadius: radii.create,
    borderWidth: 1,
    borderColor: 'rgba(255, 229, 189, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  createTitle: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: -0.4,
    textAlign: 'center',
    color: colors.createText,
  },
}));
