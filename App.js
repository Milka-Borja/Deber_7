import 'react-native-url-polyfill/auto';

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Import each weight from its own subpath: the package index pulls in all
// 18 Inter variants (~6 MB) even though we only use four.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

import RitualBackground from '@/components/ritual-background';
import RitualTabBar from '@/components/ritual-tab-bar';
import { HabitsProvider } from '@/hooks/use-habits';
import CollectionScreen from '@/screens/collection-screen';
import ProgressScreen from '@/screens/progress-screen';
import SettingsScreen from '@/screens/settings-screen';
import TodayScreen from '@/screens/today-screen';
import { colors } from '@/theme/ritual';

const Tab = createBottomTabNavigator();

// Keep the native splash on screen until the Inter faces are ready.
SplashScreen.preventAutoHideAsync().catch(() => {});

const navigationTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.tabActive,
    background: 'transparent',
    card: 'transparent',
    text: colors.heading,
    border: 'transparent',
    notification: colors.tabActive,
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const ready = Boolean(fontsLoaded || fontError);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {/* Ambient blooms sit behind every tab */}
        <RitualBackground />

        <HabitsProvider>
          <NavigationContainer theme={navigationTheme}>
            <Tab.Navigator
              initialRouteName="Hoy"
              screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: 'transparent' },
              }}
              tabBar={(props) => <RitualTabBar {...props} />}
            >
              <Tab.Screen name="Hoy" component={TodayScreen} />
              <Tab.Screen name="Progreso" component={ProgressScreen} />
              <Tab.Screen name="Colección" component={CollectionScreen} />
              <Tab.Screen name="Ajustes" component={SettingsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </HabitsProvider>

        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
