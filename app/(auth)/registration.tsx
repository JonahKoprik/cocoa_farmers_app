import { Colors } from '@/constants/colors';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabaseClient';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

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

export const unstable_settings = {
    initialRouteName: 'sign-in',
    drawer: null, // hides from drawer
};

export default Registration;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'hsl(200,90%, 5%)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    loginCard: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: Colors.backgroundSecondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    input: {
        backgroundColor: Colors.backgroundSecondary,
        width: '100%',
        height: 50,
        borderColor: Colors.textSecondary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        color: Colors.textSecondary,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: Colors.actionPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 15,
        color: Colors.textSecondary,
    },
    link: {
        color: Colors.actionPrimary,
    },
});
