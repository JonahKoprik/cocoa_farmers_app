import { useUser } from '@/context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientCard } from '../../components/GradientCard';
import { TipCard } from '../../components/TipCard';
import { Colors } from '../../constants/colors';
import { useFarmingTips } from '../../hooks/useFarmingTips';
import { usePrices } from '../../hooks/usePrice';
import { supabase } from '../../lib/supabaseClient';

export default function MarketPricesScreen() {
    const { globalPrices, loading, error } = usePrices();
    const { tips } = useFarmingTips();
    const { user } = useUser();

    const [farmerCount, setFarmerCount] = useState(0);
    const [fermentaryCount, setFermentaryCount] = useState(0);
    const [warehouseCount, setWarehouseCount] = useState(0);

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
                    .from('fermentary')
                    .select('*', { count: 'exact', head: true })
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

    const priceCards = globalPrices
        ? [
            {
                label: `${globalPrices.commodity ?? 'Commodity'} Info`,
                gradient: ['#D2B48C', '#D2B48C', '#D2B48C'],
                currency: globalPrices.currency ?? 'USD',
                region: globalPrices.region ?? 'Global',
                exchange: globalPrices.exchange ?? '—',
            },
        ]
        : [];

    const recommendedTips = tips.slice(0, 5);

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* 🟢 Market Prices */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Global Market Info</Text>
                        {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
                        <FlatList
                            horizontal
                            data={priceCards}
                            keyExtractor={(item) => item.label}
                            renderItem={({ item }) => (
                                <GradientCard colors={['#D2B48C', '#A0522D', '#8B4513']}>
                                    <Text style={styles.title}>{item.label}</Text>
                                    <Text style={styles.meta}>Region: {item.region}</Text>
                                    <Text style={styles.meta}>Currency: {item.currency}</Text>
                                    <Text style={styles.meta}>Exchange: {item.exchange}</Text>
                                </GradientCard>

                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        />
                    </View>

                    {/* 🧮 Province Stats */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📍 Province Overview</Text>
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

                    {/* 🌿 Recommended Tips */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🌿 Recommended Tips</Text>
                        <FlatList
                            horizontal
                            data={recommendedTips}
                            keyExtractor={(_, index) => `tip-${index}`}
                            renderItem={({ item }) => (
                                <GradientCard colors={['#cfbdb7ff', '#A1887F']}>
                                    <TipCard title={item.title} content={item.content} />
                                </GradientCard>
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        />
                    </View>

                    {/* 🔷 Graphs Placeholder */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📊 Graphs</Text>
                        <View style={styles.graphPlaceholder}>
                            <Text style={styles.emptyText}>
                                Coming soon: cocoa trends & activity graphs
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingVertical: 16 },
    section: { marginBottom: 24 },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    horizontalList: { paddingLeft: 16, paddingRight: 8 },
    title: {
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 6,
        fontWeight: '600',
    },
    meta: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    graphPlaceholder: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
    },
    statCard: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statLabel: {
        fontSize: 16,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 20,
        color: Colors.actionPrimary,
        fontWeight: 'bold',
    },
});
