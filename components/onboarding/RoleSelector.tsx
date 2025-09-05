import { Role, roles } from '@/constants/roles';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RoleSelectorProps {
    role: Role;
    setRole: React.Dispatch<React.SetStateAction<Role>>;
}

export default function RoleSelector({ role, setRole }: RoleSelectorProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select Role:</Text>
            {roles.map((r) => (
                <TouchableOpacity
                    key={r}
                    style={[styles.option, role === r && styles.selected]}
                    onPress={() => setRole(r)}
                >
                    <Text style={styles.text}>{r}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontWeight: 'bold', marginBottom: 8 },
    option: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#eee',
        marginBottom: 6,
    },
    selected: {
        backgroundColor: '#c2f0c2',
    },
    text: { fontSize: 16 },
});
