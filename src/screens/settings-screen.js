import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useHabits } from '@/hooks/use-habits';
import { colors, effects, radii, withFonts } from '@/theme/ritual';

const GROUPS = [
  {
    title: 'PERFIL',
    rows: [
      { label: 'Cuenta de Ritual', value: 'Sin sesión' },
      { label: 'Objetivo diario', value: '8 hábitos' },
    ],
  },
  {
    title: 'PREFERENCIAS',
    rows: [
      { label: 'Notificaciones', value: '09:00' },
      { label: 'Apariencia', value: 'Oscuro' },
      { label: 'Idioma', value: 'Español' },
    ],
  },
  {
    title: 'DATOS',
    rows: [
      { label: 'Sincronización', value: 'Supabase' },
      { label: 'Exportar hábitos', value: 'CSV' },
    ],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { stats, refresh, loading } = useHabits();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 18 }]}
    >
      <Text style={styles.brand}>A J U S T E S</Text>
      <Text style={styles.h1}>Hazlo a tu manera.</Text>

      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusLabel}>HÁBITOS EN SUPABASE</Text>
          <Text style={styles.statusValue}>
            {loading ? '…' : `${stats.completed} / ${stats.total} completados`}
          </Text>
        </View>
        <View style={styles.syncPill}>
          <View style={styles.syncDot} />
          <Text style={styles.syncText}>EN LÍNEA</Text>
        </View>
      </View>

      {GROUPS.map((group) => (
        <View key={group.title} style={styles.group}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.card}>
            {group.rows.map((row, i) => (
              <View
                key={row.label}
                style={[styles.row, i < group.rows.length - 1 && styles.rowDivider]}
              >
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.group}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.tabActive }]}>
              Actualizar datos
            </Text>
            <Text style={styles.rowValue}>{loading ? '…' : 'Toca'}</Text>
          </View>
        </View>
        <Text
          onPress={() => refresh()}
          style={styles.refresh}
          suppressHighlighting
        >
          Volver a consultar la tabla habits
        </Text>
      </View>

      <Text style={styles.footer}>Ritual · Habit tracker · v1.0.0</Text>
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
  statusCard: {
    marginTop: 24,
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...effects.glass,
  },
  statusLabel: {
    fontSize: 7,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.mutedAlt,
  },
  statusValue: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.cardTitle,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 21,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(125, 222, 215, 0.1)',
  },
  syncDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#73DCD8',
  },
  syncText: {
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#73DCD8',
  },
  group: {
    marginTop: 26,
  },
  groupTitle: {
    marginBottom: 10,
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1.33,
    color: colors.muted,
  },
  card: {
    borderRadius: radii.glass,
    borderWidth: 1,
    borderColor: colors.glassStroke,
    backgroundColor: colors.glassFill,
    overflow: 'hidden',
    ...effects.glass,
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.07)',
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.cardTitle,
  },
  rowValue: {
    fontSize: 11,
    color: colors.body,
  },
  refresh: {
    marginTop: 10,
    fontSize: 10,
    textAlign: 'center',
    color: colors.muted,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 1,
    color: colors.dim,
  },
}));
