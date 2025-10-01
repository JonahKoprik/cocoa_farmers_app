import { Colors } from '@/constants/colors';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OfflineLoginFallback = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Offline Login Unavailable</Text>
                <Text style={styles.message}>
                    We couldn’t connect to the server. Please check your internet connection or try again later.
                </Text>

                <TouchableOpacity style={styles.button} onPress={() => router.replace('/(onboarding)/signIn')}>
                    <Text style={styles.buttonText}>Retry Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.linkButton} onPress={() => router.replace('/')}>
                    <Text style={styles.linkText}>Continue Offline</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OfflineLoginFallback;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: Colors.backgroundSecondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: Colors.actionPrimary,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    linkButton: {
        paddingVertical: 10,
    },
    linkText: {
        color: Colors.actionPrimary,
        textAlign: 'center',
        fontSize: 16,
    },
});
