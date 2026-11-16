/**
 * Design tokens extracted from Figma — "Ritual — Habit tracker" (node 2:2).
 * Every colour, gradient, radius and shadow below comes straight from the file.
 */

export const colors = {
  // Base
  bg: '#07070B',

  // Glass surfaces
  glassFill: 'rgba(255, 255, 255, 0.06)',
  glassStroke: 'rgba(255, 255, 255, 0.14)',
  glassShadow: 'rgba(0, 0, 0, 0.25)',

  // Typography
  heading: '#F5F1F8',
  headingAlt: '#F4EFF7',
  cardTitle: '#F0EAF6',
  body: '#A69CB3',
  muted: '#A49AAF',
  mutedAlt: '#BEB6CA',
  mutedSoft: '#ABA1B8',
  dim: '#77707F',
  brand: '#B9AEC8',

  // Week strip
  monthLabel: '#C5BED1',
  todayMeta: '#A79CB7',
  dayLetter: '#ABA1B8',
  dayNumber: '#DBD3E6',
  todayLetter: '#513521',
  todayNumber: '#2E201B',
  todayDot: '#553B26',

  // Bottom navigation
  tabActive: '#F5C88C',
  tabInactive: '#A99EB6',
  tabGlow: 'rgba(248, 199, 128, 0.08)',

  // Progress card
  ringValue: '#FFF4DF',
  ringUnit: '#DAC9AC',
  ringCaption: '#B3A8BC',
  liveDot: '#73DCD8',
  levelBadgeBg: 'rgba(185, 161, 233, 0.1)',
  levelBadgeText: '#CEB9EE',
  streak: '#E7C392',

  // Weekly activity
  weekTitle: '#F0ECEF',
  weekMeta: '#A79BB5',
  weekDayLabel: '#91869F',
  weekDayActive: '#F7C989',

  // Create button
  createText: '#302019',
  createSubtext: '#63452F',

  // Habit chips (inactive)
  chipIdleFill: 'rgba(3, 4, 7, 0.45)',
  chipIdleStroke: 'rgba(255, 255, 255, 0.04)',

  // Action buttons on cards
  actionFill: 'rgba(255, 255, 255, 0.04)',
  actionStroke: 'rgba(255, 255, 255, 0.05)',
};

export const gradients = {
  /** Habit card body — linear-gradient(127deg, …) */
  card: ['rgba(40, 36, 52, 0.78)', 'rgba(26, 25, 35, 0.85)', 'rgba(16, 17, 23, 0.94)'],
  cardLocations: [0, 0.3, 0.74],

  /** Habit card border — linear-gradient(139deg, …) tinted per category */
  cardBorderStart: 'rgba(255, 255, 255, 0.08)',
  cardBorderEnd: 'rgba(255, 255, 255, 0.06)',

  /** "+ Crear Hábito" — linear-gradient(127deg, …) */
  create: ['#F8D298', '#C3864E', '#F8D298'],
  createLocations: [0, 0.36, 0.76],

  /** Floating bottom navigation — linear-gradient(127deg, …) */
  tabBar: ['#211E2C', '#14141D', '#211E2C'],
  tabBarLocations: [0, 0.36, 0.76],

  /** Selected day cell — linear-gradient(127deg, …) */
  todayCell: ['#EAC59D', '#CA965F', '#EAC59D'],
  todayCellLocations: [0, 0.36, 0.76],

  /** Activity bars — linear-gradient(127deg, …) */
  activityBar: ['#8E6EB3', '#45335D', '#8E6EB3'],
  activityBarLocations: [0, 0.36, 0.76],
  activityBarActive: ['#FFD9A1', '#DC984D', '#FFD9A1'],

  /** Top edge light of a habit card */
  edgeLight: ['transparent', 'rgba(255, 255, 255, 0.35)', 'transparent'],
};

export const effects = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  create: {
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 23,
    elevation: 10,
  },
};

export const radii = {
  screen: 40,
  glass: 22,
  card: 18,
  create: 19,
  tabBar: 25,
  chip: 6,
  badge: 5,
  dayCell: 16,
  pill: 10,
};

/** The four categories used by the Figma cards, in file order. */
export const CATEGORIES = [
  { label: 'SALUD', color: '#7DDED7' },
  { label: 'MENTE', color: '#BBA0F0' },
  { label: 'ENFOQUE', color: '#EEC28A' },
  { label: 'ENERGÍA', color: '#A5C8AD' },
];

/** Week letters used by the design (L M X J V S D). */
export const WEEK_LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/**
 * The Figma file specifies Inter for every text style. React Native cannot
 * apply a weight on a custom family, so each weight is a separate family and
 * `withFonts` picks the right one from `fontWeight`.
 */
export const INTER = {
  '400': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
  normal: 'Inter_400Regular',
  bold: 'Inter_700Bold',
};

/** Wraps StyleSheet.create so every style resolves to the matching Inter face. */
export function withFonts(styles) {
  const out = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const weight = value.fontWeight != null ? String(value.fontWeight) : '400';
      out[key] = { fontFamily: INTER[weight] ?? INTER['400'], ...value };
    } else {
      out[key] = value;
    }
  });
  return out;
}

/** rgba() from a hex colour + alpha, e.g. hexA('#7DDED7', 0.1). */
export function hexA(hex, alpha) {
  const raw = String(hex).replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Fallback category when a habit has no stored `category`: derived
 * deterministically from the row id — stable across reloads and sorting.
 */
export function categoryForHabit(habit, fallbackIndex = 0) {
  const seed = String((habit && habit.id) ?? fallbackIndex);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return CATEGORIES[hash % CATEGORIES.length];
}

/**
 * Resolves a habit's stored `category` label to its {label, color} entry,
 * falling back to the id-derived category when it is missing/unknown.
 */
export function categoryForLabel(label, habit, fallbackIndex = 0) {
  const found = CATEGORIES.find((c) => c.label === label);
  return found ?? categoryForHabit(habit, fallbackIndex);
}

/** "L,M,X,J" -> ['L','M','X','J'] (tolerates empty/garbage values). */
export function parseDays(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((d) => d.trim().toUpperCase())
    .filter(Boolean);
}

/** ['L','M'] -> "L,M" — the format stored in habits.days_of_week. */
export function serializeDays(days) {
  const unique = [];
  WEEK_LETTERS.forEach((letter) => {
    if (days.includes(letter)) unique.push(letter);
  });
  return unique.join(',');
}
