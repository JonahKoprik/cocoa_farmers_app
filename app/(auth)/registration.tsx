import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient';
import { Link, router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;

    const cardRadius = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 20], // corners become rounded as you scroll
        extrapolate: 'clamp',
    });

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error) {
                Alert.alert('Signup Failed', error.message);
                return;
            }

            if (data.user) {
                // Insert profile info in your own table (adjust table/columns as needed)
                const { error: profileError } = await supabase.from('profiles').insert([
                    {
                        id: data.user.id,
                        email: data.user.email,
                        created_at: new Date().toISOString(),
                    },
                ]);

                if (profileError) {
                    console.error('Profile insert error:', profileError);
                    Alert.alert('Warning', 'Account created but failed to save profile data.');
                } else {
                    Alert.alert('Signup Successful', `Welcome, ${data.user.email}`);
                }

                router.push('/(tabs)'); // Redirect to your app home
            } else {
                Alert.alert('Signup Successful', 'Please check your email to verify your account.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            Alert.alert('Signup Failed', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginCard}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
                <Text style={styles.footerText}>
                    Already have an account?{' '}
                    <Link href="./login" style={styles.link}>
                        Sign In
                    </Link>
                </Text>
                <Text style={styles.footerText}>Forgot Password?</Text>
            </View>
        </View>
    );
};

export default Registration;

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
        justifyContent: 'center',
        backgroundColor: 'hsl(200,90%, 5%)',
    },
    logo: {
        color: '#f1f7f2ff', // Light green logo text
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
        borderColor: Colors.textPrimary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: Colors.backgroundSecondary,
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
