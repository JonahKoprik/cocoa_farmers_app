import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export function useUpdateWarehousePrice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePrice = async (
    price: string,
    onSuccess?: () => void,
    onFailure?: (message: string) => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) throw new Error('Invalid price format');

      const { data: session } = await supabase.auth.getUser();
      const userId = session?.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const { data: warehouse, error: fetchError } = await supabase
        .from('warehouse')
        .select('warehouse_id')
        .eq('user_id', userId)
        .single();

      if (fetchError || !warehouse) throw new Error('Warehouse not found for user');

      const { error: updateError } = await supabase
        .from('warehouse')
        .update({ warehouse_price: parsedPrice })
        .eq('warehouse_id', warehouse.warehouse_id);

      if (updateError) throw new Error(updateError.message);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      const message = err.message || 'Failed to update warehouse price';
      setError(message);
      if (onFailure) onFailure(message);
    } finally {
      setLoading(false);
    }
  };

  return { updatePrice, loading, error };
}
