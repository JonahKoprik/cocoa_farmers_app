import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // adjust path as needed

type FermentaryPrice = {
  fermentary_id: string;
  fermentary_name: string;
  ward_id: string;
  ward_name: string;
  price: number;
  created_at: string;
};

export function useFermentaryPricesByWard() {
  const [prices, setPrices] = useState<FermentaryPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      const { data: session } = await supabase.auth.getUser();
      const email = session?.user?.email;
      if (!email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // 🔍 Get ward_id from user_profile
      const { data: userData, error: userError } = await supabase
        .from('user_profile')
        .select('ward_id')
        .eq('email', email)
        .single();

      const wardId = userData?.ward_id?.trim();
      if (userError || !wardId) {
        setError('Ward not found for user');
        setLoading(false);
        return;
      }

      // 📦 Fetch fermentary prices for that ward
      const { data, error: priceError } = await supabase
        .from('fermentary')
        .select(`
          price_per_kg as price,
          created_at,
          ward_id,
          fermentary:fermentary_id (
            fermentary_id,
            fermentary_name,
            ward_name
          )
        `)
        .eq('ward_id', wardId);

      if (priceError || !data) {
        setError('Failed to fetch fermentary prices');
        setLoading(false);
        return;
      }

      const cleaned = data.map((p: any) => ({
        fermentary_id: p.fermentary?.fermentary_id,
        fermentary_name: p.fermentary?.fermentary_name,
        ward_id: p.ward_id,
        ward_name: p.fermentary?.ward_name,
        price: p.price,
        created_at: p.created_at,
      }));

      setPrices(cleaned);
      setLoading(false);
    };

    fetchPrices();
  }, []);

  return { prices, loading, error };
}
