import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const screenOptions = {
    title: 'Account Settings',
};


export default function AccountSettingsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Fixed Header Bar */}
            <View style={styles.headerBar}>
                <TouchableOpacity
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                    onPress={() => router.replace('/profile')}
                    style={styles.backTouch}
                >
                    <Text style={styles.backIcon}>
                        {Platform.select({ ios: '‹', android: '‹' })}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>
            </View>

            {/* Screen Description */}
            <View style={styles.description}>
                <Text style={styles.subtitle}>
                    Manage your email, password, and notification preferences here.
                </Text>
            </View>

            {/* Content Section */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.card}>
                    <Text style={styles.cardTitle}>Update Email</Text>
                    <Text style={styles.cardSubtitle}>Change your login email</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                    <Text style={styles.cardTitle}>Change Password</Text>
                    <Text style={styles.cardSubtitle}>Reset or update your password</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                    <Text style={styles.cardTitle}>Notifications</Text>
                    <Text style={styles.cardSubtitle}>Manage push alerts and reminders</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: Colors.backgroundSecondary,
        elevation: 4,
    },
    backTouch: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    backIcon: {
        fontSize: 22,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    description: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    section: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 8,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 6,
    },
});
