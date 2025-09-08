import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export const usePrices = () => {
  const [globalPrices, setGlobalPrices] = useState<{ global: number | null }>({ global: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalPrice = async () => {
      try {
        const { data, error: supabaseError } = await supabase.functions.invoke('global-cocoa-price');

        if (supabaseError) {
          console.error("❌ Supabase function error:", supabaseError.message);
          setError(supabaseError.message);
        }

        let globalPrice = data?.global ?? null;

        if (globalPrice === null) {
          console.warn("⚠️ Supabase returned null for global price. Falling back to external API.");

          const ninjasRes = await fetch('https://api.api-ninjas.com/v1/commodityprice?name=cocoa', {
            headers: {
              'X-Api-Key': process.env.EXPO_PUBLIC_NINJAS_API_KEY ?? '',
            },
          });

          const ninjasData = await ninjasRes.json();
          globalPrice = ninjasData?.price ?? null;

          console.log("🌍 Fallback global price from API Ninjas:", globalPrice);
        } else {
          console.log("✅ Global price from Supabase:", globalPrice);
        }

        setGlobalPrices({ global: globalPrice });
      } catch (err: any) {
        console.error("❌ Global price fetch error:", err.message);
        setError(err.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalPrice();
  }, []);

  return { globalPrices, loading, error };
};
