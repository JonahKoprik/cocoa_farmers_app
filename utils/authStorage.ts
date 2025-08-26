// utils/authStorage.ts
import * as SecureStore from 'expo-secure-store';

export const saveSession = async (token: string, userId: string) => {
  await SecureStore.setItemAsync('access_token', token);
  await SecureStore.setItemAsync('user_id', userId);
};

export const restoreSession = async () => {
  const token = await SecureStore.getItemAsync('access_token');
  const userId = await SecureStore.getItemAsync('user_id');
  return token && userId ? { token, userId } : null;
};

export const clearSession = async () => {
  await SecureStore.deleteItemAsync('access_token');
  await SecureStore.deleteItemAsync('user_id');
};
    