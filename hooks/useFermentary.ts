import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";

type Fermentary = {
  fermentary_id: string;
  fermentary_name: string;
  owner_name: string;
  ward_id: string;
  contact: string;
  price_per_kg: number;
  updated_at: string;
  llg_name: string;
};

export function useFermentaries(llgName: string) {
  const [data, setData] = useState<Fermentary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFermentaries = useCallback(async () => {
    if (!llgName) {
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);

    try {
      const { data: fermentaries, error: fermentaryError } = await supabase
        .from("fermentaries")
        .select(`
          fermentary_id,
          fermentary_name,
          contact,
          price_per_kg,
          updated_at,
          ward (
            ward_id,
            village,
            llg (
              name
            )
          ),
          owner:profiles (
            full_name
          )
        `)
        .ilike("ward.llg.name", llgName);

      if (fermentaryError) throw fermentaryError;

      // Flatten the nested data structure for easier consumption in the UI
      const flattened = fermentaries.map((f: any) => ({
        fermentary_id: f.fermentary_id,
        fermentary_name: f.fermentary_name,
        owner_name: `${f.owner?.full_name ?? ""}`.trim() || "Unknown",
        ward_id: f.ward?.ward_id ?? "",
        contact: f.contact ?? "",
        price_per_kg: f.price_per_kg,
        updated_at: f.updated_at,
        llg_name: f.ward?.llg?.[0]?.name ?? "",
      }));

      setData(flattened);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [llgName]);

  useEffect(() => {
    fetchFermentaries();
  }, [fetchFermentaries]);

  return { data, loading, error };
}
