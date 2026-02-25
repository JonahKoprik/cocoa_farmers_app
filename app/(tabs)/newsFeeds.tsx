import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalNews } from '../../hooks/useLocalNews';

type NewsArticle = {
    title: string;
    description: string;
    url: string;
    source?: string;
    category?: string;
};

type GlobalNewsArticle = {
    title: string;
    description: string;
    url?: string;
    source_name?: string;
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
    const [globalNews, setGlobalNews] = useState<GlobalNewsArticle[]>([]);
    const [refreshingGlobal, setRefreshingGlobal] = useState(false);
    const [activeTab, setActiveTab] = useState<'global' | 'local'>('local');

    const {
        articles: localNews,
        refreshing: refreshingLocal,
        refetch: refetchLocal,
    } = useLocalNews();

    const fetchGlobalNews = useCallback(async () => {
        setRefreshingGlobal(true);
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
                setGlobalNews(formatted);
            } else {
                console.warn('⚠️ Unexpected global response format:', data);
                setGlobalNews(globalFallbackArticles);
            }
        } catch (err) {
            console.error('❌ Failed to fetch global news:', err);
            setGlobalNews(globalFallbackArticles);
        } finally {
            setRefreshingGlobal(false);
        }
    }, []);

    const handleRefresh = useCallback(async () => {
        if (activeTab === 'global') {
            await fetchGlobalNews();
        } else {
            await refetchLocal();
        }
    }, [activeTab, fetchGlobalNews, refetchLocal]);

    useEffect(() => {
        fetchGlobalNews();
    }, [fetchGlobalNews]);

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshingGlobal || refreshingLocal}
                            onRefresh={handleRefresh}
                        />
                    }
                >
                    {/* Tab Buttons */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'local' && styles.activeTab]}
                            onPress={() => setActiveTab('local')}
                        >
                            <Text style={styles.tabText}>Local News</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tabButton, activeTab === 'global' && styles.activeTab]}
                            onPress={() => setActiveTab('global')}
                        >
                            <Text style={styles.tabText}>Global News</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Global News Section */}
                    {activeTab === 'global' && (
                        <>
                            <Text style={styles.sectionTitle}>Global News</Text>
                            <FlatList
                                data={globalNews}
                                keyExtractor={(item, index) => index.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.horizontalList}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => item.url && Linking.openURL(item.url)}
                                    >
                                        <LinearGradient
                                            colors={['#ded6cbff', '#ded6cbff', '#ded6cbff']}
                                            style={styles.card}
                                        >
                                            <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                                            <Text style={styles.body} numberOfLines={3}>
                                                {item.description || 'No summary available.'}
                                            </Text>
                                            <Text style={styles.link}>View More</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            />
                        </>
                    )}

                    {/* Local News Section */}
                    {activeTab === 'local' && (
                        <>
                            <Text style={styles.sectionTitle}>Local News</Text>
                            <View style={styles.verticalList}>
                                {localNews.map((item) => {
                                    const link = item.url ?? item.source;
                                    if (!link || !link.startsWith('http')) return null;

                                    return (
                                        <TouchableOpacity key={item.id} onPress={() => Linking.openURL(link)}>
                                            <View style={styles.verticalCard}>
                                                <Text style={styles.title}>{item.title || 'Untitled'}</Text>
                                                <Text style={styles.body} numberOfLines={3}>
                                                    {item.summary ?? 'No summary available.'}
                                                </Text>
                                                <Text style={styles.link}>View More</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        marginHorizontal: 8,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
    },
    activeTab: {
        backgroundColor: Colors.actionPrimary,
    },
    tabText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
    },
});
