// components/PriceCard.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

export function PriceCard({ title, price }: { title: string; price: number }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.price}>K {price.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
});
