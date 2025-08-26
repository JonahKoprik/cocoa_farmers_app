import { supabase } from '@/lib/supabaseClient';
import * as SecureStore from 'expo-secure-store';

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('No session returned');

  await SecureStore.setItemAsync('authToken', data.session.access_token);
  return data.user;
}

export async function register(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw new Error(error.message);
  if (!data.session) throw new Error('No session returned');

  await SecureStore.setItemAsync('authToken', data.session.access_token);
  return data.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  await SecureStore.deleteItemAsync('authToken');

  if (error) throw new Error(error.message);
}
