import { Colors } from '@/constants/colors';
import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { ActivityPost } from '../../components/types/activityPost';
import { createPost } from '../../lib/createPost';
import { supabase } from '../../lib/supabaseClient';

const VALID_ROLES: ActivityPost['author']['role'][] = ['farmer', 'exporter', 'organization'];

const isValidRole = (role: string): role is ActivityPost['author']['role'] =>
    VALID_ROLES.includes(role as ActivityPost['author']['role']);

export default function PostsScreen() {
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState<ActivityPost[]>([]);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('activity_posts_with_author')
            .select('*')
            .order('timestamp', { ascending: false });

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
                role: isValidRole(row.author_role) ? row.author_role : 'farmer',
            },
        }));

        setPosts(transformed);
    };

    const handleSubmit = async () => {
        const trimmed = content.trim();
        if (!trimmed) {
            Alert.alert('Empty Post', 'Please enter some content before posting.');
            return;
        }

        try {
            await createPost({ content: trimmed });
            Alert.alert('Success', 'Post created!');
            setContent('');
            fetchPosts();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unexpected error occurred during post creation.';
            Alert.alert('Error', message);
            console.error('Post creation error:', message);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="What's happening?"
                    style={styles.input}
                    placeholderTextColor={Colors.textPrimary}
                />
                <Button title="Post" color={Colors.actionPrimary} onPress={handleSubmit} />

                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.postCard}>
                            <Text style={styles.author}>
                                {item.author.name} · {item.author.role.toUpperCase()}
                            </Text>
                            <Text style={styles.content}>{item.content}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp).toLocaleString()}
                            </Text>
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
});
