import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import {
  CATEGORIES,
  colors,
  effects,
  gradients,
  hexA,
  parseDays,
  radii,
  WEEK_LETTERS,
  withFonts,
} from '@/theme/ritual';

const DEFAULT_DAYS = ['L', 'M', 'X', 'J', 'V'];
const NAME_MAX = 60;
const GOAL_MAX = 30;
const DESC_MAX = 120;
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

/** "7:5" -> null, "7:05" -> "07:05". Returns null when the value is invalid. */
function normalizeTime(raw) {
  const m = String(raw).trim().match(TIME_RE);
  if (!m) return null;
  return `${String(m[1]).padStart(2, '0')}:${m[2]}`;
}

/** Bottom sheet used for both "Crear Hábito" and editing an existing habit. */
export default function CreateHabitModal({ visible, habit, onClose, onSubmit, onUpdate }) {
  const isEdit = Boolean(habit);
  const initialDays = habit ? parseDays(habit.days_of_week) : DEFAULT_DAYS;

  const [name, setName] = useState(() => habit?.name ?? '');
  const [days, setDays] = useState(() => initialDays);
  const [category, setCategory] = useState(() => habit?.category ?? CATEGORIES[0].label);
  const [time, setTime] = useState(() => habit?.reminder_time ?? '');
  const [goal, setGoal] = useState(() => habit?.goal ?? '');
  const [description, setDescription] = useState(() => habit?.description ?? '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  /** Reset + dismiss — a user action, so no state reset inside an effect. */
  const close = () => {
    setName(habit?.name ?? '');
    setDays(habit ? parseDays(habit.days_of_week) : DEFAULT_DAYS);
    setCategory(habit?.category ?? CATEGORIES[0].label);
    setTime(habit?.reminder_time ?? '');
    setGoal(habit?.goal ?? '');
    setDescription(habit?.description ?? '');
    setErrors({});
    setSaving(false);
    onClose();
  };

  const clearError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const toggleDay = (letter) => {
    clearError('days');
    setDays((prev) =>
      prev.includes(letter) ? prev.filter((d) => d !== letter) : [...prev, letter]
    );
  };

  /** Returns a map of field -> message; empty object means the form is valid. */
  const validate = () => {
    const errs = {};
    const trimmed = name.trim();
    if (!trimmed) errs.name = 'Escribe un nombre para el hábito.';
    else if (trimmed.length < 3) errs.name = 'Usa al menos 3 caracteres.';
    if (days.length === 0) errs.days = 'Selecciona al menos un día.';
    if (!category) errs.category = 'Elige una categoría.';
    if (time.trim() && !normalizeTime(time)) errs.time = 'Formato 24 h: HH:MM (ej. 07:00).';
    if (goal.trim().length > GOAL_MAX) errs.goal = `Máximo ${GOAL_MAX} caracteres.`;
    if (description.trim().length > DESC_MAX)
      errs.description = `Máximo ${DESC_MAX} caracteres.`;
    return errs;
  };

  const submit = async () => {
    if (saving) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const payload = {
      name: name.trim(),
      days,
      category,
      reminder_time: time.trim() ? normalizeTime(time) : null,
      goal: goal.trim() || null,
      description: description.trim() || null,
    };

    setSaving(true);
    const result = isEdit
      ? await onUpdate(habit.id, payload)
      : await onSubmit(payload);
    setSaving(false);
    if (!result?.ok) setErrors({ form: result?.error ?? 'No se pudo guardar el hábito.' });
    else close();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={close} accessibilityLabel="Cerrar" />

        <View style={styles.sheetWrap}>
          <LinearGradient
            colors={gradients.card}
            locations={gradients.cardLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheet}
          >
            <View style={styles.handle} />
            <Text style={styles.title}>{isEdit ? 'Editar hábito' : 'Crear hábito'}</Text>
            <Text style={styles.subtitle}>{isEdit ? 'AJUSTA TU RITMO' : 'DISEÑA TU DÍA'}</Text>

            <ScrollView
              style={styles.form}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* NOMBRE */}
              <Text style={styles.fieldLabel}>NOMBRE</Text>
              <TextInput
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  clearError('name');
                }}
                placeholder="Beber 2 L de agua"
                placeholderTextColor={colors.dim}
                style={[styles.input, errors.name && styles.inputError]}
                maxLength={NAME_MAX}
                returnKeyType="done"
                onSubmitEditing={submit}
                autoCorrect={false}
              />
              {!!errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}

              {/* CATEGORÍA */}
              <Text style={styles.fieldLabel}>CATEGORÍA</Text>
              <View style={styles.row}>
                {CATEGORIES.map((c) => {
                  const active = category === c.label;
                  return (
                    <Pressable
                      key={c.label}
                      onPress={() => {
                        setCategory(c.label);
                        clearError('category');
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      style={[
                        styles.cat,
                        active && {
                          backgroundColor: hexA(c.color, 0.12),
                          borderColor: hexA(c.color, 0.55),
                        },
                      ]}
                    >
                      <View style={[styles.catDot, { backgroundColor: c.color }]} />
                      <Text
                        style={[styles.catText, active && { color: c.color, fontWeight: '600' }]}
                      >
                        {c.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {!!errors.category && <Text style={styles.fieldError}>{errors.category}</Text>}

              {/* DÍAS DE LA SEMANA */}
              <Text style={styles.fieldLabel}>DÍAS DE LA SEMANA</Text>
              <View style={styles.row}>
                {WEEK_LETTERS.map((letter) => {
                  const active = days.includes(letter);
                  return (
                    <Pressable
                      key={letter}
                      onPress={() => toggleDay(letter)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: active }}
                      style={[
                        styles.day,
                        active && styles.dayActive,
                        errors.days && styles.inputError,
                      ]}
                    >
                      <Text style={[styles.dayText, active && styles.dayTextActive]}>
                        {letter}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {!!errors.days && <Text style={styles.fieldError}>{errors.days}</Text>}

              {/* HORA */}
              <Text style={styles.fieldLabel}>HORA DEL RECORDATORIO (OPCIONAL)</Text>
              <TextInput
                value={time}
                onChangeText={(t) => {
                  setTime(t);
                  clearError('time');
                }}
                placeholder="07:00"
                placeholderTextColor={colors.dim}
                style={[styles.input, errors.time && styles.inputError]}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
              {!!errors.time && <Text style={styles.fieldError}>{errors.time}</Text>}

              {/* META */}
              <Text style={styles.fieldLabel}>META (OPCIONAL)</Text>
              <TextInput
                value={goal}
                onChangeText={(t) => {
                  setGoal(t);
                  clearError('goal');
                }}
                placeholder="2 litros · 20 min"
                placeholderTextColor={colors.dim}
                style={[styles.input, errors.goal && styles.inputError]}
                maxLength={GOAL_MAX}
                autoCorrect={false}
              />
              {!!errors.goal && <Text style={styles.fieldError}>{errors.goal}</Text>}

              {/* DESCRIPCIÓN */}
              <Text style={styles.fieldLabel}>DESCRIPCIÓN (OPCIONAL)</Text>
              <TextInput
                value={description}
                onChangeText={(t) => {
                  setDescription(t);
                  clearError('description');
                }}
                placeholder="Por qué me importa este hábito"
                placeholderTextColor={colors.dim}
                style={[styles.input, styles.inputMultiline, errors.description && styles.inputError]}
                maxLength={DESC_MAX}
                multiline
                autoCorrect
              />
              {!!errors.description && (
                <Text style={styles.fieldError}>{errors.description}</Text>
              )}
            </ScrollView>

            {!!errors.form && <Text style={styles.formError}>{errors.form}</Text>}

            <Pressable
              onPress={submit}
              disabled={saving}
              accessibilityRole="button"
              style={({ pressed }) => [pressed && { opacity: 0.88 }]}
            >
              <LinearGradient
                colors={gradients.create}
                locations={gradients.createLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.submit, saving && { opacity: 0.6 }]}
              >
                <Text style={styles.submitText}>
                  {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar hábito'}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable onPress={close} style={styles.cancel} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = withFonts(StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 4, 7, 0.72)',
  },
  sheetWrap: {
    marginTop: 'auto',
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  sheet: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '90%',
    ...effects.glass,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(217, 210, 224, 0.35)',
    marginBottom: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: -0.7,
    color: colors.headingAlt,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1.33,
    color: colors.muted,
  },
  form: {
    flexGrow: 0,
    flexShrink: 1,
    marginTop: 6,
  },
  formContent: {
    paddingBottom: 4,
  },
  fieldLabel: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1.33,
    color: colors.mutedAlt,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    color: colors.cardTitle,
  },
  inputMultiline: {
    height: 84,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'rgba(240, 168, 168, 0.6)',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  cat: {
    flex: 1,
    height: 44,
    borderRadius: radii.dayCell,
    borderWidth: 1,
    borderColor: colors.chipIdleStroke,
    backgroundColor: colors.chipIdleFill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  catText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.dim,
  },
  day: {
    flex: 1,
    height: 44,
    borderRadius: radii.dayCell,
    borderWidth: 1,
    borderColor: colors.chipIdleStroke,
    backgroundColor: colors.chipIdleFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: {
    backgroundColor: 'rgba(249, 200, 134, 0.12)',
    borderColor: 'rgba(249, 200, 134, 0.45)',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.dim,
  },
  dayTextActive: {
    color: colors.tabActive,
    fontWeight: '600',
  },
  fieldError: {
    marginTop: 6,
    fontSize: 11,
    color: '#F0A8A8',
  },
  formError: {
    marginTop: 12,
    fontSize: 11,
    color: '#F0A8A8',
  },
  submit: {
    marginTop: 20,
    height: 56,
    borderRadius: radii.create,
    alignItems: 'center',
    justifyContent: 'center',
    ...effects.create,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: colors.createText,
  },
  cancel: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 6,
  },
  cancelText: {
    fontSize: 12,
    color: colors.muted,
  },
}));
