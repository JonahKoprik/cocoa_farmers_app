import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function WetBeanPriceCard() {
    const [pricePerKg, setPricePerKg] = useState<number | null>(null);

    useEffect(() => {
        const fetchPrice = async () => {
            const { data, error } = await supabase
                .from('local_prices')
                .select('price_per_kg')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setPricePerKg(data.price_per_kg);
            }
        };

        fetchPrice();
    }, []);

    return (
        <View style={{ padding: 16, backgroundColor: Colors.backgroundPrimary }}>
            <Text style={{ color: Colors.textPrimary, fontSize: 18, marginBottom: 8 }}>
                Current Local Price
            </Text>
            <Text style={{ color: Colors.textPrimary, fontSize: 24, fontWeight: 'bold' }}>
                {pricePerKg !== null ? `${pricePerKg} PGK/kg` : 'Loading...'}
            </Text>
        </View>
    );
}
