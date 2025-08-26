import { supabase } from '@/lib/supabaseClient';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';

export type Role = 'farmer' | 'fermentary' | 'warehouse' | 'organization';

interface UserRoleContextType {
    role: Role;
    loading: boolean;
    refreshRole: () => Promise<void>; // added manual refresh option
}

const defaultRole: Role = 'farmer';

const UserRoleContext = createContext<UserRoleContextType>({
    role: defaultRole,
    loading: true,
    refreshRole: async () => { }, // default no-op
});

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const [role, setRole] = useState<Role>(defaultRole);
    const [loading, setLoading] = useState(true);

    const fetchRole = async () => {
        if (!user?.id) {
            setRole(defaultRole);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Supabase error fetching role:', error.message);
                setRole(defaultRole);
            } else if (!data?.role) {
                setRole(defaultRole);
            } else {
                setRole(data.role as Role);
            }
        } catch (err) {
            console.error('Unexpected error fetching user role:', err);
            setRole(defaultRole);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRole();
    }, [user?.id]); // refetch when user changes

    return (
        <UserRoleContext.Provider value={{ role, loading, refreshRole: fetchRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = () => useContext(UserRoleContext);
