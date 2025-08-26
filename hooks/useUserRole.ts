import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (roleError || !data) {
        setRole(null);
      } else {
        setRole(data.role);
      }

      setLoading(false);
    }

    fetchUserRole();
  }, []);

  return { role, loading };
}
