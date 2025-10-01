import { supabase } from '@/lib/supabaseClient';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export async function registerPushToken(userId: string, role: String) {
  if (!Device.isDevice) return;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await supabase.from('user_push_tokens').upsert({ user_id: userId, token });
}
