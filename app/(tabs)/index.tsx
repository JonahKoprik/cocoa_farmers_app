import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { PostCard } from '../../components/PostCard';
import { TipCard } from '../../components/TipCard';
import { PriceCard } from '../../components/types/PriceCard';
import { ActivityPost } from '../../components/types/activityPost';
import { Colors } from '../../constants/colors';
import { useFarmingTips } from '../../hooks/useFarmingTips';
import { usePrices } from '../../hooks/usePrice';
import { useRecentPosts } from '../../hooks/useRecentPosts';

const { width } = Dimensions.get('window');

export default function Dashboard() {
    const { localPrices, globalPrices } = usePrices();
    const { tips } = useFarmingTips();
    const { posts } = useRecentPosts();

    const scrollY = useRef(new Animated.Value(0)).current;

    const cardRadius = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 20],
        extrapolate: 'clamp',
    });

    const priceCards: PriceCard[] = [
        {
            label: 'Wet Bean Price', value: localPrices?.wet, currency: 'PGK/kg',
            gradient: ['#2ecc71', '#27ae60']
        },
        {
            label: 'Dry Bean Price', value: localPrices?.dry, currency: 'PGK/kg',
            gradient: ['#3498db', '#2980b9']
        },
        {
            label: 'Global Cocoa Price', value: globalPrices?.global, currency: 'USD/ton',
            gradient: ['#e74c3c', '#c0392b']
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Static Top Header */}
            <View style={styles.header}>
                <Text style={styles.headerName}>Hello, Jonah</Text>
                <Text style={styles.headerLocation}>Waigani, NCD, Papua New Guinea</Text>
            </View>

            {/* Scrollable Bottom Content (single darker background) */}
            <Animated.ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Market Prices */}
                <Animated.View
                    style={[
                        styles.section,
                        { borderTopLeftRadius: cardRadius, borderTopRightRadius: cardRadius },
                    ]}
                >
                    <Text style={styles.sectionTitle}>📈 Market Prices</Text>

                    <FlatList
                        horizontal
                        data={priceCards}
                        keyExtractor={(item) => item.label}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                        renderItem={({ item }) => (
                            <View style={styles.whiteCard}>
                                <Text style={styles.cardTitle}>{item.label}</Text>
                                <Text style={styles.cardValue}>
                                    {typeof item.value === 'number'
                                        ? `${item.value.toFixed(2)} ${item.currency}`
                                        : 'Unavailable'}
                                </Text>
                            </View>
                        )}
                    />
                </Animated.View>

                {/* Recommended Tips */}
                <Animated.View
                    style={[
                        styles.section,
                        { borderTopLeftRadius: cardRadius, borderTopRightRadius: cardRadius },
                    ]}
                >
                    <Text style={styles.sectionTitle}>🌿 Recommended Tips</Text>

                    {tips.slice(0, 5).map((tip, index) => (
                        <View key={index} style={styles.whiteCardFull}>
                            <TipCard title={tip.title} content={tip.content} />
                        </View>
                    ))}
                </Animated.View>

                {/* Recent Posts */}
                <Animated.View
                    style={[
                        styles.section,
                        { borderTopLeftRadius: cardRadius, borderTopRightRadius: cardRadius },
                    ]}
                >
                    <Text style={styles.sectionTitle}>🕓 Recent Posts</Text>

                    {posts.length === 0 ? (
                        <Text style={styles.emptyText}>No recent activity yet. Be the first to post!</Text>
                    ) : (
                        posts.map((post: ActivityPost, index) => (
                            <View key={index} style={styles.whiteCardFull}>
                                <PostCard post={post} currentUserId="JK" />
                            </View>
                        ))
                    )}
                </Animated.View>

                <View style={{ height: 28 }} />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e6eef3' }, // darker common background for bottom area

    /* Header (static) */
    header: {
        backgroundColor: '#2ecc71',
        paddingTop: 36,
        paddingBottom: 18,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: 'flex-start',
    },
    headerName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 6,

        // fontFamily: 'Inter_700Bold', // ensure Inter is loaded in App entry
    },
    headerLocation: {
        fontSize: 14,
        color: '#f1f7f2',
        // fontFamily: 'Inter_400Regular',
    },

    /* Scroll area */
    scrollArea: { flex: 1, backgroundColor: '#e6eef3' },
    scrollContent: { padding: 20, paddingTop: 18 },

    /* Section container sits on the darker background; top corners animate */
    section: {
        backgroundColor: 'transparent',
        marginBottom: 20,
        paddingVertical: 6,
        paddingHorizontal: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
        // fontFamily: 'Inter_700Bold',
    },

    /* Horizontal list spacing */
    horizontalList: { paddingVertical: 8 },

    /* Small white card used for price tiles */
    whiteCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginRight: 12,
        width: Math.round(width * 0.45),
        // subtle shadow
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
        // fontFamily: 'Inter_600SemiBold',
    },
    cardValue: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        // fontFamily: 'Inter_700Bold',
    },

    /* Full-width white card for tips and posts */
    whiteCardFull: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        // full width
        width: '100%',
        // subtle shadow
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },

    emptyText: {
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 12,
    },
});
