import CocoaWave from '@/components/CocoaWave';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GettingStarted() {
    const navigateToProfile = () => router.push('/registration/profile');

    const isNative = Platform.OS !== 'web';

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <CocoaWave />

            <SafeAreaView style={styles.safeArea}>
                <Animated.Text
                    entering={isNative ? FadeInDown.duration(800) : undefined}
                    style={styles.startedText}
                >
                    Welcome to Cocoa Farmers App
                </Animated.Text>

                <Animated.View
                    entering={isNative ? FadeInDown.delay(300).duration(800) : undefined}
                    style={styles.container}
                >
                    <TouchableOpacity style={styles.button} onPress={navigateToProfile}>
                        <Text style={styles.buttonText}>Create your profile</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    startedText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.textPrimary,
    },
    container: {
        gap: 20,
    },
    button: {
        backgroundColor: Colors.actionPrimary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.backgroundSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
});
