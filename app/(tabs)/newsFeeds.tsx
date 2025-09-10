import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NewsArticle = {
    title: string;
    description: string;
    url: string;
    source_name?: string;
};

const fallbackArticles: NewsArticle[] = [
    {
        title: 'PNG Cocoa Prices Rise in August',
        description:
            'Local wet bean prices have increased by 12% due to favorable weather and improved fermentation practices.',
        url: 'https://example.com/cocoa-prices',
    },
    {
        title: 'Fermentary Spotlight: Morobe Innovation',
        description:
            'A new fermentary in Yanga is using solar-powered drying racks to improve bean quality and reduce waste.',
        url: 'https://example.com/morobe-fermentary',
    },
];

export default function NewsFeedScreen() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(
                    'https://tuxlvyfredtuknhsqdtj.supabase.co/rest/v1/news_articles?select=title,description,url,source_name&order=published_at.desc',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
                            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                        },
                    }
                );

                const data = await res.json();
                if (res.ok && Array.isArray(data)) {
                    const formatted = data.map((item) => ({
                        title: item.title,
                        description: item.description,
                        url: item.url,
                        source_name: item.source_name,
                    }));
                    setArticles(formatted);
                } else {
                    console.warn('⚠️ Unexpected response format:', data);
                    setArticles(fallbackArticles);
                }
            } catch (err) {
                console.error('❌ Failed to fetch news_articles from Supabase:', err);
                setArticles(fallbackArticles);
            }
        };

        fetchNews();
    }, []);

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                    {/* Global News Section */}
                    <Text style={styles.sectionTitle}>Global News</Text>
                    <FlatList
                        data={articles}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                                <LinearGradient
                                    colors={['#ded6cbff', '#ded6cbff', '#ded6cbff'] as const}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.card}
                                >
                                    <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                                    <Text
                                        style={styles.body}
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    >
                                        {item.description || 'No summary available.'}
                                    </Text>
                                    <Text style={styles.link}>View More</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Local News Section */}
                    <Text style={styles.sectionTitle}>Local News</Text>
                    <View style={styles.verticalList}>
                        {articles.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)}>
                                <View style={styles.verticalCard}>
                                    <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                                    <Text
                                        style={styles.body}
                                        numberOfLines={3}
                                        ellipsizeMode="tail"
                                    >
                                        {item.description || 'No summary available.'}
                                    </Text>
                                    <Text style={styles.link}>View More</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    horizontalList: {
        paddingLeft: 16,
        paddingRight: 8,
        paddingBottom: 16,
    },
    card: {
        height: 250,
        width: 280,
        padding: 16,
        borderRadius: 12,
        marginRight: 16,
        elevation: 4,
    },
    verticalList: {
        paddingHorizontal: 16,
    },
    verticalCard: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.textPrimary,
    },
    body: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    link: {
        color: Colors.actionPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
});
