import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'supabase-storage' });

const mmkvStorage = {
  getItem: (key: string) => {
    const value = mmkv.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    mmkv.set(key, value);
  },
  removeItem: (key: string) => {
    // Some versions of react-native-mmkv use 'delete', some use 'remove'.
    // In this repo, store/index.ts uses 'remove'.
    if ('remove' in mmkv) {
      (mmkv as any).remove(key);
    } else if ('delete' in mmkv) {
      (mmkv as any).delete(key);
    }
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
