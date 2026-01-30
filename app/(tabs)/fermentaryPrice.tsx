import { useFermentaries } from '@/hooks/useFermentary';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';

import type { Warehouse } from '@/components/types/warehouseType';
import type { Fermentary } from '@/hooks/useFermentary';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type LLG = { llg_name: string };
type Category = 'Fermentary' | 'Warehouse';

export default function MarketPricesScreen() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPrice, setNewPrice] = useState('');
    const [selectedLLG, setSelectedLLG] = useState('');
    const [llgs, setLLGs] = useState<LLG[]>([]);
    const [category, setCategory] = useState<Category>('Fermentary');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
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
                const role = data.role.trim().toLowerCase();
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
                .ilike('role', 'warehouse');

            if (userError) {
                setErrorWarehouses('Failed to fetch warehouse-role users');
                setLoadingWarehouses(false);
                return;
            }

            const provinceIds = Array.from(
                new Set(
                    users
                        .map((u) => typeof u.province_id === 'string' ? u.province_id.trim() : null)
                        .filter((id): id is string => !!id && id.length > 0)
                )
            );

            if (provinceIds.length === 0) {
                setWarehouses([]);
                setLoadingWarehouses(false);
                return;
            }

            const { data: warehouseData, error: warehouseError } = await supabase
                .from('warehouse')
                .select('warehouse_id, warehouse_name, warehouse_price, created_at, province_id, user_id')
                .in('province_id', provinceIds);

            if (warehouseError) {
                setErrorWarehouses('Failed to fetch warehouses');
                setWarehouses([]);
            } else {
                setWarehouses(warehouseData ?? []);
            }

            setLoadingWarehouses(false);
        };

        fetchLLGs();
        fetchUserRole();
        fetchWarehousesFromWarehouseUsers();
    }, []);

    const renderCategoryToggle = () => (
        <View style={styles.toggleContainer}>
            <TouchableOpacity
                style={[styles.toggleButton, category === 'Fermentary' && styles.toggleButtonActive]}
                onPress={() => setCategory('Fermentary')}
            >
                <Text style={[styles.toggleText, category === 'Fermentary' && styles.toggleTextActive]}>
                    Fermentary
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.toggleButton, category === 'Warehouse' && styles.toggleButtonActive]}
                onPress={() => setCategory('Warehouse')}
            >
                <Text style={[styles.toggleText, category === 'Warehouse' && styles.toggleTextActive]}>
                    Warehouse
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderPicker = () => (
        <>
            <Text style={styles.sectionTitle}>Select Your LLG</Text>
            <Picker
                style={styles.picker}
                selectedValue={selectedLLG}
                onValueChange={(itemValue: string) => setSelectedLLG(itemValue)}
            >
                <Picker.Item label="Select LLG" value="" />
                {llgs.map((llg: LLG, index: number) => (
                    <Picker.Item key={index} label={llg.llg_name} value={llg.llg_name} />
                ))}
            </Picker>
        </>
    );

    const renderCreatePriceButton = () => {
        if (userRole !== 'warehouse' && userRole !== 'organization') return null;

        return (
            <TouchableOpacity style={styles.createButton} onPress={() => setShowCreateForm(!showCreateForm)}>
                <Text style={styles.createButtonText}>
                    {showCreateForm ? 'Cancel' : 'Create New Price'}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderCreatePriceForm = () => {
        if (!showCreateForm) return null;

        const handleSubmit = async () => {
            if (!newPrice || !selectedLLG) return;

            const { error } = await supabase.from('fermentary_price').insert({
                llg_name: selectedLLG,
                price_per_kg: parseFloat(newPrice),
            });

            if (error) {
                alert('Failed to create price: ' + error.message);
            } else {
                setNewPrice('');
                setShowCreateForm(false);
                alert('Price created successfully!');
            }
        };

        return (
            <View style={styles.formContainer}>
                <Text style={styles.formLabel}>New Price (PGK/kg)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={newPrice}
                    onChangeText={setNewPrice}
                    placeholder="Enter price"
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderFacilityCard = (item: any, index: number, type: Category) => {
        const displayName = type === 'Fermentary' ? item.fermentary_name : item.warehouse_name;
        const displayContact = type === 'Fermentary' ? item.contact : 'N/A';
        const displayOwner = type === 'Fermentary' ? item.owner_name : 'Unknown';
        const displayPrice = type === 'Fermentary' ? item.price_per_kg : item.warehouse_price;

        return (
            <View key={index} style={styles.card}>
                <Text style={styles.cardText}>{type} Name: {displayName}</Text>
                <Text style={styles.cardText}>Contact: {displayContact}</Text>
                <Text style={styles.cardText}>Owner: {displayOwner}</Text>
                <Text style={styles.cardPrice}>{displayPrice?.toFixed(2)} PGK/kg</Text>
                <Text style={styles.cardFooter}>
                    Updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}
                </Text>
            </View>
        );
    };

    const renderContent = () => {
        if (category === 'Fermentary') {
            if (!normalizedLLG) return <Text style={styles.loadingText}>Please select an LLG to view fermentaries.</Text>;
            if (loadingFermentaries) return <Text style={styles.loadingText}>Loading fermentaries...</Text>;
            if (errorFermentaries) return <Text style={styles.errorText}>Error: {errorFermentaries}</Text>;
            if (fermentaries.length === 0) return <Text style={styles.loadingText}>No fermentaries found.</Text>;
            return fermentaries.map((f: Fermentary, i: number) => renderFacilityCard(f, i, 'Fermentary'));
        }

        if (category === 'Warehouse') {
            if (loadingWarehouses) return <Text style={styles.loadingText}>Loading warehouses...</Text>;
            if (errorWarehouses) return <Text style={styles.errorText}>Error: {errorWarehouses}</Text>;
            if (warehouses.length === 0) return <Text style={styles.loadingText}>No warehouses found.</Text>;
            return warehouses.map((w: Warehouse, i: number) => renderFacilityCard(w, i, 'Warehouse'));
        }

        return null;
    };

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    {renderCategoryToggle()}
                    {renderPicker()}
                    {renderCreatePriceButton()}
                    {renderCreatePriceForm()}
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {renderContent()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#2ecc71',
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
    formContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 10,
        marginHorizontal: 16,
    },
    formLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: Colors.actionPrimary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
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
        marginTop: 8,
    },
    cardFooter: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 8,
    },
    createButton: {
        backgroundColor: Colors.actionPrimary,
        padding: 12,
        marginVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
