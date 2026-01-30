import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient';
import NetInfo from '@react-native-community/netinfo';
import OfflineLoginFallback from 'app/(fallback)/offlineLoginFallback'; // adjust path as needed
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

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [offline, setOffline] = useState(false);

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

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected) {
                setOffline(true);
                return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                const msg = error.message.toLowerCase();
                if (msg.includes('email') && msg.includes('confirm')) {
                    Alert.alert(
                        'Email Not Confirmed',
                        'Please check your email and confirm your account before logging in.'
                    );
                } else {
                    Alert.alert('Login Failed', error.message);
                }
                return;
            }

            const user = data?.user;
            if (!user) {
                Alert.alert('Error', 'No user session found');
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('user_profile')
                .select('id')
                .eq('email', user.email)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error(profileError);
                Alert.alert('Error', 'Failed to check user profile');
                return;
            }

            if (profile) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(onboarding)/gettingStarted');
            }
        } catch (err) {
            console.error('Login error:', err);
            setOffline(true); // fallback if Supabase is unreachable
        } finally {
            setLoading(false);
        }
    };

    if (offline) {
        return <OfflineLoginFallback />;
    }

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
                            placeholderTextColor={Colors.textSecondary}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Colors.textSecondary}
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
                                {loading ? 'Logging in...' : 'Login'}
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
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SignIn;

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
        color: Colors.textSecondary,
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
