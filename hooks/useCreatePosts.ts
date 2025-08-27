import { supabase } from '../lib/supabaseClient';

export const useCreatePost = () => {
  const createPost = async (userId: string, content: string) => {
    const { data, error } = await supabase.from('activity_posts').insert({
      user_id: userId,
      content,
    });

    if (error) throw error;
    return data;
  };

  return { createPost };
};
