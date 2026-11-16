import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/theme/ritual';

const { width: SCREEN_W } = Dimensions.get('window');
/** The Figma frame is 440pt wide — scale horizontal offsets to the device. */
const SX = SCREEN_W / 440;

/**
 * The three blurred "blooms" sitting behind the whole UI in Figma:
 * violet ambient bloom, amber ambient bloom and cyan reflected light.
 */
export default function RitualBackground() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      <Svg width={SCREEN_W} height={Dimensions.get('window').height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bloomViolet" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#5B21B6" stopOpacity="0.32" />
            <Stop offset="0.55" stopColor="#5B21B6" stopOpacity="0.1" />
            <Stop offset="1" stopColor="#5B21B6" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bloomAmber" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#D97706" stopOpacity="0.18" />
            <Stop offset="0.55" stopColor="#D97706" stopOpacity="0.05" />
            <Stop offset="1" stopColor="#D97706" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="bloomCyan" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor="#087F8C" stopOpacity="0.1" />
            <Stop offset="0.55" stopColor="#087F8C" stopOpacity="0.03" />
            <Stop offset="1" stopColor="#087F8C" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x={-180 * SX} y={-100} width={630 * SX} height={660} fill="url(#bloomViolet)" />
        <Rect x={160 * SX} y={120} width={420 * SX} height={520} fill="url(#bloomAmber)" />
        <Rect x={-210 * SX} y={590} width={450 * SX} height={500} fill="url(#bloomCyan)" />
      </Svg>
    </View>
  );
}
