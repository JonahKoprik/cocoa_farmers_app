import { useFermentaries } from '@/hooks/useFermentary';
import { useWarehouses } from '@/hooks/useWarehouses';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type LLG = { llg_name: string };
type Province = { province_id: string; province_name: string };
type Category = 'Fermentary' | 'Warehouse';

export default function MarketPricesScreen() {
    const [selectedLLG, setSelectedLLG] = useState('');
    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [llgs, setLLGs] = useState<LLG[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [category, setCategory] = useState<Category>('Fermentary');

    const normalizedLLG = selectedLLG.trim();
    const normalizedProvinceName = selectedProvinceName.trim();

    const selectedProvinceId = provinces.find(
        (p) => p.province_name === normalizedProvinceName
    )?.province_id ?? null;

    const {
        data: fermentaries,
        loading: loadingFermentaries,
        error: errorFermentaries,
    } = useFermentaries(normalizedLLG);

    const {
        data: warehouses,
        loading: loadingWarehouses,
        error: errorWarehouses,
    } = useWarehouses(selectedProvinceId);

    useEffect(() => {
        const fetchLLGs = async () => {
            const { data, error } = await supabase.from('llg').select('llg_name');
            if (!error && data) setLLGs(data);
        };

        const fetchProvinces = async () => {
            const { data, error } = await supabase
                .from('provinces')
                .select('province_id, province_name');
            if (!error && data) setProvinces(data);
        };

        fetchLLGs();
        fetchProvinces();
    }, []);

    const renderFacilityCard = (
        f: any,
        index: number,
        label: 'Fermentary' | 'Warehouse'
    ) => (
        <View key={index} style={styles.card}>
            <Text style={styles.cardText}>
                {label} Name: {f.name || f.warehouse_name}
            </Text>
            <Text style={styles.cardText}>Contact: {f.contact || 'N/A'}</Text>
            <Text style={styles.cardText}>Owner: {f.owner_name || 'Unknown'}</Text>
            <Text style={styles.cardText}>Ward: {f.ward_name || 'N/A'}</Text>
            <Text style={styles.cardText}>LLG: {f.llg_name || 'N/A'}</Text>
            {f.price_per_kg != null && (
                <Text>
                    Wet Bean:{' '}
                    <Text style={styles.cardPrice}>
                        {f.price_per_kg.toFixed(2)} PGK/kg
                    </Text>
                </Text>
            )}
            {f.warehouse_price != null && (
                <Text>
                    Warehouse Price:{' '}
                    <Text style={styles.cardPrice}>
                        {f.warehouse_price.toFixed(2)} PGK/kg
                    </Text>
                </Text>
            )}
            <Text style={styles.cardFooter}>
                Updated: {new Date(f.updated_at || f.created_at).toLocaleDateString()}
            </Text>
        </View>
    );

    const renderCategoryToggle = () => (
        <View style={styles.toggleContainer}>
            {['Fermentary', 'Warehouse'].map((cat) => (
                <TouchableOpacity
                    key={cat}
                    style={[
                        styles.toggleButton,
                        category === cat && styles.toggleButtonActive,
                    ]}
                    onPress={() => setCategory(cat as Category)}
                >
                    <Text
                        style={[
                            styles.toggleText,
                            category === cat && styles.toggleTextActive,
                        ]}
                    >
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderPicker = () => {
        if (category === 'Fermentary') {
            return (
                <>
                    <Text style={styles.sectionTitle}>Select Your LLG</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedLLG}
                        onValueChange={setSelectedLLG}
                    >
                        <Picker.Item label="Select LLG" value="" />
                        {llgs.map((llg, i) => (
                            <Picker.Item key={i} label={llg.llg_name} value={llg.llg_name} />
                        ))}
                    </Picker>
                </>
            );
        }

        if (category === 'Warehouse') {
            return (
                <>
                    <Text style={styles.sectionTitle}>Select Province</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={selectedProvinceName}
                        onValueChange={setSelectedProvinceName}
                    >
                        <Picker.Item label="Select Province" value="" />
                        {provinces.map((prov, i) => (
                            <Picker.Item
                                key={i}
                                label={prov.province_name}
                                value={prov.province_name}
                            />
                        ))}
                    </Picker>
                </>
            );
        }

        return null;
    };

    const renderContent = () => {
        if (category === 'Fermentary') {
            if (!normalizedLLG)
                return (
                    <Text style={styles.loadingText}>
                        Please select an LLG to view fermentaries.
                    </Text>
                );
            if (loadingFermentaries)
                return <Text style={styles.loadingText}>Loading fermentaries...</Text>;
            if (errorFermentaries)
                return <Text style={styles.errorText}>Error: {errorFermentaries}</Text>;
            if (fermentaries.length === 0)
                return <Text style={styles.loadingText}>No fermentaries found.</Text>;
            return fermentaries.map((f, i) => renderFacilityCard(f, i, 'Fermentary'));
        }

        if (category === 'Warehouse') {
            if (!selectedProvinceId)
                return (
                    <Text style={styles.loadingText}>
                        Please select a province to view warehouses.
                    </Text>
                );
            if (loadingWarehouses)
                return <Text style={styles.loadingText}>Loading warehouses...</Text>;
            if (errorWarehouses)
                return <Text style={styles.errorText}>Error: {errorWarehouses}</Text>;
            if (warehouses.length === 0)
                return <Text style={styles.loadingText}>No warehouses found.</Text>;
            return warehouses.map((w, i) => renderFacilityCard(w, i, 'Warehouse'));
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {renderCategoryToggle()}
                {renderPicker()}
                {renderContent()}
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
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        marginHorizontal: 8,
        borderRadius: 20,
        backgroundColor: Colors.backgroundSecondary,
    },
    toggleButtonActive: {
        backgroundColor: Colors.actionPrimary,
    },
    toggleText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: Colors.backgroundSecondary,
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
        fontWeight: 'bold', color: Colors.actionPrimary,
    },
    cardFooter: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 8,
    },
});