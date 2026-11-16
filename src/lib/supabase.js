import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!url || !key) {
  // Loud, early failure — otherwise every query fails with a vague network error.
  console.warn(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY in your .env file.'
  );
}

export const supabase = createClient(url ?? 'https://invalid.supabase.co', key ?? 'missing', {
  auth: {
    // The app has no sign-in flow and no AsyncStorage, so keep sessions in memory.
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
