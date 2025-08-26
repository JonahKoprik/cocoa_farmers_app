// components/SplashScreen.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function LoaderScreen() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#5502bb" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'hsl(0, 0%, 11%)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
