import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type CommodityPrice = {
  commodity: string;
  region: string;
  currency: string;
  exchange: string | null;
};

type UsePricesResult = {
  localPrices: {
    wet: number | null;
    dry: number | null;
  } | null;
  globalPrices: {
    global: number | null;
    commodity: string;
    region: string;
    currency: string;
    exchange: string | null;
  } | null;
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
  const [localPrices, setLocalPrices] = useState<{
    wet: number | null;
    dry: number | null;
  } | null>(null);
  const [globalPrices, setGlobalPrices] = useState<{
    global: number | null;
    commodity: string;
    region: string;
    currency: string;
    exchange: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch local prices
        const { data: localData, error: localError } = await supabase
          .from("commodity_prices")
          .select("wet, dry")
          .eq("commodity", "cocoa")
          .eq("region", "Local")
          .order("recorded_at", { ascending: false })
          .limit(1);

        if (localError) {
          console.error("❌ Local price query error:", localError.message);
        } else if (localData && localData.length > 0) {
          setLocalPrices({
            wet: localData[0].wet,
            dry: localData[0].dry,
          });
        }

        // Fetch global price
        const { data: globalData, error: globalError } = await supabase
          .from("commodity_prices")
          .select("commodity, region, currency, exchange, global")
          .eq("commodity", "cocoa")
          .eq("region", "Global")
          .order("recorded_at", { ascending: false })
          .limit(1);

        if (globalError) {
          console.error("❌ Global price query error:", globalError.message);
          setError(globalError.message);
        } else if (globalData && globalData.length > 0) {
          setGlobalPrices({
            global: globalData[0].global,
            commodity: globalData[0].commodity,
            region: globalData[0].region,
            currency: globalData[0].currency,
            exchange: globalData[0].exchange,
          });
        }
      } catch (err: any) {
        console.error("❌ Price fetch error:", err.message);
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { localPrices, globalPrices, loading, error };
};
