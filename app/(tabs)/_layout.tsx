import { useUserRole } from '@/hooks/useUserRole';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from "../../constants/colors";

export default function TabsLayout() {
    const { role, loading } = useUserRole();

    if (loading) return null; // or a spinner if you prefer

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.actionPrimary,
            tabBarInactiveTintColor: Colors.actionPrimary,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="farmingTips"
                options={{
                    title: 'Tips',
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? 'bulb' : 'bulb-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="fermentaryPrice"
                options={{
                    title: 'Prices',
                    tabBarIcon: ({ focused, color, size }) => <Ionicons
                        name={focused ? "pricetag" : "pricetag-outline"}
                        size={size}
                        color={color}
                    />,
                }}
            />
            <Tabs.Screen
                name="posts"
                options={{
                    title: 'Discussion',
                    tabBarIcon: ({ focused, color, size }) => <Ionicons
                        name={focused ? "chatbubble" : "chatbubble-outline"}
                        size={size}
                        color={color}
                    />,
                }}
            />

            {/* 
            {(role === 'farmer' || role === 'fermentary') && (
                
            )} */}

            {/* {(role === 'warehouse' || role === 'organization') && (
                
            )} */}




            <Tabs.Screen
                name="newsFeeds"
                options={{
                    title: 'News',
                    tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "newspaper" : "newspaper-outline"}
                        size={size}
                        color={color} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color, size }) =>
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"}
                            size={size}
                            color={color} />,
                }}
            />
        </Tabs>
    );
}
