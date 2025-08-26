import { supabase } from '../lib/supabaseClient';

export type LocalPrices = { wet: number; dry: number };
export type GlobalPrices = { global: number };
export type TrendPoint = { date: string; price: number };

export type PricesResponse = {
  local: LocalPrices;
  global: GlobalPrices;
  trends: TrendPoint[];
};

export async function fetchPrices(): Promise<PricesResponse> {
  const { data, error } = await supabase.from('prices').select('*');
  if (error) throw error;

  // Example transformation — adjust to match your schema
  return {
    local: {
      wet: data?.find((d: any) => d.type === 'wet')?.price ?? 0,
      dry: data?.find((d: any) => d.type === 'dry')?.price ?? 0,
    },
    global: {
      global: data?.find((d: any) => d.type === 'global')?.price ?? 0,
    },
    trends: data?.filter((d: any) => d.trend).map((d: any) => ({
      date: d.date,
      price: d.price,
    })) ?? [],
  };
}

export async function fetchPriceByCommodity(commodity: string) {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('commodity', commodity);
  if (error) throw error;
  return data;
}
