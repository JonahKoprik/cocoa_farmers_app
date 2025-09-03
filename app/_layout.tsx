

// app/_layout.tsx
import { UserProvider } from '@/context/UserContext';
import { Slot } from 'expo-router';

export default function AppLayout() {
    return (
        // User Priovider to manage user state across the app
        <UserProvider>
            <Slot />
        </UserProvider>
        // <TabsLayout />
    );
}
