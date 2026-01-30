import { Colors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface MenuOptionProps {
    icon: string;
    title: string;
    onPress: () => void;
    showDivider?: boolean;
}

const MenuOption = ({ icon, title, onPress, showDivider = true }: MenuOptionProps) => (
    <>
        <TouchableOpacity style={styles.menuOption} onPress={onPress}>
            <Text style={styles.menuIcon}>{icon}</Text>
            <Text style={styles.menuTitle}>{title}</Text>
            <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        {showDivider && <View style={styles.divider} />}
    </>
);

export default function ProfileScreen() {
    const { user, logout } = useUser();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const openEditForm = () => {
        setIsEditModalVisible(true);
    };

    const closeEditForm = () => {
        setIsEditModalVisible(false);
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
                phone,
                location,
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
                closeEditForm();
            }
        } catch (err) {
            console.error('Error saving profile:', err);
            Alert.alert('Error', 'Unexpected error while saving profile');
        }
    };

    const handleAccountSettings = () => {
        Alert.alert('Account Settings', 'Manage your account settings here');
    };

    const handleHelpSupport = () => {
        Alert.alert('Help & Support', 'Contact us for support');
    };

    const handleAbout = () => {
        Alert.alert('About', 'Cocoa Farmers App v1.0\nConnecting cocoa farmers across Ghana');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.pageTitle}>Menu</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* User Account Section */}
                <View style={styles.accountSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarIcon}>📷</Text>
                                <Text style={styles.avatarText}>Add Photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

                    <TouchableOpacity style={styles.updateButton} onPress={openEditForm}>
                        <Text style={styles.updateButtonText}>Update Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Menu Options Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <MenuOption
                        icon="⚙️"
                        title="Account Settings"
                        onPress={handleAccountSettings}
                    />

                    <View style={styles.menuOption}>
                        <View style={styles.menuOptionContent}>
                            <Text style={styles.menuIcon}>🔔</Text>
                            <Text style={styles.menuTitle}>Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#767577', true: '#2ecc71' }}
                            thumbColor={'#f4f3f4'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Support</Text>

                    <MenuOption
                        icon="❓"
                        title="Help & Support"
                        onPress={handleHelpSupport}
                    />

                    <MenuOption
                        icon="ℹ️"
                        title="About"
                        onPress={handleAbout}
                        showDivider={false}
                    />
                </View>

                {/* Logout Section */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeEditForm}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Profile</Text>
                            <TouchableOpacity onPress={closeEditForm}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            <TouchableOpacity onPress={pickImage} style={styles.modalAvatarContainer}>
                                {imageUri ? (
                                    <Image source={{ uri: imageUri }} style={styles.modalAvatar} />
                                ) : (
                                    <View style={styles.modalAvatarPlaceholder}>
                                        <Text style={styles.modalAvatarIcon}>📷</Text>
                                        <Text style={styles.modalAvatarText}>Change Photo</Text>
                                    </View>
                                )}
                            </TouchableOpacity>

                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor={Colors.textSecondary}
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor={Colors.textSecondary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your location"
                                placeholderTextColor={Colors.textSecondary}
                                value={location}
                                onChangeText={setLocation}
                            />

                            <Text style={styles.label}>Role</Text>
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

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#e6eef3',
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
    container: {
        flex: 1,
    },
    accountSection: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2ecc71',
        borderStyle: 'dashed',
    },
    avatarIcon: {
        fontSize: 24,
    },
    avatarText: {
        color: Colors.textPrimary,
        fontSize: 12,
        marginTop: 4,
    },
    userEmail: {
        textAlign: 'center',
        fontSize: 16,
        color: '#2ecc71',
        fontWeight: '600',
        marginBottom: 16,
    },
    updateButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    menuSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 8,
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    menuOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 12,
        width: 30,
        textAlign: 'center',
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    menuArrow: {
        fontSize: 18,
        color: '#ccc',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
    },
    logoutSection: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
    logoutButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoutText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: '600',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    closeButton: {
        fontSize: 24,
        color: '#999',
        padding: 4,
    },
    modalBody: {
        padding: 20,
    },
    modalAvatarContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
    },
    modalAvatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#2ecc71',
        borderStyle: 'dashed',
    },
    modalAvatarIcon: {
        fontSize: 20,
    },
    modalAvatarText: {
        color: Colors.textPrimary,
        fontSize: 10,
        marginTop: 4,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        color: Colors.textPrimary,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
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
    saveButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
