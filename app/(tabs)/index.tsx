import { HeaderBar } from '@/components/HeaderBar';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GradientCard } from '../../components/GradientCard';
import { PostCard } from '../../components/PostCard';
import { PriceRow } from '../../components/PriceRow';
import { TipCard } from '../../components/TipCard';
import { PriceCard } from '../../components/types/PriceCard';
import { ActivityPost } from '../../components/types/activityPost';
import { Colors } from '../../constants/colors';
import { useFarmingTips } from '../../hooks/useFarmingTips';
import { usePrices } from '../../hooks/usePrice';
import { useRecentPosts } from '../../hooks/useRecentPosts';

interface FarmingTip {
    title: string;
    content: string;
}

// Cocoa-themed gradient palettes for price cards
const PRICE_GRADIENTS: readonly [string, string][] = [
    ['#6B4226', '#A0522D'], // Wet Bean — rich cocoa brown
    ['#3E2723', '#6D4C41'], // Dry Bean — dark roast
    ['#1A237E', '#3949AB'], // Global — deep indigo
];

export default function MarketPricesScreen() {
    const { localPrices, globalPrices } = usePrices();
    const { tips } = useFarmingTips();
    const { posts } = useRecentPosts();

    const priceCards: PriceCard[] = [
        {
            label: 'Wet Bean Price',
            value: typeof localPrices?.wet === 'number' ? localPrices.wet : null,
            gradient: PRICE_GRADIENTS[0],
            currency: 'PGK/kg',
        },
        {
            label: 'Dry Bean Price',
            value: typeof localPrices?.dry === 'number' ? localPrices.dry : null,
            gradient: PRICE_GRADIENTS[1],
            currency: 'PGK/kg',
        },
        {
            label: 'Global Cocoa Price',
            value: typeof globalPrices?.global === 'number' ? globalPrices.global : null,
            gradient: PRICE_GRADIENTS[2],
            currency: 'USD/ton',
        },
    ];

    const recommendedTips = tips.slice(0, 5);
    const recentTips = tips.slice(5, 10);

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBar userName="JK" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Hero Banner ── */}
                <LinearGradient
                    colors={['#3E2723', '#6B4226', '#A0522D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroBanner}
                >
                    <Text style={styles.heroLabel}>Today's Market</Text>
                    <Text style={styles.heroValue}>
                        {typeof localPrices?.dry === 'number'
                            ? `K ${localPrices.dry.toFixed(2)} / kg`
                            : 'Loading…'}
                    </Text>
                    <Text style={styles.heroSub}>Local Dry Bean · PGK</Text>
                </LinearGradient>

                {/* ── Market Prices ── */}
                <SectionHeader title="📈 Market Prices" />
                <FlatList<PriceCard>
                    horizontal
                    data={priceCards}
                    keyExtractor={(item: PriceCard) => item.label}
                    renderItem={({ item }: { item: PriceCard }) => (
                        <GradientCard colors={item.gradient} style={styles.priceCardOverride}>
                            <Text style={styles.priceCardLabel}>{item.label}</Text>
                            <Text style={styles.priceCardValue}>
                                {typeof item.value === 'number'
                                    ? item.value.toFixed(2)
                                    : '—'}
                            </Text>
                            <Text style={styles.priceCardCurrency}>{item.currency}</Text>
                        </GradientCard>
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                />

                {/* ── Price Summary ── */}
                <SectionHeader title="💰 Price Summary" />
                <View style={styles.summaryCard}>
                    <PriceRow label="Local Dry Bean Price" value={localPrices?.dry ?? null} />
                    <View style={styles.divider} />
                    <PriceRow label="Global Cocoa Price" value={globalPrices?.global ?? null} currency="USD" />
                </View>

                {/* ── Recommended Tips ── */}
                <SectionHeader title="🌿 Recommended Tips" />
                <FlatList<FarmingTip>
                    horizontal
                    data={recommendedTips}
                    keyExtractor={(_item: FarmingTip, index: number) => `tip-${index}`}
                    renderItem={({ item }: { item: FarmingTip }) => (
                        <GradientCard colors={['#4E342E', '#795548'] as const} style={styles.tipCardOverride}>
                            <TipCard title={item.title} content={item.content} />
                        </GradientCard>
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                />

                {/* ── Recent Tips ── */}
                {recentTips.length > 0 && (
                    <>
                        <SectionHeader title="📋 Recent Tips" />
                        <View style={styles.feedSection}>
                            {recentTips.map((tip, index) => (
                                <TipFeedCard key={`recent-tip-${index}`} tip={tip} />
                            ))}
                        </View>
                    </>
                )}

                {/* ── Recent Posts ── */}
                <SectionHeader title="🕓 Recent Posts" />
                <View style={styles.feedSection}>
                    {posts.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🌱</Text>
                            <Text style={styles.emptyTitle}>No posts yet</Text>
                            <Text style={styles.emptyText}>Be the first to share an update!</Text>
                        </View>
                    ) : (
                        posts.map((post: ActivityPost, index: number) => (
                            <PostFeedCard key={`recent-post-${index}`} post={post} />
                        ))
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ── Feed card wrappers (key-safe for React 19 + @types/react-native 0.72) ──
function TipFeedCard({ tip }: React.Attributes & { tip: FarmingTip }) {
    return (
        <View style={styles.feedCard}>
            <TipCard title={tip.title} content={tip.content} />
        </View>
    );
}

function PostFeedCard({ post }: React.Attributes & { post: ActivityPost }) {
    return (
        <View style={styles.feedCard}>
            <PostCard post={post} currentUserId="JK" />
        </View>
    );
}

// ── Reusable section header component ──
function SectionHeader({ title }: { title: string }) {
    return (
        <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionAccent} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F0EB', // warm off-white background
    },
    scrollContent: {
        paddingBottom: 24,
    },

    // ── Hero Banner ──
    heroBanner: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#3E2723',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
            },
            android: { elevation: 8 },
        }),
    },
    heroLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    heroValue: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    heroSub: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
    },

    // ── Section Header ──
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 10,
    },
    sectionAccent: {
        width: 4,
        height: 20,
        borderRadius: 2,
        backgroundColor: Colors.actionPrimary,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#2C1A0E', // deep cocoa
        letterSpacing: 0.2,
    },

    // ── Horizontal Lists ──
    horizontalList: {
        paddingLeft: 16,
        paddingRight: 8,
    },

    // ── Price Cards ──
    priceCardOverride: {
        minWidth: 160,
        maxWidth: 200,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginRight: 12,
        borderRadius: 14,
    },
    priceCardLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.75)',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    priceCardValue: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    priceCardCurrency: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.65)',
        marginTop: 4,
        fontWeight: '500',
    },

    // ── Price Summary Card ──
    summaryCard: {
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingVertical: 4,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
            },
            android: { elevation: 3 },
        }),
    },
    divider: {
        height: 1,
        backgroundColor: '#F0EBE6',
        marginVertical: 2,
    },

    // ── Tip Cards (horizontal) ──
    tipCardOverride: {
        minWidth: 220,
        maxWidth: 260,
        marginRight: 12,
        borderRadius: 14,
    },

    // ── Feed Section (vertical list) ──
    feedSection: {
        marginHorizontal: 16,
        gap: 10,
    },
    feedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.07,
                shadowRadius: 5,
            },
            android: { elevation: 2 },
        }),
    },

    // ── Empty State ──
    emptyState: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 4,
            },
            android: { elevation: 2 },
        }),
    },
    emptyIcon: {
        fontSize: 36,
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C1A0E',
        marginBottom: 4,
    },
    emptyText: {
        fontSize: 13,
        color: '#6B4226',
        textAlign: 'center',
    },

    // ── Bottom Spacer ──
    bottomSpacer: {
        height: 32,
    },
});
