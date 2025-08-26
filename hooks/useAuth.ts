import { UserContext, type UserContextType } from '@/context/UserContext';
import { useContext } from 'react';

export function useAuth(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
}
