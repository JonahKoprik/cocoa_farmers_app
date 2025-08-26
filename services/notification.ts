import { supabase } from '../lib/supabaseClient';

export async function fetchNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data;
}
