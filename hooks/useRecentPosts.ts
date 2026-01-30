// hooks/useRecentPosts.ts
import { useEffect, useState } from "react";
import { ActivityPost } from "../components/types/activityPost";
import { supabase } from "../lib/supabaseClient";

export const useRecentPosts = () => {
  const [posts, setPosts] = useState<ActivityPost[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizeRole = (raw: string): ActivityPost["author"]["role"] => {
    const map: Record<string, ActivityPost["author"]["role"]> = {
      farmer: "farmer",
      exporter: "exporter",
      organization: "organization",
      warehouse: "warehouse",
      "fermentary owner": "fermentaryOwner",
    };
    return map[raw.toLowerCase()] ?? "farmer";
  };

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("📡 Fetching posts from Supabase...");

      const { data: postData, error: postError } = await supabase
        .from("activity_posts")
        .select("post_id, user_id, content, timestamp")
        .order("timestamp", { ascending: false });

      if (postError) {
        console.error("❌ Error fetching posts:", postError.message);
        setLoading(false);
        return;
      }

      if (!postData || postData.length === 0) {
        console.warn("⚠️ No posts retrieved from activity_posts.");
        setLoading(false);
        return;
      }

      console.log("✅ Retrieved postData:", postData);

      const userIds = Array.from(new Set(postData.map((p) => p.user_id)));
      console.log("🔍 Unique user IDs:", userIds);

      const { data: userProfiles, error: profileError } = await supabase
        .from("user_profile")
        .select("id, full_name, role, organization_name")
        .in("id", userIds);

      if (profileError) {
        console.error("❌ Error fetching user profiles:", profileError.message);
        setLoading(false);
        return;
      }

      if (!userProfiles || userProfiles.length === 0) {
        console.warn("⚠️ No user profiles found for given IDs.");
        setLoading(false);
        return;
      }

      console.log("✅ Retrieved userProfiles:", userProfiles);

      const profileMap = new Map(
        userProfiles.map((profile) => [profile.id, profile]),
      );

      const transformed: ActivityPost[] = postData.map((row) => {
        const author = profileMap.get(row.user_id);
        const role = normalizeRole(author?.role ?? "");

        const name =
          role === "warehouse"
            ? author?.organization_name?.trim() ||
              author?.full_name?.trim() ||
              "Unnamed Warehouse"
            : author?.full_name?.trim() ||
              author?.organization_name?.trim() ||
              "Unnamed User";

        if (!name || name === "") {
          console.warn(
            `⚠️ Missing display name for user ${row.user_id} with role ${role}`,
          );
        }

        return {
          id: row.post_id,
          userId: row.user_id,
          timestamp: row.timestamp,
          content: row.content,
          likes: 0,
          likedBy: [],
          author: {
            name,
            role,
          },
        };
      });

      console.log("📦 Transformed posts:", transformed);

      setPosts(transformed);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return { posts, loading };
};
