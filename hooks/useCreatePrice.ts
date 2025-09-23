import { supabase } from '../lib/supabaseClient';

export const useUpdateFermentaryPrice = () => {
    return async (price: string) => {
        const { data: session } = await supabase.auth.getUser();
        const userId = session?.user?.id;
        if (!userId) return;

        const { data: fermentary } = await supabase
            .from('fermentary')
            .select('fermentary_id')
            .eq('user_id', userId)
            .single();

        if (!fermentary) return;

        return await supabase
            .from('fermentary')
            .update({ price_per_kg: parseFloat(price) })
            .eq('fermentary_id', fermentary.fermentary_id);
    };
};
