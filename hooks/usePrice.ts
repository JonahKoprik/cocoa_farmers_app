import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

type CommodityPrice = {
  commodity: string;
  region: string;
  currency: string;
  exchange: string | null;
};

type UsePricesResult = {
  globalPrices: CommodityPrice | null;
  loading: boolean;
  error: string | null;
};

// 🧾 Modular logger for onboarding clarity
const logSupabaseResponse = (data: any, context: string) => {
  if (!data || data.length === 0) {
    console.warn(`⚠️ [${context}] Supabase returned no matching records.`);
  } else {
    console.log(`📦 [${context}] Supabase response:`);
    console.table(data);
  }
};

export const usePrices = (): UsePricesResult => {
  const [globalPrices, setGlobalPrices] = useState<CommodityPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalPrice = async () => {
      try {
        // 🧠 Optional: log current session for debugging
        const {
          data: sessionData,
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.warn('⚠️ Supabase session fetch error:', sessionError.message);
        } else {
          console.log('👤 Supabase session:', sessionData?.session?.user?.id ?? 'No user ID');
        }

        const { data, error: supabaseError } = await supabase
          .from('commodity_prices')
          .select('commodity, region, currency, exchange')
          .eq('commodity', 'platinum')
          .eq('region', 'Global')
          .order('recorded_at', { ascending: false })
          .limit(1);

        logSupabaseResponse(data, 'Global Cocoa Price');

        if (supabaseError) {
          console.error('❌ Supabase query error:', supabaseError.message);
          setError(supabaseError.message);
          setGlobalPrices(null);
          return;
        }

        const latest = data?.[0];

        if (latest) {
          setGlobalPrices({
            commodity: latest.commodity,
            region: latest.region,
            currency: latest.currency,
            exchange: latest.exchange,
          });
        } else {
          console.warn('⚠️ No global cocoa price found in Supabase.');
          setGlobalPrices(null);
        }
      } catch (err: any) {
        console.error('❌ Global price fetch error:', err.message);
        setError(err.message ?? 'Unknown error');
        setGlobalPrices(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalPrice();
  }, []);

  return { globalPrices, loading, error };
};
