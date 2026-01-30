// src/context/UserContext.tsx
import { supabase } from '@/lib/supabaseClient';
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface User {
    id: string;
    email: string;
    token: string;
}

export interface UserContextType {
    user: User | null;
    authLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        let subscription: ReturnType<typeof supabase.auth.onAuthStateChange>['data']['subscription'];

        const getSessionAndListen = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email ?? '',
                    token: session.access_token,
                });
            } else {
                setUser(null);
            }

            setAuthLoading(false);

            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email ?? '',
                        token: session.access_token,
                    });
                } else {
                    setUser(null);
                }
            });

            subscription = data.subscription;
        };

        getSessionAndListen();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error || !data.session || !data.user) {
            throw new Error(error?.message || 'Login failed');
        }

        setUser({
            id: data.user.id,
            email: data.user.email ?? '',
            token: data.session.access_token,
        });
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
            return;
        }

        setUser(null);
        router.replace('/(auth)/login'); // Adjust route if needed
    };

    return (
        <UserContext.Provider value={{ user, authLoading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
}
