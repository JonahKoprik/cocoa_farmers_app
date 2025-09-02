// hooks/useCocoaPrice.ts
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';


// hooks/useCocoaPrice.ts
export const usePrices = () => {
  const [localPrices, setLocalPrices] = useState({ wet: null, dry: null });
  const [globalPrices, setGlobalPrices] = useState({ global: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data, error } = await supabase.functions.invoke('global-cocoa-price');

      if (error) {
        setError(error.message);
      } else {
        setLocalPrices({
          wet: data?.localWet ?? null,
          dry: data?.localDry ?? null,
        });
        setGlobalPrices({
          global: data?.global ?? null,
        });
      }

      setLoading(false);
    };

    fetchPrices();
  }, []);

  return { localPrices, globalPrices, loading, error };
};

