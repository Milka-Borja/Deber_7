import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tabAjustes, tabColeccion, tabHoy, tabProgreso, svg } from '@/theme/icons';
import { colors, gradients, radii, withFonts } from '@/theme/ritual';

const ITEMS = {
  Hoy: tabHoy,
  Progreso: tabProgreso,
  'Colección': tabColeccion,
  Ajustes: tabAjustes,
};

/**
 * Replaces React Navigation's default bar with the Figma "Floating glass
 * navigation": 64pt pill, 127deg violet-grey gradient, 1pt white stroke,
 * 21pt icons, 8pt labels and a warm glow behind the active tab.
 */
export default function RitualTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <LinearGradient
        colors={gradients.tabBar}
        locations={gradients.tabBarLocations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bar}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const icon = ITEMS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              hitSlop={4}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={route.name}
              style={styles.item}
            >
              {focused && <View style={styles.glow} />}
              <SvgXml
                xml={svg(icon, focused ? colors.tabActive : '#9A8FA9')}
                width={21}
                height={21}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? colors.tabActive : colors.tabInactive },
                ]}
                numberOfLines={1}
              >
                {route.name}
              </Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = withFonts(StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    paddingTop: 11,
    backgroundColor: 'transparent',
  },
  bar: {
    height: 64,
    borderRadius: radii.tabBar,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 13,
  },
  glow: {
    position: 'absolute',
    top: 7,
    bottom: 7,
    left: 6,
    right: 6,
    borderRadius: 18,
    backgroundColor: colors.tabGlow,
  },
  label: {
    marginTop: 7,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '600',
  },
}));
