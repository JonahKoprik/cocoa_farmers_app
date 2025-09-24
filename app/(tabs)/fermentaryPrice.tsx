import { useFermentaries } from '@/hooks/useFermentary';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';

import { useEffect, useState } from 'react';
import {
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


// MarketPricesScreen.tsx
export default function MarketPricesScreen() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPrice, setNewPrice] = useState('');
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

    const renderFacilityCard = (
        f: any,
        index: number,
        label: 'Fermentary' | 'Warehouse'
    ) => (
        <View key={index} style={styles.card}>
            {/* Facility Name */}
            <Text style={styles.cardText}>
                {label} Name: {label === 'Fermentary' ? f.fermentary_name : f.warehouse_name}
            </Text>

            {/* Fermentary-specific fields */}
            {label === 'Fermentary' && (
                <>
                    {f.owner_name && (
                        <Text style={styles.cardText}>
                            Owner: <Text style={styles.cardPrice}>{f.owner_name}</Text>
                        </Text>
                    )}
                    {f.llg_name && (
                        <Text style={styles.cardText}>
                            LLG: <Text style={styles.cardPrice}>{f.llg_name}</Text>
                        </Text>
                    )}
                    {f.ward_name && (
                        <Text style={styles.cardText}>
                            Village: <Text style={styles.cardPrice}>{f.ward_name}</Text>
                        </Text>
                    )}
                    {f.price_per_kg != null && (
                        <Text style={styles.cardText}>
                            Wet Bean: <Text style={styles.cardPrice}>{f.price_per_kg.toFixed(2)} PGK/kg</Text>
                        </Text>
                    )}
                </>
            )}

            {/* Warehouse-specific price */}
            {label === 'Warehouse' && f.warehouse_price != null && (
                <Text style={styles.cardText}>
                    Warehouse Price: <Text style={styles.cardPrice}>{f.warehouse_price.toFixed(2)} PGK/kg</Text>
                </Text>
            )}

            {/* Updated timestamp */}
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
                        style={[styles.toggleButton, category === cat && styles.toggleButtonActive]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text style={[styles.toggleText, category === cat && styles.toggleTextActive]}>{cat}</Text>
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
                    <Picker style={styles.picker} selectedValue={selectedLLG} onValueChange={setSelectedLLG}>
                        <Picker.Item label="Select LLG" value="" />
                        {llgs.map((llg, i) => (
                            <Picker.Item key={i} label={llg.llg_name} value={llg.llg_name} />
                        ))}
                    </Picker>
                </>
            );
        }

        if (category === 'Warehouse') {
            return <Text style={styles.sectionTitle}>View nearby warehouses in your province</Text>;
        }

        return null;
    };

    const renderCreatePriceButton = () => {
        if (!userRole) return null;

        const isFarmer = userRole === 'farmer';
        const isFermentaryOwner = userRole === 'fermentaryowner';
        const isWarehouseUser = userRole === 'warehouse';

        if (isFarmer) return null;

        if (category === 'Fermentary' && isFermentaryOwner) {
            return (
                <>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => setShowCreateForm((prev) => !prev)}
                    >
                        <Text style={styles.createButtonText}>
                            {showCreateForm ? 'Cancel' : 'Create Fermentary Price'}
                        </Text>
                    </TouchableOpacity>

                    {showCreateForm && (
                        <View style={styles.formContainer}>
                            <Text style={styles.formLabel}>Enter Price (PGK/kg):</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={newPrice}
                                onChangeText={setNewPrice}
                                placeholder="e.g. 10.00"
                            />
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={async () => {
                                    const { data: session } = await supabase.auth.getUser();
                                    const userId = session?.user?.id;
                                    if (!userId) return;

                                    const { data: fermentary, error: fetchError } = await supabase

                                        .from('fermentary')
                                        .select('fermentary_id')
                                        .eq('owner_id', userId)
                                        .single();

                                    if (fetchError || !fermentary) {
                                        console.log('Authenticated user ID:', userId);

                                        console.error('Fermentary not found for user');
                                        return;
                                    }

                                    const { error: updateError } = await supabase
                                        .from('fermentary')
                                        .update({ price_per_kg: parseFloat(newPrice) })
                                        .eq('fermentary_id', fermentary.fermentary_id);

                                    if (updateError) {
                                        console.error('Failed to update price:', updateError.message);
                                    } else {
                                        console.log('Fermentary price updated successfully');
                                        setShowCreateForm(false);
                                        setNewPrice('');

                                    }
                                }}
                            >
                                <Text style={styles.submitButtonText}>Submit Price</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            );
        }

        if (category === 'Warehouse' && isWarehouseUser) {
            return (
                <>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => setShowCreateForm((prev) => !prev)}
                    >
                        <Text style={styles.createButtonText}>
                            {showCreateForm ? 'Cancel' : 'Create Warehouse Price'}
                        </Text>
                    </TouchableOpacity>

                    {showCreateForm && (
                        <View style={styles.formContainer}>
                            <Text style={styles.formLabel}>Enter Price (PGK/kg):</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={newPrice}
                                onChangeText={setNewPrice}
                                placeholder="e.g. 12.50"
                            />
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={async () => {
                                    console.log('🔄 Submit button pressed');
                                    console.log('Entered price:', newPrice);

                                    const parsedPrice = parseFloat(newPrice);
                                    if (isNaN(parsedPrice)) {
                                        console.error('❌ Invalid price input');
                                        return;
                                    }

                                    const { data: session, error: sessionError } = await supabase.auth.getUser();
                                    if (sessionError) {
                                        console.error('❌ Failed to get user session:', sessionError.message);
                                        return;
                                    }

                                    const userId = session?.user?.id;
                                    console.log('✅ Authenticated user ID:', userId);
                                    if (!userId) {
                                        console.error('❌ No user ID found');
                                        return;
                                    }

                                    const { data: warehouse, error: fetchError } = await supabase
                                        .from('warehouse')
                                        .select('warehouse_id')
                                        .eq('user_id', userId)
                                        .single();

                                    if (fetchError) {
                                        console.error('❌ Error fetching warehouse:', fetchError.message);
                                        return;
                                    }

                                    if (!warehouse) {
                                        console.warn('⚠️ No warehouse found for user:', userId);
                                        return;
                                    }

                                    console.log('🏢 Found warehouse:', warehouse.warehouse_id);

                                    const { error: updateError } = await supabase
                                        .from('warehouse')
                                        .update({ warehouse_price: parsedPrice })
                                        .eq('warehouse_id', warehouse.warehouse_id);

                                    if (updateError) {
                                        console.error('❌ Failed to update warehouse price:', updateError.message);
                                    } else {
                                        console.log('✅ Warehouse price updated successfully');
                                        setShowCreateForm(false);
                                        setNewPrice('');
                                    }
                                }}
                            >
                                <Text style={styles.submitButtonText}>Submit Price</Text>
                            </TouchableOpacity>


                        </View>
                    )}
                </>
            );
        }

        return null;
    };

    const renderContent = () => {
        if (category === 'Fermentary') {
            if (!normalizedLLG) return <Text style={styles.loadingText}>Please select an LLG to view fermentaries.</Text>;
            if (loadingFermentaries) return <Text style={styles.loadingText}>Loading fermentaries...</Text>;
            if (errorFermentaries) return <Text style={styles.errorText}>Error: {errorFermentaries}</Text>;
            if (fermentaries.length === 0) return <Text style={styles.loadingText}>No fermentaries found.</Text>;
            return fermentaries.map((f, i) => renderFacilityCard(f, i, 'Fermentary'));
        }

        if (category === 'Warehouse') {
            if (loadingWarehouses) return <Text style={styles.loadingText}>Loading warehouses...</Text>;
            if (errorWarehouses) return <Text style={styles.errorText}>Error: {errorWarehouses}</Text>;
            if (warehouses.length === 0) return <Text style={styles.loadingText}>No warehouses found.</Text>;
            return warehouses.map((w, i) => renderFacilityCard(w, i, 'Warehouse'));
        }

        return null;
    };
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundPrimary }}>
            <View style={styles.container}>
                {renderCategoryToggle()}
                {renderPicker()}
                {renderCreatePriceButton()}
                <View style={{ flex: 1 }}>
                    {renderContent()}

                </View>
            </View>
        </SafeAreaView>
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
    }, formContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 10,
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
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});
