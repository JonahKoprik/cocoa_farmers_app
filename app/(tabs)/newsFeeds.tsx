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
    View
} from 'react-native';

type NewsArticle = {
    title: string;
    description: string;
    url: string;
    source?: string;
    category?: string;
};

const fallbackArticles: NewsArticle[] = [
    {
        title: 'PNG Cocoa Prices Rise in August',
        description: 'Local wet bean prices have increased by 12% due to favorable weather and improved fermentation practices.',
        url: 'https://example.com/cocoa-prices',
        source: 'PNG Post Courier',
        category: 'Market',
    },
    {
        title: 'Fermentary Spotlight: Morobe Innovation',
        description: 'A new fermentary in Yanga is using solar-powered drying racks to improve bean quality and reduce waste.',
        url: 'https://example.com/morobe-fermentary',
        source: 'The National',
        category: 'Innovation',
    },
    {
        title: 'Cocoa Board Announces New Quality Standards',
        description: 'Farmers must follow new guidelines for better export prices starting next month.',
        url: 'https://example.com/quality-standards',
        source: 'Cocoa Board PNG',
        category: 'Policy',
    },
    {
        title: 'New Highway Improves Cocoa Transport',
        description: 'Improved roads in Highlands region reduce transport time to markets by 50%.',
        url: 'https://example.com/highway',
        source: ' EMTV News',
        category: 'Infrastructure',
    },
];

const globalFallbackArticles: NewsArticle[] = [
    {
        title: 'Global Cocoa Prices Surge on Supply Concerns',
        description: 'West African production issues drive cocoa futures to record highs.',
        url: 'https://example.com/global-prices',
        source: 'Reuters',
        category: 'Market',
    },
    {
        title: 'EU Announces New Chocolate Labeling Rules',
        description: 'New sustainability requirements for cocoa imports from Pacific regions.',
        url: 'https://example.com/eu-rules',
        source: 'Financial Times',
        category: 'Policy',
    },
    {
        title: 'Chocolate Demand Grows in Asian Markets',
        description: 'Rising middle class in China and India creates new opportunities for cocoa exporters.',
        url: 'https://example.com/asia-demand',
        source: 'Bloomberg',
        category: 'Market',
    },
    {
        title: 'Climate Change Impacts Cocoa Growing Regions',
        description: 'Research shows need for drought-resistant cocoa varieties.',
        url: 'https://example.com/climate',
        source: 'Nature',
        category: 'Research',
    },
];

export default function NewsFeedScreen() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(
                    'https://tuxlvyfredtuknhsqdtj.supabase.co/functions/v1/fetch-news',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
                        },
                        body: JSON.stringify({ query: 'PNG cocoa' }),
                    }
                );

                const data = await res.json();
                if (res.ok && Array.isArray(data.articles)) {
                    setArticles(data.articles);
                } else {
                    setArticles(fallbackArticles);
                }
            } catch (err) {
                console.error('Failed to fetch cocoa news:', err);
                setArticles(fallbackArticles);
            }
        };

        fetchNews();
    }, []);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            {/* 🟤 Coresoul Section */}
            <Text style={styles.sectionTitle}>Success Stories</Text>
            <FlatList
                data={articles}
                keyExtractor={(_item: NewsArticle, index: number) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                renderItem={({ item }: { item: NewsArticle }) => (
                    <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                        <LinearGradient
                            colors={['#ded6cbff', '#ded6cbff', '#ded6cbff'] as const}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.card}
                        >
                            <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                            <Text style={styles.body}>{item.description || 'No summary available.'}</Text>
                            <Text style={styles.cardLink}>View More</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            />

            {/*Recent Activities Section */}
            <Text style={styles.sectionTitle}>Latest News</Text>
            <View style={styles.verticalList}>
                {articles.map((item: NewsArticle, index: number) => (
                    <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)}>
                        <View style={styles.verticalCard}>
                            <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                            <Text style={styles.body}>{item.description || 'No summary available.'}</Text>
                            <Text style={styles.link}>View More</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
//Styles for this page
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary, // Steel Gray (60%)
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary, // Black
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },

    // Horizontal List
    horizontalList: {
        paddingLeft: 16,
        paddingRight: 8,
        paddingBottom: 16,
    },
    card: {
        height: 200,
        width: 280,
        padding: 18,
        borderRadius: 16,
        marginRight: 16,
        justifyContent: 'space-between',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    sourceBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    sourceText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 11,
        fontWeight: '600',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    cardBody: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.85)',
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    cardLink: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    readArrow: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 4,
    },

    // Vertical List
    verticalList: {
        paddingHorizontal: 16,
    },
    verticalCard: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: Colors.textPrimary, // Black
    },
    body: {
        fontSize: 14,
        color: '#333', // Slightly muted black for body text
        marginBottom: 8,
    },
    link: {
        color: Colors.actionPrimary, // Leaf Green (10%)
        fontSize: 14,
        fontWeight: '500',
    },
    verticalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    verticalBody: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 12,
    },
    verticalFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
