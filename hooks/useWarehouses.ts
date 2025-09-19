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
      if (!provinceId) {
        console.warn('No provinceId provided. Skipping fetch.');
        return;
      }

      console.log(`Fetching warehouses for provinceId: ${provinceId}`);
      setLoading(true);

      const { data: fetchedData, error: fetchError } = await supabase
        .from('warehouse')
        .select('warehouse_id, warehouse_name, warehouse_price, created_at, province_id')
        .eq('province_id', provinceId);

      if (fetchError) {
        console.error('Warehouse fetch error:', fetchError.message);
        setError(fetchError.message);
        setData([]);
      } else {
        console.log('Warehouse data retrieved:', fetchedData);
        setData(fetchedData ?? []);
        setError(null);
      }

      setLoading(false);
      console.log('Warehouse fetch complete.');
    };

    fetchWarehouses();
  }, [provinceId]);

  return { data, loading, error };
}
