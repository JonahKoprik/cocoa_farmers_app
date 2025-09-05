import { AccountPayload, Role, RoleEnum } from '@/components/types';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useAccountCreation() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Farmer');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [llg, setLLG] = useState('');
  const [ward, setWard] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !province.trim()) {
      Alert.alert('Missing Info', 'Please fill out all required fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          full_name: fullName.trim(),
          email: email.trim(),
          role: RoleEnum[role],
          province: province.trim(),
          district: district.trim() || null,
          llg: llg.trim() || null,
          ward: ward.trim() || null,
          registration_number: role === 'FermentaryOwner' ? registrationNumber.trim() : null,
        }]);

      if (error) throw new Error(error.message);

      Alert.alert('Success', 'Account created successfully!');
      setFullName('');
      setEmail('');
      setRole('Farmer');
      setProvince('');
      setDistrict('');
      setLLG('');
      setWard('');
      setRegistrationNumber('');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (payload: AccountPayload): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.from('users').insert([payload]);
      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Unexpected error occurred.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fullName, setFullName,
    email, setEmail,
    role, setRole,
    province, setProvince,
    district, setDistrict,
    llg, setLLG,
    ward, setWard,
    registrationNumber, setRegistrationNumber,
    handleSubmit,
    createAccount,
    loading,
  };
}
