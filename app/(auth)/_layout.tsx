import { Stack } from 'expo-router';

export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
export const unstable_settings = {
    initialRouteName: 'login',
    drawer: null, // hides from drawer
};