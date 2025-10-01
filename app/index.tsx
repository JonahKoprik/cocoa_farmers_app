// app/index.tsx
import { useUser } from '@/context/UserContext';
import { Redirect } from 'expo-router';

export default function Index() {
    const { user, authLoading } = useUser();

    if (authLoading) return null;

    return <Redirect href='/(onboarding)/signIn' />;
}
