import { Colors } from '@/constants/colors';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabaseClient';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Alert,
    Button,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const { user, logout } = useUser();

    const handleSave = async () => {
        if (!user?.id || !user.email) return;

        try {
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single();

            const payload = {
                id: user.id,
                email: user.email,
                created_at: existingProfile ? undefined : new Date().toISOString(),
            };

            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert(payload, { onConflict: 'id' });

            if (upsertError) {
                Alert.alert('Error', 'Failed to save profile');
            } else {
                Alert.alert('Success', 'Profile saved successfully');
            }
        } catch (err) {
            Alert.alert('Error', 'Unexpected error while saving profile');
        }
    };

    return (
        <LinearGradient colors={['#6A5ACD', '#8A2BE2']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Button title="Update Profile" onPress={handleSave} color={Colors.actionPrimary} />
                    <View style={{ marginTop: 16 }}>
                        <Button
                            title="Logout"
                            onPress={() => {
                                logout();
                            }}
                            color={Colors.actionPrimary}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
        justifyContent: 'center',
    },
});
