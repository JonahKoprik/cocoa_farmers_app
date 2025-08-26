

// app/_layout.tsx
import { UserProvider } from '@/context/UserContext';
import { Slot } from 'expo-router';

export default function AppLayout() {
    return (
        <UserProvider>
            <Slot />
        </UserProvider>
        // <TabsLayout />
    );
}
