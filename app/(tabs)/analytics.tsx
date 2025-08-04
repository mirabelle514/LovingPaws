import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  TrendingUp,
  Calendar,
  Activity,
  Pill,
  Heart,
} from 'lucide-react-native';

import { AnalyticsCard } from '@/components/AnalyticsCard';
import { HealthTrendChart } from '@/components/HealthTrendChart';
import { PetSelector } from '@/components/PetSelector';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';

export default function AnalyticsScreen() {
  const [selectedPet, setSelectedPet] = React.useState('1');

  const pets = [
    { id: '1', name: 'Buddy', type: 'Dog' },
    { id: '2', name: 'Whiskers', type: 'Cat' },
  ];

  const analyticsData = [
    {
      id: '1',
      title: 'Health Score',
      value: '85%',
      change: '+5%',
      trend: 'up' as const,
      icon: <Activity size={24} color={colors.background.primary} />,
      gradient: [colors.main.deepBlueGray, colors.main.dustyBlue] as readonly string[],
    },
    {
      id: '2',
      title: 'Medications',
      value: '12',
      change: 'This month',
      trend: 'neutral' as const,
      icon: <Pill size={24} color={colors.background.primary} />,
      gradient: [colors.main.dustyBlue, colors.main.gentleLavenderGray] as readonly string[],
    },
    {
      id: '3',
      title: 'Appointments',
      value: '3',
      change: 'Upcoming',
      trend: 'neutral' as const,
      icon: <Calendar size={24} color={colors.background.primary} />,
      gradient: [colors.main.softPeriwinkle, colors.main.dustyBlue] as readonly string[],
    },
    {
      id: '4',
      title: 'Activity Level',
      value: 'High',
      change: '+2 levels',
      trend: 'up' as const,
      icon: <Heart size={24} color={colors.background.primary} />,
      gradient: [colors.main.gentleLavenderGray, colors.main.softPeriwinkle] as readonly string[],
    },
  ];

  return (
    <SafeAreaView style={globalStyles.analyticsContainer}>
      <ScrollView style={globalStyles.analyticsScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.analyticsHeader}>
          <Text style={globalStyles.analyticsTitle}>Analytics</Text>
          <Text style={globalStyles.analyticsSubtitle}>
            Track your pet's health trends and insights
          </Text>
        </View>

        {/* Pet Selection */}
        <View style={globalStyles.analyticsSection}>
          <Text style={globalStyles.analyticsSectionTitle}>Select Pet</Text>
          <PetSelector
            pets={pets}
            selectedPet={selectedPet}
            onSelectPet={setSelectedPet}
          />
        </View>

        {/* Analytics Cards */}
        <View style={globalStyles.analyticsSection}>
          <Text style={globalStyles.analyticsSectionTitle}>Overview</Text>
          <View style={globalStyles.analyticsGrid}>
            {analyticsData.map((data) => (
              <AnalyticsCard key={data.id} data={data} />
            ))}
          </View>
        </View>

        {/* Health Trend Chart */}
        <View style={globalStyles.analyticsSection}>
          <Text style={globalStyles.analyticsSectionTitle}>Health Trends</Text>
          <HealthTrendChart />
        </View>

        {/* Insights Card */}
        <View style={globalStyles.analyticsSection}>
          <Text style={globalStyles.analyticsSectionTitle}>AI Insights</Text>
          <View style={globalStyles.analyticsInsightCard}>
            <View style={[globalStyles.analyticsInsightGradient, { backgroundColor: colors.main.deepBlueGray }]}>
              <View style={globalStyles.analyticsInsightHeader}>
                <TrendingUp size={24} color={colors.text.inverse} />
                <Text style={globalStyles.analyticsInsightTitle}>Health Analysis</Text>
              </View>
              <Text style={globalStyles.analyticsInsightText}>
                Buddy's overall health has improved by 15% this month. The consistent medication schedule and regular exercise are showing positive results.
              </Text>
              <TouchableOpacity style={globalStyles.analyticsInsightButton}>
                <Text style={globalStyles.analyticsInsightButtonText}>View Detailed Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Patterns */}
        <View style={globalStyles.analyticsSection}>
          <Text style={globalStyles.analyticsSectionTitle}>Recent Patterns</Text>
          <View style={globalStyles.analyticsPatternsList}>
            <View style={globalStyles.analyticsPatternItem}>
              <View style={globalStyles.analyticsPatternDot} />
              <Text style={globalStyles.analyticsPatternText}>
                Increased activity after morning walks
              </Text>
            </View>
            <View style={globalStyles.analyticsPatternItem}>
              <View style={[globalStyles.analyticsPatternDot, { backgroundColor: colors.main.dustyBlue }]} />
              <Text style={globalStyles.analyticsPatternText}>
                Medication effectiveness peaks at 2-3 hours
              </Text>
            </View>
            <View style={globalStyles.analyticsPatternItem}>
              <View style={[globalStyles.analyticsPatternDot, { backgroundColor: colors.main.gentleLavenderGray }]} />
              <Text style={globalStyles.analyticsPatternText}>
                Better appetite on rainy days
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}