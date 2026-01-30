import { StyleSheet, TextInput, View } from 'react-native';

interface AccountFormProps {
    name: string;
    setName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
}

export default function AccountForm({ name, setName, email, setEmail }: AccountFormProps) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 16 },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
    },
});
