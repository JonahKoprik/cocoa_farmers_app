import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import { useFermentaries } from '../../hooks/useFermentary';

type LLG = {
    name: string;
};

export default function MarketPricesScreen() {
    const [ward, setDistrict] = useState('');
    const [llg, setDistricts] = useState<LLG[]>([]);
    const { data: fermentaries, loading, error } = useFermentaries(ward);

    useEffect(() => {
        supabase
            .from('llg')
            .select('name')
            .then(({ data, error }) => {
                if (error) {
                    console.error('Error fetching LLGs:', error);
                } else {
                    setDistricts(data ?? []);
                }
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Local Bean Price</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 🔶 Section Title */}
                <Text style={styles.sectionTitle}>Select Your LLG</Text>

                {/* 🔽 Picker Dropdown */}
                <Picker style={styles.picker} selectedValue={ward} onValueChange={setDistrict}>
                    <Picker.Item label="Select LLG" value="" />
                    {llg.map((d, i) => (
                        <Picker.Item key={i} label={d.name} value={d.name} />
                    ))}
                </Picker>

                {/* ⚠️ Error Message */}
                {error && <Text style={styles.errorText}>Error: {error}</Text>}

                {/* ⏳ Loading or 🧱 Fermentary Cards */}
                <Text style={styles.sectionTitle}>Fermentaries</Text>
                {loading ? (
                    <Text style={styles.loadingText}>Loading fermentaries...</Text>
                ) : (
                    fermentaries.map((f, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.cardText}>Fermentary Name: {f.fermentary_name}</Text>
                            <Text style={styles.cardText}>Contact: {f.contact || 'N/A'}</Text>
                            <Text style={styles.cardText}>Owner: {f.owner_name || 'Unknown'}</Text>
                            <Text style={styles.cardText}>Ward ID: {f.ward_id || 'N/A'}</Text>
                            <Text style={styles.cardPrice}>{f.price_per_kg.toFixed(2)} PGK/kg</Text>
                            <Text style={styles.cardFooter}>
                                Updated: {new Date(f.updated_at).toLocaleDateString()}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    header: {
        backgroundColor: '#2ecc71', // green header like sign-in
        paddingVertical: 20,
        paddingHorizontal: 20,

        alignItems: 'flex-start',
    },
    pageTitle: {
        fontSize: 22,
        paddingTop: 40,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
    },
    scrollContent: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.backgroundSecondary,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    picker: {
        backgroundColor: Colors.backgroundSecondary,
        marginHorizontal: 16,
        marginBottom: 16,
        color: Colors.textPrimary,
    },
    errorText: {
        color: 'red',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    loadingText: {
        color: Colors.textPrimary,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    card: {
        padding: 16,
        backgroundColor: Colors.backgroundSecondary,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    cardText: {
        fontSize: 14,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    cardPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.backgroundSecondary,
        marginTop: 8,
    },
    cardFooter: {
        fontSize: 12,
        color: Colors.textPrimary,
        marginTop: 4,
    },
});
