import CocoaWave from '@/components/CocoaWave';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, { FadeInDown, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GettingStarted() {
    const navigateToProfile = () => router.push('/registration/profile');

    const registerGesture = Gesture.Tap()
        .shouldCancelWhenOutside(true)
        .onEnd(() => runOnJS(navigateToProfile)());

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
                <CocoaWave />

                <SafeAreaView style={styles.safeArea}>
                    <Animated.Text
                        entering={FadeInDown.duration(800)}
                        style={styles.startedText}
                    >
                        Welcome to Cocoa Farmers App
                    </Animated.Text>

                    <Animated.View
                        entering={FadeInDown.delay(300).duration(800)}
                        style={styles.container}
                    >
                        <GestureDetector gesture={registerGesture}>
                            <Animated.View style={styles.button}>
                                <Text style={styles.buttonText}>Create your profile</Text>
                            </Animated.View>
                        </GestureDetector>
                    </Animated.View>
                </SafeAreaView>
            </LinearGradient>
        </GestureHandlerRootView>
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
