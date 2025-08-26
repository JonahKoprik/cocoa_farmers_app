import { UserContext } from '@/context/UserContext';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
}
