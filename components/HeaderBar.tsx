import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';

type HeaderBarProps = {
    userName: string;
};

export const HeaderBar = ({ userName }: HeaderBarProps) => {
    const initial = userName?.charAt(0).toUpperCase() || '?';

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cocoa Dashboard</Text>
            <View style={styles.icons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.actionPrimary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="person-circle-outline" size={28} color={Colors.actionPrimary} />
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.backgroundSecondary,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    icons: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 16,
    },
    initialCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.actionPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        color: Colors.backgroundSecondary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
