import { HeaderBar } from '@/components/HeaderBar';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GradientCard } from '../../components/GradientCard';
import { PostCard } from '../../components/PostCard';
import { PriceRow } from '../../components/PriceRow';
import { TipCard } from '../../components/TipCard';
import { ActivityPost } from '../../components/types/activityPost';
import { Colors } from '../../constants/colors';
import { useFarmingTips } from '../../hooks/useFarmingTips';
import { usePrices } from '../../hooks/usePrice';
import { useRecentPosts } from '../../hooks/useRecentPosts';
import { supabase } from '../../lib/supabaseClient';

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

    const [farmerCount, setFarmerCount] = useState(0);
    const [fermentaryCount, setFermentaryCount] = useState(0);
    const [warehouseCount, setWarehouseCount] = useState(0);
    const [user, setUser] = useState<{ email?: string }>({});

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data?.user || {});
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCounts = async () => {
            if (!user?.email) return;

            const { data: profile } = await supabase
                .from('user_profile')
                .select('province_id')
                .eq('email', user.email)
                .single();

            const provinceId = profile?.province_id;
            if (!provinceId) return;

            const [{ count: farmers }, { count: fermentaries }, { count: warehouses }] = await Promise.all([
                supabase
                    .from('user_profile')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'Farmer')
                    .eq('province_id', provinceId),

                supabase
                    .from('user_profile')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'FermentaryOwner')
                    .eq('province_id', provinceId),

                supabase
                    .from('warehouse')
                    .select('*', { count: 'exact', head: true })
                    .eq('province_id', provinceId),
            ]);

            setFarmerCount(farmers ?? 0);
            setFermentaryCount(fermentaries ?? 0);
            setWarehouseCount(warehouses ?? 0);
        };

        fetchCounts();
    }, [user?.email]);

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

                {/* ── Province Stats ── */}
                <View style={styles.section}>
                    <SectionHeader title=" Province Statistic Overview" />
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Farmers</Text>
                            <Text style={styles.statValue}>{farmerCount}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Fermentary Owners</Text>
                            <Text style={styles.statValue}>{fermentaryCount}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Warehouses</Text>
                            <Text style={styles.statValue}>{warehouseCount}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Graphs Placeholder ── */}
                <View style={styles.section}>
                    <SectionHeader title="Graphs & Trends" />
                    <View style={styles.graphPlaceholder}>
                        <Text style={styles.emptyText}>
                            Coming soon: cocoa trends & activity graphs
                        </Text>
                    </View>
                </View>

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
                            {recentTips.map((tip, index) =>
                                React.cloneElement(<TipFeedCard tip={tip} />, { key: `recent-tip-${index}` })
                            )}
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
                        posts.map((post: ActivityPost, index: number) =>
                            React.cloneElement(<PostFeedCard post={post} />, { key: `recent-post-${index}` })
                        )
                    )}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </SafeAreaView>
    );
}

// ── Feed card wrappers ──
function TipFeedCard({ tip }: { tip: FarmingTip }) {
    return (
        <View style={styles.feedCard}>
            <TipCard title={tip.title} content={tip.content} />
        </View>
    );
}

function PostFeedCard({ post }: { post: ActivityPost }) {
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
        backgroundColor: '#F5F0EB',
    },
    scrollContent: {
        paddingBottom: 24,
    },
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
        color: '#2C1A0E',
        letterSpacing: 0.2,
    },
    horizontalList: {
        paddingLeft: 16,
        paddingRight: 8,
    },
    section: {
        marginTop: 16,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.backgroundSecondary,
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.actionPrimary,
    },
    graphPlaceholder: {
        marginHorizontal: 16,
        height: 120,
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    tipCardOverride: {
        minWidth: 220,
        maxWidth: 260,
        marginRight: 12,
        borderRadius: 14,
    },
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
        fontSize: 40,
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
    },
    bottomSpacer: {
        height: 40,
    },
});
