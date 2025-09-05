import { supabase } from '@/lib/supabaseClient';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { Alert } from 'react-native';

type ProfilePayload = {
  id: string;
  email: string;
  name: string;
  role: string;
  province: string;
  district: string;
  llg: string;
  ward: string;
  registrationNumber: string;
  orgName: string;
  farmerGroup: string[];
  warehouseGroup: string[];
};

export function useProfileSubmission(user: { id: string; email: string } | null) {
  const submitProfile = useCallback(
    async ({
      id,
      email,
      name,
      role,
      province,
      district,
      llg,
      ward,
      registrationNumber,
      orgName,
      farmerGroup,
      warehouseGroup,
    }: ProfilePayload) => {
      // ✅ Validate UUID format
      if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
        Alert.alert('Error', 'Invalid user ID');
        return;
      }

      if (!email) {
        Alert.alert('Error', 'Missing user email');
        return;
      }

      // ✅ Province lookup
      const { data: provinceData, error: provinceError } = await supabase
        .from('provinces')
        .select('province_id')
        .eq('province_name', province)
        .single();

      if (provinceError || !provinceData?.province_id) {
        console.error('Province lookup failed:', provinceError?.message);
        Alert.alert('Error', 'Invalid province');
        return;
      }

      // ✅ Conditional lookups for Farmer/Fermentary roles
      const shouldLookup = farmerGroup.includes(role) || role === 'FermentaryOwner';

      const districtData = shouldLookup
        ? await supabase
            .from('districts')
            .select('district_id')
            .eq('district_name', district)
            .single()
        : { data: null };

      const llgData = shouldLookup
        ? await supabase
            .from('llg')
            .select('llg_id')
            .eq('llg_name', llg)
            .single()
        : { data: null };

      const wardData = shouldLookup
        ? await supabase
            .from('ward')
            .select('ward_id')
            .eq('ward_name', ward)
            .single()
        : { data: null };

      // ✅ Construct payload
      const payload = {
        id,
        email,
        full_name: name,
        role,
        province_id: provinceData.province_id,
        district_id: districtData?.data?.district_id || null,
        llg_id: llgData?.data?.llg_id || null,
        ward_id: wardData?.data?.ward_id || null,
        registration_number: role === 'FermentaryOwner' ? registrationNumber : null,
        organization_name: warehouseGroup.includes(role) ? orgName : null,
        created_at: new Date().toISOString(),
      };

      console.log('Submitting profile payload:', payload);

      // ✅ Upsert into user_profile table
      const { error, data } = await supabase
        .from('user_profile')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.error('Supabase error:', error.message);
        Alert.alert('Error', 'Failed to save profile');
        return;
      }

      await SecureStore.setItemAsync('user_role', role);
      Alert.alert('Success', 'Profile saved successfully');
    },
    [user]
  );

  return { submitProfile };
}
