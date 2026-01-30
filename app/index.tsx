// app/index.tsx
import { useUser } from '@/context/UserContext';
import { Redirect } from 'expo-router'; // Adjust the import path if necessary

export default function Index() {
    const { user, authLoading } = useUser();

    if (authLoading) return null;

    // router.replace(user ? '/(tabs)/index' as any : '/(onboarding)/signIn' as any);

    return <Redirect href='/(onboarding)/signIn' />;
}
