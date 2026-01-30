import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

import { roleColors, styles } from './styles/postcardStyles';
import { ActivityPost } from './types/activityPost';

export function PostCard({ post, currentUserId }: { post: ActivityPost; currentUserId: string }) {
    const isOwner = post.userId === currentUserId;

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
            {isOwner && (
                <Text style={[styles.meta, { marginTop: 8 }]}>
                    <Ionicons name="person" size={16} /> Your post
                </Text>
            )}
        </LinearGradient>
    );
}
