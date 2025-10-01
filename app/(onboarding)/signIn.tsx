import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient';
import { registerPushToken } from '@/services/pushService';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });

            if (error || !data.session || !data.user?.id) {
                console.warn('⚠️ Session missing or user ID undefined');
                router.replace('/(fallback)/offlineLoginFallback'); // 🔁 Redirect to fallback screen
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            await registerPushToken(data.user.id, profile?.role);

            await supabase.from('login_log').insert({
                user_id: data.user.id,
                email,
                timestamp: new Date().toISOString(),
                success: true,
            });

            Alert.alert('Login Successful');
            router.replace('/');
        } catch (err) {
            console.error('Login error:', err);
            router.replace('/(fallback)/offlineLoginFallback'); // 🔁 Redirect on unexpected error
        } finally {
            setLoading(false);
        }
    };


    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Animated.View
                        style={[
                            styles.loginCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.title}>Sign In</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            Don't have an account?{' '}
                            <Link href="/(onboarding)/registration/profile" style={styles.link}>Register</Link>
                        </Text>

                        <Text style={styles.footerText}>Forgot Password?</Text>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Login;


// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginTop: 10,
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
