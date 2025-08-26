import { FontAwesome5 } from '@expo/vector-icons'; // or use any icon library
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { useUserRole } from '../hooks/useUserRole';

export default function RoleBanner() {
    const { role, loading } = useUserRole();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    if (loading) return null;

    const roleConfig: Record<string, { text: string; icon: string; color: string }> = {
        farmer: {
            text: 'Viewing prices as a Farmer',
            icon: 'seedling',
            color: Colors.actionPrimary,
        },
        fermentary: {
            text: 'Viewing prices as a Fermentary Owner',
            icon: 'wine-bottle',
            color: Colors.actionPrimary,
        },
        warehouse: {
            text: 'Viewing prices as a Warehouse Manager',
            icon: 'warehouse',
            color: Colors.actionPrimary,
        },
        org: {
            text: 'Viewing prices as an Organization',
            icon: 'users',
            color: Colors.actionPrimary,
        },
    };

    const config = roleConfig[role ?? ''] ?? {
        text: 'Viewing prices',
        icon: 'info-circle',
        color: Colors.backgroundSecondary,
    };

    return (
        <Animated.View style={[styles.banner, { backgroundColor: config.color, opacity: fadeAnim }]}>
            <View style={styles.row}>
                <FontAwesome5 name={config.icon} size={16} color={Colors.backgroundSecondary} style={styles.icon} />
                <Text style={styles.text}>{config.text}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    banner: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: Colors.backgroundSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
});
