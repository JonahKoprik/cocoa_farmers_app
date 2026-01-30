import { UserProvider } from '@/context/UserContext';
import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function AppLayout() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <UserProvider>
                <Slot />
            </UserProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
