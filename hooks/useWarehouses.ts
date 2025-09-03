import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export type Warehouse = {
  warehouse_id: string;
  warehouse_name: string;
  warehouse_price?: number;
  created_at: string;
  province_id?: string;
};

export function useWarehouses(provinceId: string | null) {
  const [data, setData] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      if (!provinceId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('warehouse')
        .select('warehouse_id, warehouse_name, warehouse_price, created_at, province_id')
        .eq('province_id', provinceId);

      if (error) {
        console.error('Warehouse fetch error:', error.message);
        setError(error.message);
        setData([]);
      } else {
        setData(data ?? []);
        setError(null);
      }

      setLoading(false);
    };

    fetchWarehouses();
  }, [provinceId]);

  return { data, loading, error };
}
