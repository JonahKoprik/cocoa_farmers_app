import { useOnboardingContext } from '@/context/OnboardingContext';
import { useAccountCreation } from '@/hooks/useAccountCreation';
import { roleMap } from '@/utils/roleMapper'; // simplified role mapping
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FinishScreen() {
    const { role, location, profile } = useOnboardingContext();
    const { createAccount, loading } = useAccountCreation();

    const handleSubmit = async () => {
        const backendRole = roleMap[role]; // map expressive role to backend enum

        const success = await createAccount({
            name: profile.name,
            email: profile.email,
            role: backendRole,
            location,
            password: '',
        });

        if (success) router.replace('./tabs');
    };

    return (
        <LinearGradient
            colors={['#6A5ACD', '#8A2BE2']} // trust + clarity gradient
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>Almost Done! Click Finish to Submit</Text>
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title={loading ? 'Signing In...' : 'Finish'}
                            onPress={handleSubmit}
                            disabled={loading}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    container: {
        backgroundColor: '#ffffff20',
        padding: 16,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});
