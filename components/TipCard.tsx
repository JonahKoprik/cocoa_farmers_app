// components/TipCard.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

export function TipCard({ title, content }: { title: string; content: string }) {
    return (

        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.content}>{content}</Text>
        </View>

    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: Colors.backgroundSecondary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#c1c6b8ff',
        shadowOpacity: 0.4,
        shadowRadius: 7,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    content: {
        fontSize: 14,
        color: Colors.textPrimary,
        marginTop: 8,
    },
});
