import { Colors } from '@/constants/colors';
import { useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TipCard } from '../../components/TipCard';
import { useFarmingTips } from '../../hooks/useFarmingTips';

interface Tip {
    title: string;
    content: string;
}

export default function FarmingTipsScreen() {
    const { tips } = useFarmingTips();
    const [activeCategory, setActiveCategory] = useState<'tips' | 'videos' | 'documents'>('tips');

    const fermentationTips = tips.filter((tip) =>
        tip.title.toLowerCase().includes('ferment')
    );

    const renderLink = ({ title, url }: { title: string; url: string }) => (
        <TouchableOpacity onPress={() => Linking.openURL(url)} style={styles.linkCard}>
            <Text style={styles.linkText}>{title}</Text>
        </TouchableOpacity>
    );

    const renderToggle = () => (
        <View style={styles.toggleContainer}>
            {['tips', 'videos', 'documents'].map((key) => (
                <Pressable
                    key={key}
                    onPress={() => setActiveCategory(key as any)}
                    style={[
                        styles.toggleButton,
                        activeCategory === key && styles.toggleActive,
                    ]}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            activeCategory === key && styles.toggleTextActive,
                        ]}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                </Pressable>
            ))}
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 🟤 Fermentation Carousel */}
            {fermentationTips.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.heading}>Fermentation Best Practices</Text>
                    <FlatList
                        horizontal
                        data={fermentationTips}
                        keyExtractor={(_item: Tip, index: number) => index.toString()}
                        renderItem={({ item }: { item: Tip }) => (
                            <View style={styles.card}>
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
            <FlatList
                data={tips}
                keyExtractor={(_item: Tip, index: number) => index.toString()}
                renderItem={({ item }: { item: Tip }) => (
                    <View style={styles.card}>
                        <TipCard title={item.title} content={item.content} />
                    </View>
                )}
                scrollEnabled={false}
                contentContainerStyle={styles.verticalList}
            />
        </ScrollView>
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
        backgroundColor: Colors.actionPrimary,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
    },
    tabTitle: {
        fontSize: 22,
        paddingTop: 40,
        fontWeight: '900',
        color: Colors.backgroundSecondary,
        marginBottom: 4,
    },
    tabSubtitle: {
        fontSize: 13,
        color: Colors.backgroundSecondary,
    },

    /* Scrollable content container */
    container: {
        flexGrow: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.backgroundPrimary,
    },

    section: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.backgroundSecondary,
        marginBottom: 12,
    },

    horizontalList: {
        paddingLeft: 2,
        paddingRight: 8,
    },

    /* small tile for horizontal carousel */
    tile: {
        width: 280,
        marginRight: 12,
        marginBottom: 8,
    },

    /* full width cards for vertical list */
    verticalList: {
        paddingBottom: 8,
    },
    card: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fullWidthCard: {
        width: '100%',
        marginBottom: 12,
    },
    linkCard: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 12,
        borderRadius: 8,
    },
    linkText: {
        color: Colors.actionPrimary,
        fontSize: 16,
        fontWeight: '500',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
    },
    toggleActive: {
        backgroundColor: Colors.actionPrimary,
    },
    toggleText: {
        color: Colors.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    toggleTextActive: {
        color: Colors.backgroundSecondary,
    },
});
