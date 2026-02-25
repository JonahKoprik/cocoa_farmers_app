import CocoaWave from '@/components/CocoaWave';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GettingStarted() {
    const navigateToProfile = () => router.push('/registration/profile');

    const registerGesture = Gesture.Tap()
        .shouldCancelWhenOutside(true)
        .runOnJS(true)
        .onEnd(() => navigateToProfile());

    // Fade-in animations using built-in Animated API
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(30)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonTranslateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(buttonOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonTranslateY, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
                <CocoaWave />

                <SafeAreaView style={styles.safeArea}>
                    <Animated.Text
                        style={[
                            styles.startedText,
                            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
                        ]}
                    >
                        Welcome to Cocoa Farmers App
                    </Animated.Text>

                    <Animated.View
                        style={[
                            styles.container,
                            { opacity: buttonOpacity, transform: [{ translateY: buttonTranslateY }] },
                        ]}
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
