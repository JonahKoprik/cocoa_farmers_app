import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient'; // Adjust path if needed
import { Link, router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Animated } from 'react-native/Libraries/Animated/Animated';


// arrow function 
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

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
                const msg = error.message.toLowerCase();

                // Detect if error is about email confirmation
                if (msg.includes('email') && msg.includes('confirm')) {
                    Alert.alert(
                        'Email Not Confirmed',
                        'Please check your email and confirm your account before logging in.'
                    );
                } else {
                    Alert.alert('Login Failed', error.message);
                }
            } else if (data.session) {
                Alert.alert('Login Successful');
                router.replace('/'); // Redirect to home or tabs layout
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
        <View style={styles.container}>
            <View style={styles.loginCard}>
                <Text style={styles.title}>Sign In</Text>

                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Don't have an account?{' '}
                    <Link href="/(auth)/registration" style={styles.link}>Register</Link>
                </Text>

                <Text style={styles.footerText}>Forgot Password?</Text>
            </View>
        </View>
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
        backgroundColor: 'hsl(200,90%, 5%)',

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
        borderRadius: 5,
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

