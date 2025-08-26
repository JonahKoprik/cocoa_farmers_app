// hooks/useSessionCheck.ts
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useSessionCheck() {
  const { user, authLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/(auth)/login');
    }
  }, [authLoading, user, router]);
}
