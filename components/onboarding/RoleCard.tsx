import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text } from 'react-native';
import { roles } from './roleData';

type Role = typeof roles[number];

export default function RoleCard({ role }: { role: Role }) {
    return (
        <LinearGradient colors={role.gradient} style={styles.card}>
            <Text style={styles.title}>{role.name}</Text>
            <Text style={styles.description}>{role.description}</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '90%',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#f0f0f0',
        textAlign: 'center',
    },
});
