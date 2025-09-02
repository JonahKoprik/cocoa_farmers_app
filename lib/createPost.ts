import { supabase } from './supabaseClient';

type CreatePostInput = {
  content: string;
};

export async function createPost({ content }: CreatePostInput) {
  // 🔐 Get the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Authentication error:', authError?.message || 'No user found');
    return { success: false, error: authError || new Error('User not authenticated') };
  }

  // 📝 Insert post with user_id for RLS enforcement
  const { data, error } = await supabase
    .from('activity_posts')
    .insert([
      {
        content,
        likes: 0,
        liked_by: [],
        user_id: user.id, // ✅ Ownership tracking
      },
    ])
    .select();

  if (error) {
    console.error('Error creating post:', error.message);
    return { success: false, error };
  }

  return { success: true, post: data?.[0] };
}
