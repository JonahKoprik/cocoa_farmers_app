import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Alert, Button, FlatList, StyleSheet,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityPost } from '../../components/types/activityPost';
import { createPost } from '../../lib/createPost';
import { supabase } from '../../lib/supabaseClient';

export default function PostsScreen() {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState<ActivityPost[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const normalizeRole = (raw: string): ActivityPost['author']['role'] => {
        const cleaned = raw?.trim().toLowerCase().replace(/\s+/g, '');
        const map: Record<string, ActivityPost['author']['role']> = {
            'farmer': 'farmer',
            'exporter': 'exporter',
            'organization': 'organization',
            'fermentaryowner': 'fermentaryOwner', // ✅ handles both "Fermentary Owner" and "FermentaryOwner"
        };

        const normalized = map[cleaned];
        if (!normalized) {
            console.warn(`⚠️ Unrecognized role: "${raw}". Defaulting to "farmer".`);
        }

        return normalized ?? 'farmer';
    };

    const fetchUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error('Error fetching user:', error?.message);
            return;
        }
        setCurrentUserId(user.id);
    };

    const fetchPosts = async () => {
        console.log('📡 Fetching posts from Supabase...');
        const { data, error } = await supabase
            .from('activity_posts')
            .select(`
        post_id,
        user_id,
        content,
        timestamp,
        user_profile (
          full_name,
          role
        )
      `)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('❌ Error fetching posts:', error.message);
            return;
        }

        if (!data || data.length === 0) {
            console.warn('⚠️ No posts retrieved.');
            return;
        }

        console.log('✅ Raw Supabase post data:', data);

        const transformed: ActivityPost[] = data.map((row) => {
            const authorProfile = Array.isArray(row.user_profile)
                ? row.user_profile[0]
                : row.user_profile;

            const post: ActivityPost = {
                id: row.post_id,
                userId: row.user_id,
                timestamp: row.timestamp,
                content: row.content,
                author: {
                    name: authorProfile?.full_name ?? 'Unknown',
                    role: normalizeRole(authorProfile?.role ?? ''),
                },
            };

            console.log('🧩 Transformed post:', post);
            return post;
        });

        setPosts(transformed);
        setLoading(false);
    };

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed) {
            Alert.alert('Empty Post', 'Please enter some content before posting.');
            return;
        }

        try {
            if (editingPostId) {
                const { error } = await supabase
                    .from('activity_posts')
                    .update({ content: trimmed })
                    .eq('post_id', editingPostId)
                    .eq('user_id', currentUserId);

                if (error) throw error;

                Alert.alert('Success', 'Post updated!');
            } else {
                await createPost({ content: trimmed });
                Alert.alert('Success', 'Post created!');
            }

            setContent('');
            setEditingPostId(null);
            fetchPosts();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error occurred.';
            Alert.alert('Error', message);
            console.error('Post submission error:', message);
        }
    };

    const handleDelete = async (postId: string) => {
        Alert.alert('Delete Post', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    const { error } = await supabase
                        .from('activity_posts')
                        .delete()
                        .eq('post_id', postId)
                        .eq('user_id', currentUserId);

                    if (error) {
                        console.error('Error deleting post:', error.message);
                        Alert.alert('Error', 'Failed to delete post.');
                    } else {
                        fetchPosts();
                    }
                },
            },
        ]);
    };

    const handleEdit = (postId: string) => {
        const post = posts.find((p) => p.id === postId);
        if (post) {
            setContent(post.content);
            setEditingPostId(postId);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchUser();
            await fetchPosts();
        };
        init();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{ color: Colors.textPrimary }}>Loading posts...</Text>
            </SafeAreaView>
        );
    }

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="What's happening?"
                        style={styles.input}
                        placeholderTextColor={Colors.textPrimary}
                    />
                    <Button
                        title={editingPostId ? 'Update Post' : 'Post'}
                        color={Colors.actionPrimary}
                        onPress={handleSubmit}
                    />
                    {editingPostId && (
                        <TouchableOpacity
                            onPress={() => {
                                setContent('');
                                setEditingPostId(null);
                            }}
                            style={{ marginTop: 8 }}
                        >
                            <Text style={{ color: Colors.actionPrimary }}>Cancel Edit</Text>
                        </TouchableOpacity>
                    )}

                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isOwner = currentUserId && item.userId === currentUserId;

                            return (
                                <View style={styles.postCard}>
                                    <Text style={styles.author}>
                                        {item.author.name} · {item.author.role.toUpperCase()}
                                    </Text>
                                    <Text style={styles.content}>{item.content}</Text>
                                    <Text style={styles.timestamp}>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </Text>

                                    {isOwner && (
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity onPress={() => handleEdit(item.id)} style={styles.actionButton}>
                                                <Text style={styles.actionText}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                                                <Text style={styles.actionText}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            );
                        }}
                        contentContainerStyle={{ paddingTop: 16 }}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    postCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    author: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    content: {
        marginBottom: 6,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    actionButton: {
        marginLeft: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: Colors.actionPrimary,
        borderRadius: 4,
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
    },
});
