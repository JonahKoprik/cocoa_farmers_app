import { Colors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, logout } = useUser();

    // Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [llg, setLLG] = useState('');
    const [ward, setWard] = useState('');

    // Dropdown options
    const [provinces, setProvinces] = useState<string[]>([]);
    const [districts, setDistricts] = useState<string[]>([]);
    const [llgs, setLLGs] = useState<string[]>([]);
    const [wards, setWards] = useState<string[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            const { data, error } = await supabase.from('provinces').select('province_name');
            if (!error && data) setProvinces(data.map((p) => p.province_name));
        };
        fetchProvinces();
    }, []);

    // Fetch districts based on selected province
    useEffect(() => {
        if (!province) return;

        const fetchDistricts = async () => {
            const { data: provinceData, error: provinceError } = await supabase
                .from('provinces')
                .select('province_id')
                .eq('province_name', province)
                .single();

            if (provinceError || !provinceData) {
                console.error('Error fetching province_id:', provinceError?.message);
                return;
            }

            const provinceId = provinceData.province_id;

            const { data, error } = await supabase
                .from('districts')
                .select('district_name')
                .eq('province_id', provinceId);

            if (!error && data) {
                setDistricts(data.map((d) => d.district_name));
            } else {
                console.error('Error fetching districts:', error?.message);
            }
        };

        fetchDistricts();
    }, [province]);

    // Fetch LLGs based on selected district
    useEffect(() => {
        if (!district) return;

        const fetchLLGs = async () => {
            const { data: districtData, error: districtError } = await supabase
                .from('districts')
                .select('district_id')
                .eq('district_name', district)
                .single();

            if (districtError || !districtData) {
                console.error('Error fetching district_id:', districtError?.message);
                return;
            }

            const districtId = districtData.district_id;

            const { data, error } = await supabase
                .from('llg')
                .select('llg_name')
                .eq('district_id', districtId);

            if (!error && data) {
                setLLGs(data.map((l) => l.llg_name));
            } else {
                console.error('Error fetching LLGs:', error?.message);
            }
        };

        fetchLLGs();
    }, [district]);

    // Fetch wards based on selected LLG
    useEffect(() => {
        if (!llg) return;

        const fetchWards = async () => {
            const { data: llgData, error: llgError } = await supabase
                .from('llg')
                .select('llg_id')
                .eq('llg_name', llg)
                .single();

            if (llgError || !llgData) {
                console.error('Error fetching llg_id:', llgError?.message);
                return;
            }

            const llgId = llgData.llg_id;

            const { data, error } = await supabase
                .from('ward')
                .select('ward_name')
                .eq('llg_id', llgId);

            if (!error && data) {
                setWards(data.map((w) => w.ward_name));
            } else {
                console.error('Error fetching wards:', error?.message);
            }
        };

        fetchWards();
    }, [llg]);

    const handleSave = async () => {
        if (!user?.id || !user.email) return;

        try {
            const { data: existingProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            const { data: provinceData } = await supabase
                .from('provinces')
                .select('province_id')
                .eq('province_name', province)
                .single();

            const { data: districtData } = await supabase
                .from('districts')
                .select('district_id')
                .eq('district_name', district)
                .single();

            const { data: llgData } = await supabase
                .from('llg')
                .select('llg_id')
                .eq('llg_name', llg)
                .single();

            const { data: wardData } = await supabase
                .from('ward')
                .select('ward_id')
                .eq('ward_name', ward)
                .single();

            const payload = {
                id: user.id,
                email: user.email,
                full_name: name,
                role,
                province_id: provinceData?.province_id,
                district_id: districtData?.district_id,
                llg_id: llgData?.llg_id,
                ward_id: wardData?.ward_id,
                created_at: existingProfile ? undefined : new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert(payload, { onConflict: 'id' });

            if (upsertError) {
                Alert.alert('Error', 'Failed to save profile');
                console.error('Upsert error:', upsertError.message);
            } else {
                await SecureStore.setItemAsync('user_role', role);
                Alert.alert('Success', 'Profile saved successfully');
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            Alert.alert('Error', 'Unexpected error while saving profile');
        }
    };

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
                    <Picker.Item key={i} label={opt} value={opt} />
                ))}
            </Picker>
        </View>
    );

    // Render the profile form
    return (
        // Use SafeAreaView to ensure content is within safe area
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundPrimary }}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor={Colors.textPrimary}
                    value={name}
                    onChangeText={setName}
                />
                {renderPicker('Role', role, setRole, ['Farmer', 'Fermentary Owner', 'Exporter', 'Organization'])}
                {renderPicker('Province', province, setProvince, provinces)}
                {renderPicker('District', district, setDistrict, districts)}
                {renderPicker('LLG', llg, setLLG, llgs)}
                {renderPicker('Ward', ward, setWard, wards)}

                <Button title="Save Profile" onPress={handleSave} color={Colors.actionPrimary} />
                <View style={{ marginTop: 16 }}>
                    <Button title="Logout" onPress={logout} color={Colors.actionPrimary} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colors.backgroundPrimary,
        flex: 1,
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
});
