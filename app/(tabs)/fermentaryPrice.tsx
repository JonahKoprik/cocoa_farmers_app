import { useFermentaries } from '@/hooks/useFermentary';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
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
type Category = 'Fermentary' | 'Warehouse';

export default function MarketPricesScreen() {
    const [selectedLLG, setSelectedLLG] = useState('');
    const [llgs, setLLGs] = useState<LLG[]>([]);
    const [category, setCategory] = useState<Category>('Fermentary');
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loadingWarehouses, setLoadingWarehouses] = useState(false);
    const [errorWarehouses, setErrorWarehouses] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const normalizedLLG = selectedLLG.trim();

    const {
        data: fermentaries,
        loading: loadingFermentaries,
        error: errorFermentaries,
    } = useFermentaries(normalizedLLG);

    useEffect(() => {
        const fetchLLGs = async () => {
            const { data, error } = await supabase.from('llg').select('llg_name');
            if (!error && data) setLLGs(data);
        };

        const fetchUserRole = async () => {
            const { data: session } = await supabase.auth.getUser();
            const email = session?.user?.email;
            if (!email) return;

            const { data, error } = await supabase
                .from('user_profile')
                .select('role')
                .eq('email', email)
                .single();

            if (!error && data?.role) {
                const role = data.role.toLowerCase();
                setUserRole(role);
                if (['warehouse', 'organization'].includes(role)) {
                    setCategory('Warehouse');
                }
            }
        };

        const fetchWarehousesFromWarehouseUsers = async () => {
            setLoadingWarehouses(true);
            setErrorWarehouses(null);

            const { data: users, error: userError } = await supabase
                .from('user_profile')
                .select('province_id')
                .eq('role', 'warehouse');

            if (userError || !users) {
                setErrorWarehouses('Failed to fetch warehouse-role users');
                setLoadingWarehouses(false);
                return;
            }

            const provinceIds = Array.from(
                new Set(users.map((u) => u.province_id).filter(Boolean))
            );

            if (provinceIds.length === 0) {
                setWarehouses([]);
                setLoadingWarehouses(false);
                return;
            }

            const { data: warehouseData, error: warehouseError } = await supabase
                .from('warehouse')
                .select('*')
                .in('province_id', provinceIds);

            if (warehouseError || !warehouseData) {
                setErrorWarehouses('Failed to fetch warehouses');
                setWarehouses([]);
            } else {
                setWarehouses(warehouseData);
            }

            setLoadingWarehouses(false);
        };

        fetchLLGs();
        fetchUserRole();
        fetchWarehousesFromWarehouseUsers();
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

    const renderCategoryToggle = () => {
        const allowedCategories: Category[] =
            userRole && ['warehouse', 'organization'].includes(userRole)
                ? ['Warehouse']
                : ['Fermentary', 'Warehouse'];

        return (
            <View style={styles.toggleContainer}>
                {allowedCategories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.toggleButton,
                            category === cat && styles.toggleButtonActive,
                        ]}
                        onPress={() => setCategory(cat)}
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
    };

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
                <Text style={styles.sectionTitle}>
                    View nearby warehouses in your province
                </Text>
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
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {renderCategoryToggle()}
                    {renderPicker()}
                    {renderContent()}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontWeight: 'bold',
        color: Colors.actionPrimary,
    },
    cardFooter: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 8,
    },
});
