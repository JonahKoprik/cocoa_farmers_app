import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import type { ColorValue, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';

interface GradientCardProps {
    colors?: readonly [ColorValue, ColorValue, ...ColorValue[]]; // Optional gradient
    children: React.ReactNode;
    style?: ViewStyle;
    flat?: boolean; // Use flat white background instead of gradient
}

export const GradientCard: React.FC<GradientCardProps> = ({ colors, children, style, flat = false }) => {
    if (flat || !colors) {
        return (
            <View style={[styles.card, { backgroundColor: Colors.backgroundSecondary }, style]}>
                <View style={styles.inner}>{children}</View>
            </View>
        );
    }

    return (
        <LinearGradient colors={colors} style={[styles.card, style]}>
            <View style={styles.inner}>{children}</View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginRight: 12,
        padding: 12,
        minWidth: 180,
        maxWidth: 240,
        elevation: 3,
        shadowColor: Colors.backgroundPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
    },
});
