// components/PriceRow.tsx
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
    label: string;
    value: number | null;
    currency?: 'PGK' | 'USD';
};

export function PriceRow({ label, value, currency = 'PGK' }: Props) {
    let formatted: string;

    if (typeof value === 'number') {
        formatted = currency === 'USD'
            ? `$${value.toFixed(2)}`
            : `K ${value.toFixed(2)}`;
    } else {
        formatted = 'Unavailable';
    }

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{formatted}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderColor: Colors.backgroundPrimary,
    },
    label: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
});
