import { useFermentaries } from '@/hooks/useFermentary';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';

import type { Warehouse } from '@/components/types/warehouseType';
import type { Fermentary } from '@/hooks/useFermentary';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type Ward = { ward_name: string };
type Category = 'Fermentary' | 'Warehouse';

const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        alert(message);
    }
};

export default function MarketPricesScreen() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPrice, setNewPrice] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [wards, setWards] = useState<Ward[]>([]);
    const [prices, setPrices] = useState<any[]>([]);

    const [category, setCategory] = useState<Category>('Fermentary');
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loadingWarehouses, setLoadingWarehouses] = useState(false);
    const [errorWarehouses, setErrorWarehouses] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const normalizedWard = selectedWard.trim();
    const {
        data: fermentaries,
        loading: loadingFermentaries,
        error: errorFermentaries,
    } = useFermentaries(normalizedWard);

    /**
     * Fetch fermentary prices for the current user's ward
     */
    const fetchPrices = async () => {
        try {
            const { data: session } = await supabase.auth.getUser();
            const email = session?.user?.email;
            if (!email) {
                console.warn("User not authenticated—skipping price fetch");
                return;
            }

            // Get ward_id from user_profile
            const { data: userData, error: userError } = await supabase
                .from("user_profile")
                .select("ward_id")
                .eq("email", email)
                .single();

            const wardId = userData?.ward_id?.trim();
            if (userError || !wardId) {
                console.warn("Ward not found for user—skipping price fetch");
                return;
            }

            // Fetch fermentaries in that ward
            const { data, error } = await supabase
                .from("fermentary")
                .select("*")
                .eq("ward_id", wardId);

            if (!error && data) {
                setPrices(data);
            } else {
                console.error("Failed to fetch fermentary prices:", error?.message);
            }
        } catch (err: any) {
            console.error("Unexpected error during price fetch:", err.message);
        }
    };

    const handleCreatePrice = async () => {
        try {
            const parsedPrice = parseFloat(newPrice);

            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                showToast('Please enter a valid price');
                return;
            }

            const { data: session } = await supabase.auth.getUser();
            const userId = session?.user?.id;
            if (!userId) throw new Error("User not authenticated");

            // Fetch fermentary owned by user
            const { data: fermentary, error: fetchError } = await supabase
                .from('fermentary')
                .select('fermentary_id')
                .eq('owner_id', userId)
                .single();

            if (fetchError || !fermentary) {
                console.error('Fermentary not found for user:', userId);
                showToast('No fermentary linked to your account');
                return;
            }

            // Update fermentary price
            const { error: updateError } = await supabase
                .from('fermentary')
                .update({ price_per_kg: parsedPrice })
                .eq('fermentary_id', fermentary.fermentary_id);

            if (updateError) {
                console.error('Failed to update fermentary price:', updateError.message);
                showToast('Failed to update price');
                return;
            }

            // Success: reset form and trigger refresh
            setShowCreateForm(false);
            setNewPrice('');
            setRefreshKey(prev => prev + 1);
            showToast('Price updated successfully');
            await fetchPrices();

        } catch (error: any) {
            console.error('Unexpected error:', error.message);
            showToast('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        const fetchWards = async () => {
            try {
                const { data: session } = await supabase.auth.getUser();
                const email = session?.user?.email;
                if (!email) return;

                const { data: userData, error: userError } = await supabase
                    .from("user_profile")
                    .select("llg_id")
                    .eq("email", email)
                    .single();

                const llgId = userData?.llg_id?.trim();
                if (userError || !llgId) return;

                const { data: wardData, error: wardError } = await supabase
                    .from("ward")
                    .select("ward_name")
                    .eq("llg_id", llgId);

                const cleaned = wardData
                    ?.map((w) => ({ ward_name: w.ward_name?.trim() }))
                    .filter((w): w is Ward => !!w.ward_name);
                setWards(cleaned ?? []);
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
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

            if (userError || !users) {
                setErrorWarehouses('Failed to fetch warehouse-role users');
                setLoadingWarehouses(false);
                return;
            }

            const provinceIds = Array.from(
                new Set(
                    (users ?? [])
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

        fetchWards();
        fetchUserRole();
        fetchPrices();
        fetchWarehousesFromWarehouseUsers();
    }, [selectedWard, category, refreshKey]);

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

    /**
     * Filtering fermentaries of a LLG based on the ward/Village of the user
     */
    const renderPicker = () => {
        if (category === 'Fermentary') {
            return (
                <>
                    <Text style={styles.sectionTitle}>Select Your Village</Text>
                    <Picker style={styles.picker} selectedValue={selectedWard} onValueChange={setSelectedWard}>
                        <Picker.Item label="Select Ward" value="" />
                        {wards.map((ward, i) => (
                            <Picker.Item testID={`ward-${i}`} label={ward.ward_name} value={ward.ward_name} />
                        ))}
                    </Picker>
                </>
            );
        }

        if (category === 'Warehouse') {
            return <Text style={styles.sectionTitle}>Warehouses in your province</Text>;
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
                                onPress={handleCreatePrice}
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
                                    const parsedPrice = parseFloat(newPrice);
                                    if (isNaN(parsedPrice)) {
                                        showToast('Please enter a valid price');
                                        return;
                                    }

                                    const { data: session, error: sessionError } = await supabase.auth.getUser();
                                    if (sessionError) {
                                        console.error('Failed to get user session:', sessionError.message);
                                        return;
                                    }

                                    const userId = session?.user?.id;
                                    if (!userId) {
                                        console.error('No user ID found');
                                        return;
                                    }

                                    const { data: warehouse, error: fetchError } = await supabase
                                        .from('warehouse')
                                        .select('warehouse_id')
                                        .eq('user_id', userId)
                                        .single();

                                    if (fetchError || !warehouse) {
                                        console.error('No warehouse found for user:', userId);
                                        showToast('No warehouse linked to your account');
                                        return;
                                    }

                                    const { error: updateError } = await supabase
                                        .from('warehouse')
                                        .update({ warehouse_price: parsedPrice })
                                        .eq('warehouse_id', warehouse.warehouse_id);

                                    if (updateError) {
                                        console.error('Failed to update warehouse price:', updateError.message);
                                        showToast('Failed to update price');
                                    } else {
                                        setShowCreateForm(false);
                                        setNewPrice('');
                                        setRefreshKey((prev) => prev + 1);
                                        showToast('Price updated successfully');
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

    /**
     * Renders a card for a fermentary or warehouse facility
     */
    const renderFacilityCard = (
        f: any,
        label: 'Fermentary' | 'Warehouse'
    ): React.ReactElement => (
        <View style={styles.card}>
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
                    Dried Bean Price: <Text style={styles.cardPrice}>{f.warehouse_price.toFixed(2)} PGK/bag</Text>
                </Text>
            )}
        </View>
    );

    const renderContent = () => {
        if (category === 'Fermentary') {
            if (!normalizedWard) return <Text style={styles.loadingText}>Please select a village to view fermentaries.</Text>;
            if (loadingFermentaries) return <Text style={styles.loadingText}>Loading fermentaries...</Text>;
            if (errorFermentaries) return <Text style={styles.errorText}>Error: {errorFermentaries}</Text>;
            if (fermentaries.length === 0) return <Text style={styles.loadingText}>No fermentaries found.</Text>;
            return fermentaries.map((f: Fermentary, i: number) =>
                renderFacilityCard(f, 'Fermentary')
            );
        }

        if (category === 'Warehouse') {
            if (loadingWarehouses) return <Text style={styles.loadingText}>Loading warehouses...</Text>;
            if (errorWarehouses) return <Text style={styles.errorText}>Error: {errorWarehouses}</Text>;
            if (warehouses.length === 0) return <Text style={styles.loadingText}>No warehouses found.</Text>;
            return warehouses.map((w: Warehouse, i: number) =>
                renderFacilityCard(w, 'Warehouse')
            );
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
