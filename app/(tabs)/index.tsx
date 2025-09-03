import { HeaderBar } from '@/components/HeaderBar';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { GradientCard } from "../../components/GradientCard";
import { TipCard } from '../../components/TipCard';
import { PriceCard } from "../../components/types/PriceCard";
import { Colors } from '../../constants/colors';
import { useFarmingTips } from '../../hooks/useFarmingTips';
import { usePrices } from '../../hooks/usePrice';
import { useRecentPosts } from '../../hooks/useRecentPosts';


// HOME SCREEN - COMBINES PRICES, TIPS, AND RECENT POSTS
export default function MarketPricesScreen() {
    const { localPrices, globalPrices } = usePrices();
    const { tips } = useFarmingTips();
    const { posts } = useRecentPosts();


    const priceCards: PriceCard[] = [
        {
            label: 'Wet Bean Price',
            value: typeof localPrices?.wet === 'number' ? localPrices.wet : null,
            gradient: ['#D2B48C', '#D2B48C', '#D2B48C'],
            currency: 'PGK/kg',
        },
        {
            label: 'Dry Bean Price',
            value: typeof localPrices?.dry === 'number' ? localPrices.dry : null,
            gradient: ['#D2B48C', '#D2B48C', '#D2B48C'],
            currency: 'PGK/kg',
        },
        {
            label: 'Global Cocoa Price',
            value: typeof globalPrices?.global === 'number' ? globalPrices.global : null,
            gradient: ['#D2B48C', '#D2B48C', '#D2B48C'],
            currency: 'USD/ton',
        },
    ];

    const recommendedTips = tips.slice(0, 5);
    const recentTips = tips.slice(5, 10);

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBar userName="JK" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 🟢 Market Prices */}
                <Text style={styles.sectionTitle}>Market Prices</Text>
                <FlatList
                    horizontal
                    data={priceCards}
                    keyExtractor={(item) => item.label}
                    renderItem={({ item }) => (
                        <GradientCard colors={item.gradient}>
                            <Text style={styles.title}>{item.label}</Text>
                            <Text style={styles.price}>
                                {typeof item.value === 'number'
                                    ? `${item.value.toFixed(2)} ${item.currency}`
                                    : 'Unavailable'}
                            </Text>
                        </GradientCard>
                    )}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalList}
                />

                {/* 🟡 Recommended Tips */}
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

                {/* 🔷 Recent Activities */}
                <Text style={styles.sectionTitle}>Graphs</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary, // Steel Gray
    },
    scrollContent: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary, // Black text
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    horizontalList: {
        paddingLeft: 16,
        paddingRight: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        color: Colors.textPrimary, // Black text
        marginBottom: 6,
        fontWeight: '600',
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.actionPrimary, // Leaf Green for emphasis
    },
    detailSection: {
        paddingHorizontal: 16,
        backgroundColor: Colors.backgroundSecondary, // White cards
        borderRadius: 8,
        paddingVertical: 12,
        marginBottom: 16,
    },
    emptyText: {
        color: '#666', // Slightly muted black
        fontStyle: 'italic',
        paddingVertical: 8,
    },
});
