import * as SecureStore from 'expo-secure-store';

export function useSecureStore() {
  const saveToken = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  };

  const getToken = async (key: string) => {
    return await SecureStore.getItemAsync(key);
  };

  const deleteToken = async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  };

  return { saveToken, getToken, deleteToken };
}
