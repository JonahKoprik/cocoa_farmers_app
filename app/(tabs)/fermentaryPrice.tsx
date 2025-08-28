import { useFermentaries } from '@/hooks/useFermentary';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

type LLG = { llg_name: string };

export default function MarketPricesScreen() {
    const [selectedLLG, setSelectedLLG] = useState('');
    const [llgs, setLLGs] = useState<LLG[]>([]);

    const normalizedLLG = selectedLLG.trim();
    const { data: fermentaries, loading, error } = useFermentaries(normalizedLLG);

    useEffect(() => {
        const fetchLLGs = async () => {
            const { data, error } = await supabase.from('llg').select('llg_name');
            if (error) {
                console.error('Error fetching LLGs:', error.message);
            } else {
                setLLGs(data ?? []);
            }
        };
        fetchLLGs();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Select Your LLG</Text>

                <Picker style={styles.picker} selectedValue={selectedLLG} onValueChange={setSelectedLLG}>
                    <Picker.Item label="Select LLG" value="" />
                    {llgs.map((llg, i) => (
                        <Picker.Item key={i} label={llg.llg_name} value={llg.llg_name} />
                    ))}
                </Picker>

                {error && (
                    <Text style={styles.errorText}>
                        Error loading fermentaries: {typeof error === 'string' ? error : 'Unknown error'}
                    </Text>
                )}

                <Text style={styles.sectionTitle}>Fermentaries</Text>
                {loading ? (
                    <Text style={styles.loadingText}>Loading fermentaries...</Text>
                ) : !normalizedLLG ? (
                    <Text style={styles.loadingText}>Please select an LLG to view fermentaries.</Text>
                ) : fermentaries.length === 0 ? (
                    <Text style={styles.loadingText}>
                        No fermentaries found for "{normalizedLLG}". Try another LLG or check spelling.
                    </Text>
                ) : (
                    fermentaries.map((f, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.cardText}>Fermentary Name: {f.fermentary_name}</Text>
                            <Text style={styles.cardText}>Contact: {f.contact || 'N/A'}</Text>
                            <Text style={styles.cardText}>Owner: {f.owner_name || 'Unknown'}</Text>
                            <Text style={styles.cardText}>Ward: {f.ward_name || 'N/A'}</Text>
                            <Text style={styles.cardText}>LLG: {f.llg_name || 'N/A'}</Text>
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
