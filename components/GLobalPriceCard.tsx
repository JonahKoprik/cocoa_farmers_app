import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors'; // Make sure this path matches your structure

export default function GlobalPriceCard() {
    const [price, setPrice] = useState<number | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch('https://your-project.functions.supabase.co/cocoa-price');
                const data = await res.json();

                setPrice(data.price_usd);
                setTimestamp(data.updated_at);
            } catch (error) {
                console.error('Failed to fetch cocoa price:', error);
            }
        };

        fetchPrice();
    }, []);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Cocoa Price (USD)</Text>
            <Text style={styles.price}>
                {price !== null ? `$${price.toFixed(2)}` : 'Loading...'}
            </Text>
            {timestamp && (
                <Text style={styles.timestamp}>
                    Updated: {new Date(timestamp).toLocaleString()}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.backgroundSecondary, // White (30%)
        padding: 16,
        borderRadius: 12,
        margin: 12,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary, // Black
    },
    price: {
        fontSize: 24,
        color: Colors.actionPrimary, // Leaf Green (10%)
        marginVertical: 8,
        fontWeight: '600',
    },
    timestamp: {
        fontSize: 12,
        color: '#555', // Optional: could use a muted cocoa tone
    },
});
