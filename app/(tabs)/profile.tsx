import { Colors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const { user, logout } = useUser();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // or .Videos or .All
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
            // TODO: Upload image to Supabase storage and update profile `avatar_url`
        }
    };

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

            const payload = {
                id: user.id,
                email: user.email,
                full_name: name,
                role,
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

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Profile Management</Text>
            </View>
            <View style={styles.container}>
                <TouchableOpacity onPress={pickImage}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>Upload Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor={Colors.textPrimary}
                    value={name}
                    onChangeText={setName}
                />

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={Colors.textPrimary}
                    >
                        <Picker.Item label="Select role..." value="" />
                        <Picker.Item label="Farmer" value="farmer" />
                        <Picker.Item label="Fermentary Owner" value="Fermentary Owner" />
                        <Picker.Item label="Exporter" value="exporter" />
                        <Picker.Item label="Organization" value="organization" />
                    </Picker>
                </View>

                <Button title="Save Profile" onPress={handleSave} color={Colors.actionPrimary} />

                <View style={{ marginTop: 16 }}>
                    <Button title="Logout" onPress={logout} color={Colors.actionPrimary} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
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
    container: {
        padding: 16,
        backgroundColor: '#e6eef3',
        flex: 1,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    avatarText: {
        color: Colors.textPrimary,
        fontSize: 14,
    },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        color: Colors.textPrimary,
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    label: {
        color: Colors.textPrimary,
        marginBottom: 4,
        fontWeight: 'bold',
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
