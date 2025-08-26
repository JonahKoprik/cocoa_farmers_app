import { supabase } from '../lib/supabaseClient';

export const useCreatePost = () => {
  const createPost = async ({ content }: { content: string }) => {
    const { error } = await supabase.from('activity_posts').insert({ content });
    if (error) throw error;
  };

  return { createPost };
};
