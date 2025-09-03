import { Colors } from '@/constants/colors';
import { useState } from 'react';
import { FlatList, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TipCard } from '../../components/TipCard';
import { useFarmingTips } from '../../hooks/useFarmingTips';

const videoResources = [
    { title: 'How To Start a Successful Cocoa Farm as a BEGINNER', url: 'https://www.youtube.com/watch?v=Q0jP6FTcxF8' },
    { title: 'Good Agricultural Practices on Cocoa Farms', url: 'https://www.youtube.com/watch?v=M3cy9MuHT7k' },
    { title: 'Best Cocoa Growing Tips - How To Get Return Of Investment', url: 'https://www.youtube.com/watch?v=0tXnZSkuxLY' },
    { title: 'Integrated Cocoa Farming Explained: Complete Guide', url: 'https://www.youtube.com/watch?v=wrdE-FYUefg' },
    { title: 'Some Guide Necessary or Needed when Cultivate Cocoa', url: 'https://www.youtube.com/watch?v=RAkPCPo8Oxw' },
    { title: 'Agroforestry: New method of cocoa farming / Kenema District', url: 'https://www.youtube.com/watch?v=T2tdHW6dDwg' },
];

const documentResources = [
    { title: 'Cocoa Fermentation Manual (PDF)', url: 'https://example.com/cocoa-fermentation-manual.pdf' },
    { title: 'Integrated Cocoa Farming Guide (PDF)', url: 'https://example.com/integrated-cocoa-guide.pdf' },
];

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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                {renderToggle()}

                {activeCategory === 'tips' && (
                    <>
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
                        <Text style={styles.heading}>All Farming Tips</Text>
                        <View style={styles.verticalList}>
                            {tips.map((tip, index) => (
                                <View key={index} style={styles.card}>
                                    <TipCard title={tip.title} content={tip.content} />
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {activeCategory === 'videos' && (
                    <>
                        <Text style={styles.heading}>Cocoa Farming Videos</Text>
                        <View style={styles.verticalList}>
                            {videoResources.map((video, index) => (
                                <View key={index} style={styles.card}>
                                    {renderLink(video)}
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {activeCategory === 'documents' && (
                    <>
                        <Text style={styles.heading}>Cocoa Farming Documents</Text>
                        <View style={styles.verticalList}>
                            {documentResources.map((doc, index) => (
                                <View key={index} style={styles.card}>
                                    {renderLink(doc)}
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
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
        color: '#fff',
    },
});
