import CocoaWave from '@/components/CocoaWave';
import { Colors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { useProfileSubmission } from '@/hooks/useProfileSubmission';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TextInput, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user } = useUser();
    const { submitProfile } = useProfileSubmission(user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [llg, setLLG] = useState('');
    const [ward, setWard] = useState('');
    const [orgName, setOrgName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const [provinces, setProvinces] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [llgs, setLLGs] = useState<string[]>([]);
    const [wards, setWards] = useState<string[]>([]);

    const farmerGroup = ['Farmer'];
    const fermentaryGroup = ['FermentaryOwner'];
    const warehouseGroup = ['Warehouse'];
    const organizationGroup = ['Organization'];

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        supabase.from('provinces').select('province_name').then(({ data }) => {
            if (data) setProvinces(data.map(p => p.province_name));
        });
    }, []);

    useEffect(() => {
        if (!province || warehouseGroup.includes(role)) return;
        supabase
            .from('provinces')
            .select('province_id')
            .eq('province_name', province)
            .single()
            .then(({ data }) => {
                if (data) {
                    supabase
                        .from('districts')
                        .select('district_name')
                        .eq('province_id', data.province_id)
                        .then(({ data }) => {
                            if (data) setDistricts(data.map(d => d.district_name));
                        });
                }
            });
    }, [province, role]);

    useEffect(() => {
        if (!district || warehouseGroup.includes(role)) return;
        supabase
            .from('districts')
            .select('district_id')
            .eq('district_name', district)
            .single()
            .then(({ data }) => {
                if (data) {
                    supabase
                        .from('llg')
                        .select('llg_name')
                        .eq('district_id', data.district_id)
                        .then(({ data }) => {
                            if (data) setLLGs(data.map(l => l.llg_name));
                        });
                }
            });
    }, [district, role]);

    useEffect(() => {
        if (!llg || warehouseGroup.includes(role)) return;
        supabase
            .from('llg')
            .select('llg_id')
            .eq('llg_name', llg)
            .single()
            .then(({ data }) => {
                if (data) {
                    supabase
                        .from('ward')
                        .select('ward_name')
                        .eq('llg_id', data.llg_id)
                        .then(({ data }) => {
                            if (data) setWards(data.map(w => w.ward_name));
                        });
                }
            });
    }, [llg, role]);

    /////

    const renderPicker = (label: string, value: string, setValue: (val: string) => void, options: string[]) => (
        <View style={styles.pickerWrapper}>
            <Picker
                selectedValue={value}
                onValueChange={setValue}
                style={styles.picker}
                dropdownIconColor={Colors.textPrimary}
            >
                <Picker.Item label={`Select ${label}...`} value="" />
                {options.map((opt, i) => (
                    <Picker.Item label={opt} value={opt} />
                ))}
            </Picker>
        </View>
    );

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <CocoaWave />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.headerWrapper}>
                    <Text style={styles.headerText}>Create Your Profile</Text>
                </View>

                <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    {renderPicker('Role', role, setRole, [...farmerGroup, ...fermentaryGroup, ...warehouseGroup, ...organizationGroup])}
                    {renderPicker('Province', province, setProvince, provinces)}

                    <TextInput
                        placeholder="Email Address"
                        style={styles.input}
                        placeholderTextColor={Colors.textPrimary}
                        value={email}
                        onChangeText={setEmail}
                    />


                    {(farmerGroup.includes(role) || fermentaryGroup.includes(role)) && (
                        <>
                            {renderPicker('District', district, setDistrict, districts)}
                            {renderPicker('LLG', llg, setLLG, llgs)}
                            {renderPicker('Ward', ward, setWard, wards)}

                            <TextInput
                                style={styles.input}
                                placeholder="Your Full Name"
                                placeholderTextColor={Colors.textPrimary}
                                value={name}
                                onChangeText={setName}
                            />
                        </>
                    )}

                    {fermentaryGroup.includes(role) && (
                        <TextInput
                            style={styles.input}
                            placeholder="Fermentary Registration Number"
                            placeholderTextColor={Colors.textPrimary}
                            value={registrationNumber}
                            onChangeText={setRegistrationNumber}
                        />
                    )}

                    {warehouseGroup.includes(role) && (
                        <TextInput
                            style={styles.input}
                            placeholder="Exporter Name"
                            placeholderTextColor={Colors.textPrimary}
                            value={orgName}
                            onChangeText={setOrgName}
                        />
                    )}

                    {organizationGroup.includes(role) && (
                        <TextInput
                            style={styles.input}
                            placeholder="Organization Name"
                            placeholderTextColor={Colors.textPrimary}
                            value={orgName}
                            onChangeText={setOrgName}
                        />
                    )}

                    {loading ? (
                        <View style={styles.loadingWrapper}>
                            <Text style={styles.loadingText}>Submitting...</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={async () => {
                                // Common required fields
                                if (!email || !role || !province) {
                                    alert("Please fill in Email, Role, and Province.");
                                    return;
                                }

                                // Role-specific validation
                                if (role === "Farmer") {
                                    if (!name || !district || !llg || !ward) {
                                        alert("Please complete all Farmer fields.");
                                        return;
                                    }
                                }

                                if (role === "FermentaryOwner") {
                                    if (!name || !district || !llg || !ward || !registrationNumber) {
                                        alert("Please complete all Fermentary Owner fields.");
                                        return;
                                    }
                                }

                                if (role === "Warehouse") {
                                    if (!orgName) {
                                        alert("Please enter Exporter Name.");
                                        return;
                                    }
                                }

                                if (role === "Organization") {
                                    if (!orgName) {
                                        alert("Please enter Organization Name.");
                                        return;
                                    }
                                }
                                const payload = {
                                    id: user?.id || '',
                                    email: user?.email || '',
                                    name,
                                    role,
                                    province,
                                    district,
                                    llg,
                                    ward,
                                    orgName,
                                    registrationNumber,
                                    farmerGroup,
                                    warehouseGroup,
                                };

                                console.log('Submitting profile payload:', payload); // ✅ Debug output

                                await submitProfile(payload);
                                router.replace('/(tabs)');
                            }
                            }
                        >
                            <Text style={styles.buttonText}>Submit Profile</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    headerWrapper: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        color: Colors.textPrimary,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    pickerWrapper: {
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 8,
        marginBottom: 12,
    },
    picker: {
        color: Colors.textPrimary,
        paddingHorizontal: 12,
    },
    emailWrapper: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: Colors.backgroundSecondary,
        borderRadius: 8,
    },
    emailText: {
        color: Colors.textPrimary,
    },

    loadingWrapper: {
        alignItems: 'center',
        marginVertical: 12,
    },
    loadingText: {
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    button: {
        backgroundColor: Colors.actionPrimary,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },


});