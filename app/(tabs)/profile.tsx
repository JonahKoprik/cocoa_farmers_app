// app/(tabs)/profile.tsx
import { Colors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, logout } = useUser();
    const router = useRouter();

    const handleSave = async () => {
        if (!user?.id || !user.email) return;

        try {
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });

            if (upsertError) {
                Alert.alert('Error', 'Failed to save profile');
            } else {
                Alert.alert('Success', 'Profile saved successfully');
            }
        } catch (err) {
            Alert.alert('Error', 'Unexpected error while saving profile');
        }
    };

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                {/* Profile Info */}
                <View style={styles.profileCard}>
                    <Text style={styles.label}>Logged in as</Text>
                    <Text style={styles.email}>{user?.email ?? 'Unknown'}</Text>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveText}>Update Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Navigation Cards */}
                <View style={styles.navSection}>
                    <TouchableOpacity
                        style={styles.navCard}
                        onPress={() => router.push('/accountSettings')}
                    >
                        <Text style={styles.navTitle}>Account Settings</Text>
                        <Text style={styles.navSubtitle}>Manage your profile and preferences</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navCard}
                        onPress={() => router.push('./help')}
                    >
                        <Text style={styles.navTitle}>Help & Support</Text>
                        <Text style={styles.navSubtitle}>FAQs, contact, and troubleshooting</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navCard}
                        onPress={() => router.push('./about')}
                    >
                        <Text style={styles.navTitle}>About This App</Text>
                        <Text style={styles.navSubtitle}>Version info and outreach mission</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    profileCard: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 20,
        borderRadius: 12,
        elevation: 3,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 12,
    },
    saveButton: {
        backgroundColor: Colors.actionPrimary,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    navSection: {
        marginBottom: 20,
    },
    navCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    navTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    navSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    logoutSection: {
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
