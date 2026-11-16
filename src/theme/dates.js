import { WEEK_LETTERS } from '@/theme/ritual';

export const MONTHS = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

export const WEEKDAY_NAMES = [
  'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado',
];

/** Builds the current Monday→Sunday strip plus the two header labels. */
export function buildWeek(now = new Date()) {
  const todayIndex = (now.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() - todayIndex);

  const days = WEEK_LETTERS.map((letter, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      letter,
      number: date.getDate(),
      isToday:
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate(),
    };
  });

  return {
    days,
    month: `${MONTHS[now.getMonth()]} ${now.getFullYear()}`,
    label: `Hoy, ${WEEKDAY_NAMES[now.getDay()]} ${now.getDate()}`,
  };
}
