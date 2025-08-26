import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { supabase } from '../lib/supabaseClient';

type NewsItem = {
    id: string;
    title: string;
    summary: string;
    date: string;
};

export default function NewsFeed() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNews() {
            const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
            if (!error && data) setNews(data);
            setLoading(false);
        }

        fetchNews();
    }, []);

    if (loading) return <Text style={styles.loading}>Loading news...</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Cocoa Farming News</Text>
            <FlatList
                data={news}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.summary}>{item.summary}</Text>
                        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
    },
    heading: {
        ...typography.heading,
        marginBottom: spacing.md,
    },
    loading: {
        ...typography.body,
        textAlign: 'center',
        marginTop: spacing.lg,
    },
    card: {
        backgroundColor: Colors.backgroundSecondary,
        padding: spacing.md,
        borderRadius: spacing.sm,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.subheading,
        marginBottom: spacing.sm,
    },
    summary: {
        ...typography.body,
        marginBottom: spacing.sm,
    },
    date: {
        ...typography.caption,
        color: Colors.textPrimary,
    },
});
