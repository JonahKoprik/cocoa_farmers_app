import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { HoverRevealCard, NewsHoverCard, PriceHoverCard, ServiceHoverCard, TipHoverCard } from './HoverRevealCard';

export const HoverRevealCardsDemo: React.FC = () => {
    const handleCardPress = () => {
        console.log('Card pressed!');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.header}>Hover Reveal Cards Demo</Text>
                <Text style={styles.subHeader}>
                    Hover over cards (web) or long press (mobile) to reveal hidden content
                </Text>

                {/* Basic Hover Reveal Cards */}
                <Text style={styles.sectionTitle}>Basic Cards</Text>
                <View style={styles.row}>
                    <HoverRevealCard
                        title="Cocoa Prices"
                        subtitle="K 12.50/kg"
                        revealTitle="Market Update"
                        revealContent="Prices have increased by 5% this week"
                        revealPoints={['Strong demand from Europe', 'Quality premiums available', 'Export opportunities']}
                        gradientColors={['#1E3A5F', '#2E5A8F', '#4A7BB7']}
                        onPress={handleCardPress}
                    />
                    <HoverRevealCard
                        title="Farming Tips"
                        subtitle="Pruning Techniques"
                        revealTitle="Key Benefits"
                        revealContent="Proper pruning improves yield and tree health"
                        revealPoints={['Remove dead branches', 'Improve air circulation', 'Increase sunlight penetration']}
                        gradientColors={['#2E7D32', '#388E3C', '#4CAF50']}
                        onPress={handleCardPress}
                    />
                </View>

                {/* Price Hover Cards */}
                <Text style={styles.sectionTitle}>Price Cards</Text>
                <View style={styles.row}>
                    <PriceHoverCard
                        title="Grade A Cocoa"
                        price="K 15.20/kg"
                        change="+2.5% from last week"
                        details={['Premium quality', 'Export grade', 'Moisture < 7%']}
                        onPress={handleCardPress}
                    />
                    <PriceHoverCard
                        title="Grade B Cocoa"
                        price="K 12.80/kg"
                        change="+1.2% from last week"
                        details={['Standard quality', 'Local market', 'Moisture < 8%']}
                        onPress={handleCardPress}
                    />
                </View>

                {/* Tip Hover Cards */}
                <Text style={styles.sectionTitle}>Farming Tips</Text>
                <View style={styles.row}>
                    <TipHoverCard
                        tipTitle="Pest Control"
                        category="Integrated Pest Management"
                        description="Use biological controls and minimal pesticides"
                        benefits={['Reduce chemical costs', 'Better bean quality', 'Environmental friendly']}
                        onPress={handleCardPress}
                    />
                    <TipHoverCard
                        tipTitle="Soil Health"
                        category="Organic Fertilization"
                        description="Apply compost and organic matter annually"
                        benefits={['Improved structure', 'Better moisture retention', 'Natural nutrients']}
                        onPress={handleCardPress}
                    />
                </View>

                {/* News Hover Cards */}
                <Text style={styles.sectionTitle}>News Cards</Text>
                <View style={styles.row}>
                    <NewsHoverCard
                        headline="New Export Regulations"
                        source="Cocoa Board"
                        summary="Updated quality standards for cocoa exports effective next month"
                        keyPoints={['New testing requirements', 'Updated grading system', 'Certification changes']}
                        onPress={handleCardPress}
                    />
                    <NewsHoverCard
                        headline="Weather Alert"
                        source="Meteorology Dept"
                        summary="Heavy rains expected in cocoa growing regions"
                        keyPoints={['Flood precautions', 'Harvest timing', 'Drainage recommendations']}
                        onPress={handleCardPress}
                    />
                </View>

                {/* Service Hover Cards */}
                <Text style={styles.sectionTitle}>Service Cards</Text>
                <View style={styles.row}>
                    <ServiceHoverCard
                        serviceName="Soil Testing"
                        provider="Agric. Services Ltd"
                        description="Professional soil analysis and recommendations"
                        features={['pH testing', 'Nutrient analysis', 'Custom fertilizer plans']}
                        onPress={handleCardPress}
                    />
                    <ServiceHoverCard
                        serviceName="Finance Options"
                        provider="Cocoa Farmers Union"
                        description="Access to low-interest loans for farm improvements"
                        features={['Flexible repayment', 'Group guarantees', 'Training included']}
                        onPress={handleCardPress}
                    />
                </View>

                {/* Custom Cards with Icons */}
                <Text style={styles.sectionTitle}>Custom Cards</Text>
                <View style={styles.row}>
                    <HoverRevealCard
                        title="Harvest Season"
                        subtitle="Coming Soon"
                        revealTitle="Preparation Tips"
                        revealContent="Get your equipment ready for the upcoming harvest"
                        revealPoints={['Clean drying platforms', 'Check fermentation boxes', 'Arrange storage']}
                        gradientColors={['#E65100', '#F57C00', '#FF9800']}
                        onPress={handleCardPress}
                    />
                    <HoverRevealCard
                        title="Training Session"
                        subtitle="Free Workshop"
                        revealTitle="Topics Covered"
                        revealContent="Learn modern cocoa farming techniques"
                        revealPoints={['Climate adaptation', 'Quality improvement', 'Market access']}
                        gradientColors={['#6A1B9A', '#7B1FA2', '#9C27B0']}
                        onPress={handleCardPress}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundPrimary,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.backgroundSecondary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.backgroundSecondary,
        marginTop: 24,
        marginBottom: 12,
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
});

export default HoverRevealCardsDemo;
