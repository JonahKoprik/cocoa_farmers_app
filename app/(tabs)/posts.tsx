import { Colors } from '@/constants/colors';
import { useEffect, useState } from 'react';
import {
    Alert, Button, FlatList, Platform, StyleSheet,
    Text, TextInput,
    ToastAndroid,
    TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityPost } from '../../components/types/activityPost';
import { createPost } from '../../lib/createPost';
import { supabase } from '../../lib/supabaseClient';

const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        Alert.alert('', message);
    }
};

// Dummy posts for demonstration
const DUMMY_POSTS: ActivityPost[] = [
    {
        id: '1',
        userId: 'user1',
        content: 'Just finished harvesting my cocoa beans. The quality looks great this season! Looking forward to good prices at the market. 🌱',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        likes: 12,
        likedBy: ['user1', 'user2', 'user3'],
        author: {
            name: 'John Mana',
            role: 'farmer',
        },
    },
    {
        id: '2',
        userId: 'user2',
        content: 'Reminder to all farmers: The Cocoa Board has announced new quality standards. Make sure to follow the guidelines for better prices.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likes: 28,
        likedBy: ['user1', 'user2'],
        author: {
            name: 'PNG Cocoa Association',
            role: 'organization',
        },
    },
    {
        id: '3',
        userId: 'user3',
        content: 'Has anyone tried the new organic fertilizer? I am thinking of switching from chemical fertilizers. Any recommendations?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        likes: 8,
        likedBy: ['user1'],
        author: {
            name: 'Maria Kai',
            role: 'farmer',
        },
    },
    {
        id: '4',
        userId: 'user4',
        content: 'Great weather for drying beans today! Make sure to turn your beans every hour for even drying.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        likes: 15,
        likedBy: ['user1', 'user2', 'user3', 'user4'],
        author: {
            name: 'Tom Wari',
            role: 'farmer',
        },
    },
    {
        id: '5',
        userId: 'user5',
        content: 'Export prices are looking good this month. Quality beans are fetching premium prices in international markets!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        likes: 42,
        likedBy: ['user1', 'user2', 'user3', 'user4', 'user5'],
        author: {
            name: 'Exports PNG',
            role: 'exporter',
        },
    },
];

export default function PostsScreen() {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState<ActivityPost[]>([]);
    const [isPosting, setIsPosting] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id) {
            setCurrentUserId(data.user.id);
        }
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
          role,
          organization_name
        )
      `)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return;
        }

        const transformed: ActivityPost[] = (data ?? []).map((row) => ({
            id: row.post_id,
            userId: row.user_id,
            timestamp: row.timestamp,
            content: row.content,
            likes: 0,
            likedBy: [],
            author: {
                name: row.user_profile?.[0]?.full_name ?? 'Unknown',
                role: (['farmer', 'exporter', 'organization', 'warehouse', 'fermentaryOwner'].includes(row.user_profile?.[0]?.role)
                    ? row.user_profile?.[0]?.role
                    : 'farmer') as ActivityPost['author']['role'],
            },
        }));

        console.log('✅ Raw Supabase post data:', JSON.stringify(data));
        transformed.forEach(p => console.log('🧩 Transformed post:', JSON.stringify(p)));
        setPosts(transformed);
    };

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed) {
            Alert.alert('Empty Post', 'Please enter some content before posting.');
            return;
        }

        setIsPosting(true);
        try {
            if (editingPostId) {
                const { error } = await supabase
                    .from('activity_posts')
                    .update({ content: trimmed })
                    .eq('post_id', editingPostId)
                    .eq('user_id', currentUserId);

                if (error) throw error;

                showToast('Post updated successfully');
                setEditingPostId(null);
            } else {
                await createPost({ content: trimmed });
                showToast('Post created successfully');
            }

            setContent('');
            fetchPosts();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unexpected error occurred.';
            Alert.alert('Error', message);
            console.error('Post submission error:', message);
        } finally {
            setIsPosting(false);
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
                        showToast('Failed to delete post.');
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

    /**
     * Initial data fetch on component mount
     */
    useEffect(() => {
        const init = async () => {
            await fetchUser();
            await fetchPosts();
        };
        init();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder={editingPostId ? 'Edit your post...' : "What's happening?"}
                    style={styles.input}
                    placeholderTextColor={Colors.textPrimary}
                    multiline
                />
                <Button
                    title={editingPostId ? 'Update Post' : 'Post'}
                    color={Colors.actionPrimary}
                    onPress={handleSubmit}
                    disabled={isPosting}
                />
                {editingPostId && (
                    <Button
                        title="Cancel Edit"
                        color="#999"
                        onPress={() => { setEditingPostId(null); setContent(''); }}
                    />
                )}

                <FlatList
                    data={posts}
                    keyExtractor={(item: ActivityPost) => item.id.toString()}
                    renderItem={({ item }: { item: ActivityPost }) => (
                        <View style={styles.postCard}>
                            <Text style={styles.author}>
                                {item.author.name} · {item.author.role.toUpperCase()}
                            </Text>
                            <Text style={styles.content}>{item.content}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp).toLocaleString()}
                            </Text>
                            {item.userId === currentUserId && (
                                <View style={styles.actionRow}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleEdit(item.id)}
                                    >
                                        <Text style={styles.actionText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: '#ff4d4d' }]}
                                        onPress={() => handleDelete(item.id)}
                                    >
                                        <Text style={styles.actionText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                    contentContainerStyle={{ paddingTop: 16 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
        padding: 16,
    },
    input: {
        backgroundColor: '#969ca1',
        borderRadius: 16,
        padding: 14,
        paddingTop: 14,
        fontSize: 16,
        color: '#333',
        maxHeight: 120,
        minHeight: 50,
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    author: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    content: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    timestamp: {
        fontSize: 11,
        color: '#999',
    },
    charCount: {
        fontSize: 11,
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
        marginRight: 4,
    },
    postButton: {
        width: 70,
        height: 50,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
    },
    postButtonDisabled: {
        opacity: 0.6,
    },
    postButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#27ae60',
    },
    postButtonTextDisabled: {
        color: '#999',
    },
    postsSection: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    postCountBadge: {
        backgroundColor: '#2ecc71',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 10,
    },
    postCountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    postsList: {
        paddingBottom: 40,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 40,
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
        fontSize: 12,
        fontWeight: '600',
    },
});
