import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import RoleCard from './RoleCard';
import { roles } from './roleData';

export default function RolePager() {
    const [index, setIndex] = useState(0);
    const currentRole = roles[index];

    const goNext = () => {
        if (index < roles.length - 1) {
            setIndex(index + 1);
        } else {
            router.push(`./onboarding/registration/location?role=${currentRole.id}`);

        }
    };

    const goPrevious = () => {
        if (index > 0) setIndex(index - 1);
    };

    return (
        <View style={styles.container}>
            <RoleCard role={currentRole} />

            <View style={styles.nav}>
                <Pressable onPress={goPrevious} disabled={index === 0}>
                    <Text style={[styles.navText, index === 0 && styles.disabled]}>Previous</Text>
                </Pressable>

                <Pressable onPress={goNext}>
                    <Text style={styles.navText}>{index < roles.length - 1 ? 'Next' : 'Continue'}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    nav: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginTop: 20 },
    navText: { fontSize: 16, fontWeight: '600', color: '#6A5ACD' },
    disabled: { opacity: 0.4 },
});
