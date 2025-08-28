import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";

type Fermentary = {
  fermentary_id: string;
  fermentary_name: string;
  owner_name: string;
  ward_id: string;
  ward_name: string;
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
    const trimmedLLG = llgName.trim();
    if (!trimmedLLG) {
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);

    try {
      const { data: fermentaries, error: fermentaryError } = await supabase
        .from("fermentary")
        .select(`
          fermentary_id,
          fermentary_name,
          contact,
          price_per_kg,
          updated_at,
          ward:ward (
            ward_id,
            ward_name,
            llg:llg (
              llg_name
            )
          ),
          owner:profiles (
            full_name
          )
        `)
        .ilike("ward.llg.llg_name", trimmedLLG);

      if (fermentaryError) throw fermentaryError;

      const flattened = (fermentaries ?? []).map((f: any): Fermentary => ({
        fermentary_id: f.fermentary_id,
        fermentary_name: f.fermentary_name,
        owner_name: f.owner?.full_name?.trim() || "Unknown",
        ward_id: f.ward?.ward_id ?? "",
        ward_name: f.ward?.ward_name ?? "",
        contact: f.contact ?? "",
        price_per_kg: f.price_per_kg || "NULL",
        updated_at: f.updated_at ?? "",
        llg_name: f.ward?.llg?.llg_name ?? "",
      }));

      setData(flattened);
      setError(null);
    } catch (err: any) {
      setError(typeof err === "object" && err.message ? err.message : "Failed to fetch fermentaries");
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
