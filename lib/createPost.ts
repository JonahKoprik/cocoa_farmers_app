import { supabase } from './supabaseClient';

type CreatePostInput = {
  content: string;
};

export async function createPost({ content }: CreatePostInput) {
  const { data, error } = await supabase
    .from('activity_posts')
    .insert([
      {
        content,
        likes: 0,
        liked_by: [],
      },
    ])
    .select();

  if (error) {
    console.error('Error creating post:', error.message);
    return { success: false, error };
  }

  return { success: true, post: data?.[0] };
}
