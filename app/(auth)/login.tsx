import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient'; // Adjust path if needed
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            Alert.alert('Error', 'An unexpected error occurred');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


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

// styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'hsl(200,90%, 5%)',

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
    title: {
        textAlign: 'center',
        color: Colors.textPrimary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        color: Colors.textPrimary,
        height: 50,
        backgroundColor: Colors.backgroundSecondary,
        borderColor: Colors.textPrimary,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    button: {
        backgroundColor: Colors.actionPrimary,
        paddingVertical: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    footerText: {
        color: Colors.textSecondary,
        marginTop: 15,
        textAlign: 'center',
    },
    link: {
        color: Colors.actionPrimary,
    },
});