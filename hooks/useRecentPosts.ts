import { useEffect, useState } from 'react';
import { ActivityPost } from '../components/types/activityPost';
import { supabase } from '../lib/supabaseClient';

export const useRecentPosts = () => {
  const [posts, setPosts] = useState<ActivityPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('activity_posts')
        .select('post_id, author_name, author_role, content, timestamp, liked_by');

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      const transformed: ActivityPost[] = (data ?? []).map((row) => ({
        id: row.post_id,
        timestamp: row.timestamp,
        likedBy: row.liked_by ?? [],
        content: row.content,
        likes: Array.isArray(row.liked_by) ? row.liked_by.length : 0,
        author: {
          name: row.author_name ?? 'Unknown',
          role: (['farmer', 'exporter', 'organization'].includes(row.author_role)
            ? row.author_role
            : 'farmer') as ActivityPost['author']['role'],
        },
      }));

      setPosts(transformed);
    };

    fetchPosts();
  }, []);

  return { posts };
};
