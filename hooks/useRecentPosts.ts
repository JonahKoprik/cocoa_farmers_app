import { useEffect, useState } from 'react';
import { ActivityPost } from '../components/types/activityPost';
import { supabase } from '../lib/supabaseClient';

export const useRecentPosts = () => {
  const [posts, setPosts] = useState<ActivityPost[]>([]);

  // Normalize raw role string to internal type-safe value
  const normalizeRole = (raw: string): ActivityPost['author']['role'] => {
    const map: Record<string, ActivityPost['author']['role']> = {
      'farmer': 'farmer',
      'exporter': 'exporter',
      'organization': 'organization',
      'fermentary owner': 'fermentaryOwner',
    };
    return map[raw.toLowerCase()] ?? 'farmer';
  };

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('📡 Fetching posts from Supabase...');

      // Step 1: Fetch posts
      const { data: postData, error: postError } = await supabase
        .from('activity_posts')
        .select('post_id, user_id, content, timestamp')
        .order('timestamp', { ascending: false });

      if (postError) {
        console.error('❌ Error fetching posts:', postError.message);
        return;
      }

      if (!postData || postData.length === 0) {
        console.warn('⚠️ No posts retrieved from activity_posts.');
        return;
      }

      console.log('✅ Retrieved postData:', postData);

      // Step 2: Extract unique user IDs
      const userIds = [...new Set(postData.map((p) => p.user_id))];
      console.log('🔍 Unique user IDs:', userIds);

      // Step 3: Fetch user profiles
      const { data: userProfiles, error: profileError } = await supabase
        .from('user_profile')
        .select('id, full_name, role')
        .in('id', userIds);

      if (profileError) {
        console.error('❌ Error fetching user profiles:', profileError.message);
        return;
      }

      if (!userProfiles || userProfiles.length === 0) {
        console.warn('⚠️ No user profiles found for given IDs.');
        return;
      }

      console.log('✅ Retrieved userProfiles:', userProfiles);

      // Step 4: Map user IDs to profile data
      const profileMap = new Map(
        userProfiles.map((profile) => [profile.id, profile])
      );

      // Step 5: Transform posts
      const transformed: ActivityPost[] = postData.map((row) => {
        const author = profileMap.get(row.user_id);

        return {
          id: row.post_id,
          userId: row.user_id,
          timestamp: row.timestamp,
          content: row.content,
          author: {
            name: author?.full_name ?? 'Unknown',
            role: normalizeRole(author?.role ?? ''),
          },
        };
      });

      console.log('📦 Transformed posts:', transformed);

      setPosts(transformed);
    };

    fetchPosts();
  }, []);

  return { posts };
};
