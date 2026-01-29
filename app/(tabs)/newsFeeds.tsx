import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Linking,
    Platform,
    ScrollView,
    StatusBar,
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

type NewsTab = 'local' | 'global';

const localFallbackArticles: NewsArticle[] = [
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
    const [activeTab, setActiveTab] = useState<NewsTab>('local');
    const [isLoading, setIsLoading] = useState(false);

    const fetchNews = async (tab: NewsTab) => {
        setIsLoading(true);
        try {
            // For now, use fallback data based on tab
            // In production, you would fetch from different endpoints
            if (tab === 'local') {
                setArticles(localFallbackArticles);
            } else {
                setArticles(globalFallbackArticles);
            }
        } catch (err) {
            console.error('Failed to fetch cocoa news:', err);
            setArticles(tab === 'local' ? localFallbackArticles : globalFallbackArticles);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(activeTab);
    }, [activeTab]);

    const renderNewsCard = ({ item }: { item: NewsArticle }) => (
        <TouchableOpacity onPress={() => Linking.openURL(item.url)} activeOpacity={0.8}>
            <LinearGradient
                colors={activeTab === 'local' ? ['#2ecc71', '#27ae60'] : ['#3498db', '#2980b9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                {item.source && (
                    <View style={styles.sourceBadge}>
                        <Text style={styles.sourceText}>{item.source}</Text>
                    </View>
                )}
                <Text style={styles.cardTitle}>{item.title || 'Untitled'}</Text>
                <Text style={styles.cardBody}>{item.description || 'No summary available.'}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.link}>Read More</Text>
                    <Text style={styles.readArrow}>→</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderVerticalCard = (item: NewsArticle, index: number) => (
        <TouchableOpacity key={index} onPress={() => Linking.openURL(item.url)} activeOpacity={0.8}>
            <View style={styles.verticalCard}>
                <View style={styles.verticalCardHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: activeTab === 'local' ? '#2ecc71' : '#3498db' }]}>
                        <Text style={styles.categoryText}>{item.category || 'News'}</Text>
                    </View>
                    {item.source && (
                        <Text style={styles.verticalSource}>{item.source}</Text>
                    )}
                </View>
                <Text style={styles.verticalTitle}>{item.title || 'Untitled'}</Text>
                <Text style={styles.verticalBody} numberOfLines={2}>
                    {item.description || 'No summary available.'}
                </Text>
                <View style={styles.verticalFooter}>
                    <Text style={styles.link}>Read More</Text>
                    <Text style={styles.readArrow}>→</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2ecc71" />

            {/* Header */}
            <LinearGradient
                colors={['#2ecc71', '#27ae60', '#1e8449']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.pageTitle}>Agricultural News</Text>
                    <Text style={styles.pageSubtitle}>Stay informed</Text>
                </View>
            </LinearGradient>

            {/* Toggle Buttons */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'local' && styles.activeTab]}
                    onPress={() => setActiveTab('local')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={activeTab === 'local' ? ['#2ecc71', '#27ae60'] : ['#f0f0f0', '#e0e0e0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tabGradient}
                    >
                        <Text style={[styles.tabText, activeTab === 'local' && styles.activeTabText]}>
                            🇵🇬 Local News
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'global' && styles.activeTab]}
                    onPress={() => setActiveTab('global')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={activeTab === 'global' ? ['#3498db', '#2980b9'] : ['#f0f0f0', '#e0e0e0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.tabGradient}
                    >
                        <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
                            🌍 Global News
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Featured Stories (Horizontal) */}
                <Text style={styles.sectionTitle}>
                    {activeTab === 'local' ? '📰 Local Highlights' : '🌐 Global Headlines'}
                </Text>
                <FlatList
                    data={articles.slice(0, 3)}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                    renderItem={renderNewsCard}
                    scrollEnabled={false} // Disable scroll in FlatList since it's in a ScrollView
                />

                {/* Recent News (Vertical) */}
                <Text style={styles.sectionTitle}>
                    {activeTab === 'local' ? '🔔 Latest Updates' : '📈 Recent Stories'}
                </Text>
                <View style={styles.verticalList}>
                    {articles.map((item, index) => renderVerticalCard(item, index))}
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>
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
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    headerContent: {
        alignItems: 'flex-start',
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

    // Tab Container
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    tab: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    activeTab: {
        elevation: 5,
        shadowOpacity: 0.25,
    },
    tabGradient: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },

    // Scroll View
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
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
    link: {
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    verticalCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    verticalSource: {
        color: Colors.textSecondary,
        fontSize: 12,
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
