// app/hooks/useAuthForm.ts
import { useState } from 'react';
import { Alert } from 'react-native';

export function useAuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Replace with your actual login logic (e.g., Supabase, Firebase, custom API)
      const success = await fakeLogin(email, password);
      if (!success) throw new Error('Invalid credentials');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    handleSubmit,
    loading,
  };
}

// Mock login function for testing
async function fakeLogin(email: string, password: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 1000));
  return email === 'test@example.com' && password === 'password123';
}
