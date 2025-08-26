// FermentationCard.tsx
import { StyleSheet, Text, View } from 'react-native';

export const FermentationCard = ({
    title,
    description,
    horizontal = false,
}: {
    title: string;
    description: string;
    horizontal?: boolean;
}) => (
    <View style={[styles.card, horizontal && styles.horizontal]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#3E2723',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        width: '100%',
    },
    horizontal: {
        width: 280,
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF8E1',
    },
    description: {
        fontSize: 14,
        color: '#FFE0B2',
        marginTop: 8,
    },
});
