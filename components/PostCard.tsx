import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { supabase } from '../lib/supabaseClient';
import { roleColors, styles } from './styles/postcardStyles';
import { ActivityPost } from './types/activityPost';

export function PostCard({ post, currentUserId }: { post: ActivityPost; currentUserId: string }) {
    const [liked, setLiked] = useState(post.likedBy.includes(currentUserId));
    const [likes, setLikes] = useState(post.likes);

    const toggleLike = async () => {
        const wasLiked = liked;
        const updatedLikes = wasLiked ? likes - 1 : likes + 1;
        const updatedLikedBy = wasLiked
            ? post.likedBy.filter((id) => id !== currentUserId)
            : [...post.likedBy, currentUserId];

        setLiked(!wasLiked);
        setLikes(updatedLikes);

        const { error } = await supabase
            .from('activity_posts')
            .update({ likes: updatedLikes, likedBy: updatedLikedBy })
            .eq('id', post.id);

        if (error) {
            setLiked(wasLiked);
            setLikes(wasLiked ? likes : likes - 1);
        }
    };

    // Render the post card
    return (
        <LinearGradient
            colors={['#4f4746ff', '#6d6665ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <Text style={[styles.meta, { color: roleColors[post.author.role] }]}>
                {post.author.name} · {post.author.role.toUpperCase()}
            </Text>
            <Text style={styles.content}>{post.content}</Text>
            <Text style={styles.timestamp}>{new Date(post.timestamp).toLocaleString()}</Text>
            <TouchableOpacity style={styles.likeRow} onPress={toggleLike}>
                <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color="#FF6F61" />
                <Text style={styles.likeText}>{likes}</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}
