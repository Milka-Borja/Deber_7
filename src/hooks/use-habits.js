import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';
import { serializeDays } from '@/theme/ritual';

const COLUMNS =
  'id, name, days_of_week, category, reminder_time, goal, description, is_completed, created_at';

const HabitsContext = createContext(null);

/** Normalises the form payload into a habits row (nulls for empty optionals). */
function buildRow({ name, days, category, reminder_time, goal, description }) {
  return {
    name: String(name ?? '').trim(),
    days_of_week: serializeDays(Array.isArray(days) ? days : []),
    category: String(category ?? '').trim() || null,
    reminder_time: String(reminder_time ?? '').trim() || null,
    goal: String(goal ?? '').trim() || null,
    description: String(description ?? '').trim() || null,
  };
}

/**
 * Days elapsed since the oldest habit was created.
 * Deliberately kept out of render — `Date.now()` is impure.
 */
function computeStreak(rows) {
  if (rows.length === 0) return 0;
  const oldest = rows.reduce(
    (acc, h) => Math.min(acc, new Date(h.created_at).getTime()),
    Infinity
  );
  if (!Number.isFinite(oldest)) return 0;
  return Math.max(1, Math.floor((Date.now() - oldest) / 86_400_000) + 1);
}

/**
 * Read / create / update / delete over the `habits` table.
 *
 * Schema (read from Supabase):
 *   id             uuid    default gen_random_uuid()
 *   name           text    not null
 *   days_of_week   text    not null   -- "L,M,X,J,V"
 *   category       text                 -- "SALUD" | "MENTE" | "ENFOQUE" | "ENERGÍA"
 *   reminder_time  text                 -- "07:00" (nullable)
 *   goal           text                 -- "2 litros" (nullable)
 *   description    text                 -- short note (nullable)
 *   is_completed   boolean default false
 *   created_at     timestamptz default now()
 *
 * RLS is enabled with an "Acceso total publico" policy for `public`, so the
 * anon/publishable key can select, insert, update and delete.
 */
export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([]);
  const [streakDays, setStreakDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  /** Reads the table. No state updates, so it is safe to call from anywhere. */
  const fetchHabits = useCallback(
    () => supabase.from('habits').select(COLUMNS).order('created_at', { ascending: true }),
    []
  );

  const applyResult = useCallback(({ data, error: err }) => {
    if (!mounted.current) return;
    if (err) setError(err.message);
    else {
      const rows = data ?? [];
      setError(null);
      setHabits(rows);
      setStreakDays(computeStreak(rows));
    }
    setLoading(false);
  }, []);

  /** Manual reload (used by Ajustes). */
  const refresh = useCallback(() => fetchHabits().then(applyResult), [fetchHabits, applyResult]);

  // Initial load. Every state update happens after the awaited request resolves,
  // never synchronously in the effect body.
  useEffect(() => {
    let ignore = false;
    async function startLoading() {
      const result = await fetchHabits();
      if (ignore) return;
      applyResult(result);
    }
    startLoading();
    return () => { ignore = true; };
  }, [fetchHabits, applyResult]);

  const create = useCallback(async (fields) => {
    const row = buildRow(fields);
    if (!row.name) return { ok: false, error: 'Escribe un nombre para el hábito.' };
    if (!row.days_of_week) return { ok: false, error: 'Selecciona al menos un día.' };

    const { data, error: err } = await supabase
      .from('habits')
      .insert({ ...row, is_completed: false })
      .select(COLUMNS)
      .single();

    if (err) return { ok: false, error: err.message };
    if (mounted.current) {
      setError(null);
      setHabits((prev) => [...prev, data]);
    }
    return { ok: true, data };
  }, []);

  const toggle = useCallback(async (habit) => {
    const next = !habit.is_completed;

    // Optimistic flip so the check circle reacts instantly.
    if (mounted.current) {
      setHabits((prev) =>
        prev.map((h) => (h.id === habit.id ? { ...h, is_completed: next } : h))
      );
    }

    const { error: err } = await supabase
      .from('habits')
      .update({ is_completed: next })
      .eq('id', habit.id);

    if (err) {
      if (mounted.current) {
        setHabits((prev) =>
          prev.map((h) => (h.id === habit.id ? { ...h, is_completed: habit.is_completed } : h))
        );
        setError(err.message);
      }
      return { ok: false, error: err.message };
    }
    return { ok: true };
  }, []);

  /** Edits a habit's fields (PATCH /rest/v1/habits?id=eq.…). */
  const update = useCallback(async (id, fields) => {
    const row = buildRow(fields);
    if (!row.name) return { ok: false, error: 'Escribe un nombre para el hábito.' };
    if (!row.days_of_week) return { ok: false, error: 'Selecciona al menos un día.' };

    const { data, error: err } = await supabase
      .from('habits')
      .update(row)
      .eq('id', id)
      .select(COLUMNS)
      .single();

    if (err) return { ok: false, error: err.message };
    if (mounted.current) {
      setError(null);
      setHabits((prev) => prev.map((h) => (h.id === id ? data : h)));
    }
    return { ok: true, data };
  }, []);

  const remove = useCallback(async (id) => {
    let snapshot = [];
    if (mounted.current) {
      setHabits((prev) => {
        snapshot = prev;
        return prev.filter((h) => h.id !== id);
      });
    }

    const { error: err } = await supabase.from('habits').delete().eq('id', id);

    if (err) {
      if (mounted.current) {
        setHabits(snapshot);
        setError(err.message);
      }
      return { ok: false, error: err.message };
    }
    return { ok: true };
  }, []);

  const stats = useMemo(() => {
    const total = habits.length;
    const completed = habits.filter((h) => h.is_completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent, streakDays };
  }, [habits, streakDays]);

  const value = useMemo(
    () => ({ habits, loading, error, stats, refresh, create, update, toggle, remove }),
    [habits, loading, error, stats, refresh, create, update, toggle, remove]
  );

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits debe usarse dentro de <HabitsProvider>');
  return ctx;
}
