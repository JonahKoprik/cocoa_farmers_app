import { Colors } from '@/constants/colors';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TipCard } from '../../components/TipCard';
import { useFarmingTips } from '../../hooks/useFarmingTips';

export default function FarmingTipsScreen() {
    const { tips } = useFarmingTips();

    const fermentationTips = tips.filter((tip) =>
        tip.title.toLowerCase().includes('ferment')
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
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
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
            <View style={styles.verticalList}>
                {tips.map((tip, index) => (
                    <View key={index} style={styles.card}>
                        <TipCard title={tip.title} content={tip.content} />
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingVertical: 16,
        backgroundColor: Colors.backgroundPrimary,
    },
    section: {
        marginBottom: 24,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    horizontalList: {
        paddingLeft: 16,
        paddingRight: 8,
    },
    verticalList: {
        paddingHorizontal: 16,
    },
    card: {
        marginBottom: 16,
        marginRight: 12,
    },
});
