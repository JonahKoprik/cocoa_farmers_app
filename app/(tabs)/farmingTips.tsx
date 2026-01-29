import { Colors } from '@/constants/colors';
import React from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { TipCard } from '../../components/TipCard';
import { useFarmingTips } from '../../hooks/useFarmingTips';

const { width } = Dimensions.get('window');

export default function FarmingTipsScreen() {
    const { tips } = useFarmingTips();

    const fermentationTips = tips.filter((tip) =>
        tip.title.toLowerCase().includes('ferment')
    );

    return (
        <SafeAreaView style={styles.safe}>
            {/* Static Top View (always visible) */}
            <View style={styles.header}>
                <Text style={styles.tabTitle}>Farming Tips</Text>
                <Text style={styles.tabSubtitle}>Practical advice for better yields</Text>
            </View>

            {/* Scrollable Bottom View */}
            <ScrollView contentContainerStyle={styles.container}>
                {/* 🟤 Fermentation Carousel */}
                {fermentationTips.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.heading}>Fermentation Best Practices</Text>
                        <FlatList
                            horizontal
                            data={fermentationTips}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.tile}>
                                    <TipCard title={item.title} content={item.content} />
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalList}
                        />
                    </View>
                )}

                {/* 🟡 Full Tip List */}
                <Text style={styles.heading}>All Farming Tips</Text>
                <View style={styles.verticalList}>
                    {tips.map((tip, index) => (
                        <View key={index} style={styles.fullWidthCard}>
                            <TipCard title={tip.title} content={tip.content} />
                        </View>
                    ))}
                </View>

                {/* bottom spacing so last card scrolls above header */}
                <View style={{ height: 28 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        height: 100,
        backgroundColor: Colors.backgroundPrimary,
    },
    /* Static header */
    header: {
        backgroundColor: '#2ecc71', // green header like sign-in
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        alignItems: 'flex-start',
    },
    tabTitle: {
        fontSize: 22,
        paddingTop: 40,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
    },
    tabSubtitle: {
        fontSize: 13,
        color: '#f1f7f2',
    },

    /* Scrollable content container */
    container: {
        paddingTop: 18,
        paddingBottom: 24,
        paddingHorizontal: 16,
        backgroundColor: '#e6eef3',
    },

    section: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 12,
    },

    horizontalList: {
        paddingLeft: 2,
        paddingRight: 8,
    },

    /* small tile for horizontal carousel */
    tile: {
        width: Math.round(width * 0.72),
        marginRight: 12,
        marginBottom: 8,
    },

    /* full width cards for vertical list */
    verticalList: {
        paddingBottom: 8,
    },
    fullWidthCard: {
        width: '100%',
        marginBottom: 12,
    },
});
