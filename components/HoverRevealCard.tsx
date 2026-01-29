import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    Animated,
    GestureResponderEvent,
    Platform,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';

export interface HoverRevealCardProps {
    // Main content (always visible)
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;

    // Reveal content (shown on hover)
    revealTitle?: string;
    revealContent?: string | React.ReactNode;
    revealPoints?: string[];

    // Styling
    gradientColors?: readonly [string, string, ...string[]];
    backgroundColor?: string;
    cardWidth?: number;
    cardHeight?: number;

    // Callbacks
    onPress?: () => void;

    // Custom styles
    titleStyle?: StyleProp<TextStyle>;
    subtitleStyle?: StyleProp<TextStyle>;
    revealTitleStyle?: StyleProp<TextStyle>;
    revealContentStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
}

export const HoverRevealCard: React.FC<HoverRevealCardProps> = ({
    title,
    subtitle,
    icon,
    revealTitle,
    revealContent,
    revealPoints,
    gradientColors = ['#2D5016', '#4A7C23', '#6B9B3A'],
    backgroundColor = Colors.backgroundSecondary,
    cardWidth = 280,
    cardHeight = 180,
    onPress,
    titleStyle,
    subtitleStyle,
    revealTitleStyle,
    revealContentStyle,
    containerStyle,
}) => {
    const animationValue = useRef(new Animated.Value(0)).current;
    const isHovered = useRef(false);

    // Animation configurations
    const cardScale = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.05],
    });

    const revealOpacity = animationValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
    });

    const contentTranslateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const iconScale = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.2],
    });

    const defaultContentOpacity = animationValue.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [1, 0.3, 0],
    });

    // Web-specific hover handlers
    const handleMouseEnter = () => {
        if (Platform.OS === 'web' && !isHovered.current) {
            isHovered.current = true;
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleMouseLeave = () => {
        if (Platform.OS === 'web' && isHovered.current) {
            isHovered.current = false;
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePress = (e: GestureResponderEvent) => {
        // Press animation
        Animated.sequence([
            Animated.timing(animationValue, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(animationValue, {
                toValue: isHovered.current ? 1 : 0,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        onPress?.();
    };

    // For mobile: use long press to reveal
    const handleLongPress = () => {
        if (Platform.OS !== 'web') {
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = (e: GestureResponderEvent) => {
        if (Platform.OS !== 'web') {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    // Build pressable props with web hover support
    const pressableProps: PressableProps = {
        onPress: handlePress,
        onLongPress: handleLongPress,
        onPressOut: handlePressOut,
        style: ({ pressed }) => [
            styles.pressable,
            {
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: cardScale }],
            },
        ],
    };

    // Add web-specific events
    if (Platform.OS === 'web') {
        (pressableProps as unknown as { onMouseEnter: () => void }).onMouseEnter = handleMouseEnter;
        (pressableProps as unknown as { onMouseLeave: () => void }).onMouseLeave = handleMouseLeave;
    }

    return (
        <View style={[styles.wrapper, containerStyle]}>
            <Pressable {...pressableProps}>
                <LinearGradient
                    colors={gradientColors}
                    style={[styles.card, { width: cardWidth, height: cardHeight }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {/* Background overlay on hover */}
                    <Animated.View
                        style={[
                            styles.overlay,
                            { opacity: revealOpacity },
                        ]}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)']}
                            style={StyleSheet.absoluteFillObject}
                        />
                    </Animated.View>

                    {/* Default content */}
                    <Animated.View
                        style={[
                            styles.defaultContent,
                            {
                                opacity: defaultContentOpacity,
                                transform: [{ translateY: contentTranslateY }],
                            },
                        ]}
                    >
                        {icon && (
                            <Animated.View style={[styles.iconContainer, { transform: [{ scale: iconScale }] }]}>
                                {icon}
                            </Animated.View>
                        )}
                        <Text style={[styles.title, titleStyle]}>{title}</Text>
                        {subtitle && (
                            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
                        )}
                        {Platform.OS === 'web' && (
                            <Text style={styles.hoverHint}>Hover to reveal more</Text>
                        )}
                        {Platform.OS !== 'web' && (
                            <Text style={styles.hoverHint}>Long press to reveal</Text>
                        )}
                    </Animated.View>

                    {/* Reveal content */}
                    {(revealTitle || revealContent || revealPoints) && (
                        <Animated.View
                            style={[
                                styles.revealContent,
                                {
                                    opacity: revealOpacity,
                                    transform: [
                                        { translateY: contentTranslateY },
                                    ],
                                },
                            ]}
                        >
                            {revealTitle && (
                                <Text style={[styles.revealTitle, revealTitleStyle]}>{revealTitle}</Text>
                            )}
                            {revealContent && (
                                <Text style={[styles.revealContentText, revealContentStyle]}>
                                    {revealContent}
                                </Text>
                            )}
                            {revealPoints && (
                                <View style={styles.pointsContainer}>
                                    {revealPoints.map((point, index) => (
                                        <View key={index} style={styles.pointRow}>
                                            <View style={styles.bullet} />
                                            <Text style={styles.pointText}>{point}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </Animated.View>
                    )}
                </LinearGradient>
            </Pressable>
        </View>
    );
};

// Variants for different use cases

// Price Card Variant
export const PriceHoverCard: React.FC<{
    title: string;
    price: string;
    change?: string;
    details: string[];
    onPress?: () => void;
}> = ({ title, price, change, details, onPress }) => (
    <HoverRevealCard
        title={title}
        subtitle={price}
        revealTitle="Price Details"
        revealContent={change}
        revealPoints={details}
        gradientColors={['#1E3A5F', '#2E5A8F', '#4A7BB7']}
        onPress={onPress}
    />
);

// Farming Tip Card Variant
export const TipHoverCard: React.FC<{
    tipTitle: string;
    category: string;
    description: string;
    benefits: string[];
    onPress?: () => void;
}> = ({ tipTitle, category, description, benefits, onPress }) => (
    <HoverRevealCard
        title={category}
        subtitle={tipTitle}
        revealTitle="Benefits"
        revealContent={description}
        revealPoints={benefits}
        gradientColors={['#2E7D32', '#388E3C', '#4CAF50']}
        onPress={onPress}
    />
);

// News Card Variant
export const NewsHoverCard: React.FC<{
    headline: string;
    source: string;
    summary: string;
    keyPoints: string[];
    onPress?: () => void;
}> = ({ headline, source, summary, keyPoints, onPress }) => (
    <HoverRevealCard
        title={source}
        subtitle={headline}
        revealTitle="Summary"
        revealContent={summary}
        revealPoints={keyPoints}
        gradientColors={['#C62828', '#D32F2F', '#E53935']}
        onPress={onPress}
    />
);

// Service Card Variant
export const ServiceHoverCard: React.FC<{
    serviceName: string;
    provider: string;
    description: string;
    features: string[];
    onPress?: () => void;
}> = ({ serviceName, provider, description, features, onPress }) => (
    <HoverRevealCard
        title={provider}
        subtitle={serviceName}
        revealTitle="Features"
        revealContent={description}
        revealPoints={features}
        gradientColors={['#6A1B9A', '#7B1FA2', '#9C27B0']}
        onPress={onPress}
    />
);

const styles = StyleSheet.create({
    wrapper: {
        margin: 8,
    },
    pressable: {
        borderRadius: 16,
    },
    card: {
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    defaultContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginTop: 4,
    },
    hoverHint: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginTop: 12,
        fontStyle: 'italic',
    },
    revealContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 20,
        justifyContent: 'center',
    },
    revealTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    revealContentText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 20,
    },
    pointsContainer: {
        marginTop: 8,
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CAF50',
        marginTop: 7,
        marginRight: 10,
    },
    pointText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        flex: 1,
        lineHeight: 18,
    },
});
