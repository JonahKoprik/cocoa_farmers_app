import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { PostCard } from '../../components/PostCard';
import { ActivityPost } from '../../components/types/activityPost';
import { createPost } from '../../lib/createPost';
import { supabase } from '../../lib/supabaseClient';

const { width } = Dimensions.get('window');

// Dummy posts for demonstration
const DUMMY_POSTS: ActivityPost[] = [
    {
        id: '1',
        content: 'Just finished harvesting my cocoa beans. The quality looks great this season! Looking forward to good prices at the market. 🌱',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        likes: 12,
        likedBy: ['user1', 'user2', 'user3'],
        author: {
            name: 'John Mana',
            role: 'farmer',
        },
    },
    {
        id: '2',
        content: 'Reminder to all farmers: The Cocoa Board has announced new quality standards. Make sure to follow the guidelines for better prices.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        likes: 28,
        likedBy: ['user1', 'user2'],
        author: {
            name: 'PNG Cocoa Association',
            role: 'organization',
        },
    },
    {
        id: '3',
        content: 'Has anyone tried the new organic fertilizer? I am thinking of switching from chemical fertilizers. Any recommendations?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        likes: 8,
        likedBy: ['user1'],
        author: {
            name: 'Maria Kai',
            role: 'farmer',
        },
    },
    {
        id: '4',
        content: 'Great weather for drying beans today! Make sure to turn your beans every hour for even drying.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        likes: 15,
        likedBy: ['user1', 'user2', 'user3', 'user4'],
        author: {
            name: 'Tom Wari',
            role: 'farmer',
        },
    },
    {
        id: '5',
        content: 'Export prices are looking good this month. Quality beans are fetching premium prices in international markets!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
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
    const [showInput, setShowInput] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scrollViewRef = useRef<ScrollView>(null);
    const inputRef = useRef<TextInput>(null);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('activity_posts')
            .select('post_id, author_name, author_role, content, timestamp, liked_by')
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            // Use dummy posts if fetch fails
            setPosts(DUMMY_POSTS);
            animatePosts();
            return;
        }

        if (!data || data.length === 0) {
            // Use dummy posts if no posts exist
            setPosts(DUMMY_POSTS);
        } else {
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
        }

        animatePosts();
    };

    const animatePosts = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleAddPostPress = () => {
        if (showInput) {
            // Cancel posting - hide input and clear content
            setShowInput(false);
            setContent('');
        } else {
            // Show input
            setShowInput(true);
            // Scroll to the input section
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                // Focus the input
                inputRef.current?.focus();
            }, 100);
        }
    };

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed) {
            Alert.alert('Empty Post', 'Please enter some content before posting.');
            return;
        }

        setIsPosting(true);
        try {
            await createPost({ content: trimmed });
            Alert.alert('Success', 'Post created successfully!');
            setContent('');
            fetchPosts();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unexpected error occurred during post creation.';
            Alert.alert('Error', message);
            console.error('Post creation error:', message);
        } finally {
            setIsPosting(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const renderPost = ({ item, index }: { item: ActivityPost; index: number }) => {
        const postFade = new Animated.Value(0);
        const postSlide = new Animated.Value(30);

        Animated.timing(postFade, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        Animated.timing(postSlide, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start();

        return (
            <Animated.View style={{ opacity: postFade, transform: [{ translateY: postSlide }] }}>
                <PostCard post={item} currentUserId="JK" />
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2ecc71" />

            {/* Animated Header */}
            <LinearGradient
                colors={['#2ecc71', '#27ae60', '#1e8449']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.pageTitle}>Community</Text>
                        <Text style={styles.pageSubtitle}>Connect with fellow farmers</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleAddPostPress}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#fff', '#f0f0f0']}
                            style={styles.addButtonGradient}
                        >
                            <Text style={styles.addButtonText}>{showInput ? '×' : '+'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Main Content */}
            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Post Input - Shows when + button is pressed */}
                    {showInput && (
                        <Animated.View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    ref={inputRef}
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="Share your thoughts..."
                                    placeholderTextColor="rgba(255,255,255,0.6)"
                                    style={styles.input}
                                    multiline
                                    maxLength={500}
                                />
                                {content.trim().length > 0 && (
                                    <Text style={styles.charCount}>{content.length}/500</Text>
                                )}
                            </View>
                            <TouchableOpacity
                                style={[styles.postButton, isPosting && styles.postButtonDisabled]}
                                onPress={handleSubmit}
                                disabled={isPosting}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={isPosting ? ['#ccc', '#bbb'] : ['#fff', '#f0f0f0']}
                                    style={styles.postButtonGradient}
                                >
                                    <Text style={[styles.postButtonText, isPosting && styles.postButtonTextDisabled]}>
                                        {isPosting ? 'Posting...' : 'Post'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Posts List */}
                    <View style={styles.postsSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Posts</Text>
                            <View style={styles.postCountBadge}>
                                <Text style={styles.postCountText}>{posts.length}</Text>
                            </View>
                        </View>

                        {posts.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>📭</Text>
                                <Text style={styles.emptyTitle}>No posts yet</Text>
                                <Text style={styles.emptyText}>Be the first to share with the community!</Text>
                            </View>
                        ) : (
                            <Animated.FlatList
                                data={posts}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderPost}
                                contentContainerStyle={styles.postsList}
                                showsVerticalScrollIndicator={false}
                                initialNumToRender={5}
                                maxToRenderPerBatch={10}
                                scrollEnabled={false} // Disable since we're in a ScrollView
                            />
                        )}
                    </View>

                    {/* Bottom Spacing */}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },

    // Header
    header: {
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
        paddingHorizontal: 20,
        paddingBottom: 20,

        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    pageSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 4,
    },

    // Add Button
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 4,
    },
    addButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 28,
        fontWeight: '300',
        color: '#27ae60',
        marginTop: -2,
    },

    // Content
    content: {
        flex: 1,
        marginTop: -10,

        backgroundColor: '#f5f7fa',
        overflow: 'hidden',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 16,
    },

    // Input Section
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#cfc4c4',
        marginHorizontal: 16,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    inputWrapper: {
        flex: 1,
        marginRight: 12,
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
    charCount: {
        fontSize: 11,
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
        marginRight: 4,
    },

    // Post Button
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

    // Posts Section
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

    // Empty State
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
});
