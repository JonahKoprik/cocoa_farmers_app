import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export const useUserProvince = () => {
  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvince = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.warn('Auth error or missing user');
        return setLoading(false);
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('province_id, province_name')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.warn('Profile fetch error or missing profile');
      } else {
        setProvinceId(profile.province_id ?? null);
        setProvinceName(profile.province_name ?? null);
      }

      setLoading(false);
    };

    fetchProvince();
  }, []);

  return { provinceId, provinceName, loading };
};
