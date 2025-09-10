import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

type CommodityPrice = {
  commodity: string;
  region: string;
  currency: string;
  exchange: string | null;
};

export const usePrices = () => {
  const [globalPrices, setGlobalPrices] = useState<CommodityPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalPrice = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('commodity_prices')
          .select('commodity, region, currency, exchange')
          .eq('commodity', 'cocoa')
          .eq('region', 'Global')
          .order('recorded_at', { ascending: false })
          .limit(1);

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
