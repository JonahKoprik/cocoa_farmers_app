import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// arrow function 
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    const cardRadius = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 20], // corners become rounded as you scroll
        extrapolate: 'clamp',
    });
    // async function to handle login requests
    const handleLogin = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
            } else if (data.session) {
                Alert.alert('Login Successful');
                router.replace('/');
            }
        } catch (err) {
            Alert.alert('Error', 'Unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Updated handleLogin function
    // const handleLogin = async () => {
    //     setLoading(true);
    //     try {
    //         // Development-only: accept any credentials
    //         if (email && password) {
    //             Alert.alert('Login Successful (Mock)');
    //             router.replace('/');
    //         } else {
    //             Alert.alert('Login Failed', 'Please enter email and password');
    //         }
    //     } catch (err) {
    //         Alert.alert('Error', 'Unexpected error occurred');
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            >
                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logo}>CocoaConnect</Text>
                </View>

                {/* Input Card Section */}
                <Animated.View
                    style={[
                        styles.loginCard,
                        {
                            borderTopLeftRadius: cardRadius,
                            borderTopRightRadius: cardRadius,
                        },
                    ]}
                >
                    <Text style={styles.title}>Sign In</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Logging in...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Don't have an account?{' '}
                        <Link href="/(auth)/registration" style={styles.link}>
                            Register
                        </Link>
                    </Text>

                    <Text style={styles.footerText}>Forgot Password?</Text>
                </Animated.View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    logoContainer: {
        paddingVertical: 60,
        alignItems: 'center',
        backgroundColor: '#409e67ff', // Dark green background
    },
    logo: {
        color: '#f1f7f2ff', // Green logo
        fontSize: 35,
        fontWeight: 'bold',
    },
    loginCard: {
        flex: 1,
        backgroundColor: '#fff', // White card
        padding: 25,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        textAlign: 'center',
        color: Colors.textPrimary,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: Colors.textPrimary,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        backgroundColor: '#2ecc71',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    footerText: {
        color: Colors.textSecondary,
        marginTop: 20,
        textAlign: 'center',
        fontSize: 14,
    },
    link: {
        color: '#2ecc71',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
