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

export function useFermentaries(wardName: string) {
  const [data, setData] = useState<Fermentary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFermentaries = useCallback(async () => {
    const trimmedWard = wardName.trim();
    if (!trimmedWard) {
      setData([]);
      setError(null);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Resolve ward_id from ward_name
      const { data: wardRecord, error: wardError } = await supabase
        .from("ward")
        .select("ward_id")
        .eq("ward_name", trimmedWard)
        .single();

      if (wardError || !wardRecord?.ward_id) throw new Error("Ward not found");

      const wardId = wardRecord.ward_id;

      // Step 2: Fetch fermentaries in that ward
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
          owner:user_profile (
            full_name
          )
        `)
        .eq("ward_id", wardId);

      if (fermentaryError) throw fermentaryError;

      const flattened = (fermentaries ?? []).map((f: any): Fermentary => ({
        fermentary_id: f.fermentary_id,
        fermentary_name: f.fermentary_name,
        owner_name: f.owner?.full_name?.trim() || "Unknown",
        ward_id: f.ward?.ward_id ?? "",
        ward_name: f.ward?.ward_name ?? "",
        contact: f.contact ?? "",
        price_per_kg: typeof f.price_per_kg === "number" ? f.price_per_kg : 0,
        updated_at: f.updated_at ?? new Date().toISOString(),
        llg_name: f.ward?.llg?.llg_name ?? "",
      }));

      setData(flattened);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch fermentaries");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [wardName]);

  useEffect(() => {
    fetchFermentaries();
  }, [fetchFermentaries]);

  return { data, loading, error, refetch: fetchFermentaries };
}
