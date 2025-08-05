import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  TrendingUp,
  Calendar,
  Activity,
  Pill,
  Heart,
  ArrowLeft,
} from 'lucide-react-native';

import { AnalyticsCard } from '@/components/AnalyticsCard';
import { HealthTrendChart } from '@/components/HealthTrendChart';
import { PetSelector } from '@/components/PetSelector';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { databaseService } from '@/database/DatabaseService';
import { HealthEntry } from '@/database/types';
import { router } from 'expo-router';

export default function AnalyticsScreen() {
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [healthEntries, setHealthEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Set first pet as selected when pets are loaded
  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0].id);
    }
  }, [pets, selectedPet]);

  // Load health entries for selected pet
  useEffect(() => {
    if (selectedPet) {
      loadHealthEntries();
    }
  }, [selectedPet]);

  const loadHealthEntries = async () => {
    try {
      setLoading(true);
      await databaseService.init();
      const entries = await databaseService.getHealthEntries();
      const petEntries = entries.filter(entry => entry.petId === selectedPet);
      setHealthEntries(petEntries);
    } catch (error) {
      console.error('Error loading health entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPetData = pets.find(pet => pet.id === selectedPet);

  // Calculate analytics data from real health entries
  const getAnalyticsData = () => {
    const medicationEntries = healthEntries.filter(entry => entry.type === 'medication');
    const appointmentEntries = healthEntries.filter(entry => entry.type === 'appointment');
    const symptomEntries = healthEntries.filter(entry => entry.type === 'symptom');
    
    // Calculate health score based on recent entries and severity
    const recentEntries = healthEntries.filter(entry => {
      // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
      const entryDate = new Date(entry.date.replace(/\//g, '-'));
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });
    
    let healthScore = 85; // Base score
    const severityPenalty = { 'Mild': -5, 'Moderate': -15, 'Severe': -25, 'Emergency': -40 };
    
    recentEntries.forEach(entry => {
      if (entry.severity && severityPenalty[entry.severity as keyof typeof severityPenalty]) {
        healthScore += severityPenalty[entry.severity as keyof typeof severityPenalty];
      }
    });
    
    healthScore = Math.max(0, Math.min(100, healthScore));

    return [
      {
        id: '1',
        title: 'Health Score',
        value: `${healthScore}%`,
        change: healthScore >= 85 ? '+5%' : healthScore >= 70 ? 'Stable' : '-10%',
        trend: healthScore >= 85 ? 'up' as const : healthScore >= 70 ? 'neutral' as const : 'down' as const,
        icon: <Activity size={24} color={colors.main.deepBlueGray} />,
      },
      {
        id: '2',
        title: 'Medications',
        value: medicationEntries.length.toString(),
        change: medicationEntries.length > 0 ? 'This month' : 'No medications',
        trend: 'neutral' as const,
        icon: <Pill size={24} color={colors.main.deepBlueGray} />,
      },
      {
        id: '3',
        title: 'Appointments',
        value: appointmentEntries.length.toString(),
        change: appointmentEntries.length > 0 ? 'Scheduled' : 'No appointments',
        trend: 'neutral' as const,
        icon: <Calendar size={24} color={colors.main.deepBlueGray} />,
      },
      {
        id: '4',
        title: 'Symptoms',
        value: symptomEntries.length.toString(),
        change: symptomEntries.length > 0 ? 'Tracked' : 'No symptoms',
        trend: symptomEntries.length === 0 ? 'up' as const : 'neutral' as const,
        icon: <Heart size={24} color={colors.main.deepBlueGray} />,
      },
    ];
  };

    const analyticsData = getAnalyticsData();

  return (
    <SafeAreaView style={globalStyles.analyticsContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={globalStyles.analyticsScrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Header */}
        <View style={globalStyles.analyticsHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              style={globalStyles.headerButton}
              onPress={() => router.push('/(tabs)/' as any)}
            >
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={globalStyles.analyticsTitle}>Analytics</Text>
          </View>
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
                          <View style={[globalStyles.analyticsInsightBackground, { backgroundColor: colors.main.deepBlueGray }]}>
              <View style={globalStyles.analyticsInsightHeader}>
                <TrendingUp size={24} color={colors.text.inverse} />
                <Text style={globalStyles.analyticsInsightTitle}>Health Analysis</Text>
              </View>
              <Text style={globalStyles.analyticsInsightText}>
                {selectedPetData?.name || 'Your pet'}'s health is being tracked with {healthEntries.length} entries. {healthEntries.length > 0 ? `Latest activity: ${healthEntries[0]?.type} on ${new Date(healthEntries[0]?.date.replace(/\//g, '-')).toLocaleDateString()}` : 'Start logging health entries to see insights.'}
              </Text>
              <TouchableOpacity 
                style={globalStyles.analyticsInsightButton}
                onPress={() => router.push('/analytics/report' as any)}
              >
                <Text style={globalStyles.analyticsInsightButtonText}>View Detailed Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Patterns */}
        <View style={globalStyles.analyticsSection}>
          <Text style={globalStyles.analyticsSectionTitle}>Recent Patterns</Text>
          <View style={globalStyles.analyticsPatternsList}>
            {(() => {
              const patterns = [];
              
              // Pattern 1: Most common entry type
              const entryTypeCounts = healthEntries.reduce((acc, entry) => {
                acc[entry.type] = (acc[entry.type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              
              const mostCommonType = Object.entries(entryTypeCounts)
                .sort(([,a], [,b]) => b - a)[0];
              
              if (mostCommonType && mostCommonType[1] > 1) {
                patterns.push({
                  text: `Most frequent activity: ${mostCommonType[0]} entries (${mostCommonType[1]} times)`,
                  color: colors.main.deepBlueGray
                });
              }
              
              // Pattern 2: Recent activity trend
              const recentEntries = healthEntries.filter(entry => {
                // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
                const entryDate = new Date(entry.date.replace(/\//g, '-'));
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return entryDate >= sevenDaysAgo;
              });
              
              if (recentEntries.length > 0) {
                patterns.push({
                  text: `${recentEntries.length} health entries logged in the last 7 days`,
                  color: colors.main.dustyBlue
                });
              }
              
              // Pattern 3: Severity patterns
              const severityEntries = healthEntries.filter(entry => entry.severity && entry.severity !== 'Mild');
              if (severityEntries.length > 0) {
                patterns.push({
                  text: `${severityEntries.length} entries with moderate to severe symptoms`,
                  color: colors.main.gentleLavenderGray
                });
              }
              
              // Pattern 4: Time-based patterns
              const morningEntries = healthEntries.filter(entry => {
                if (!entry.time) return false;
                const hour = parseInt(entry.time.split(':')[0]);
                return hour >= 6 && hour <= 12;
              });
              
              const eveningEntries = healthEntries.filter(entry => {
                if (!entry.time) return false;
                const hour = parseInt(entry.time.split(':')[0]);
                return hour >= 18 && hour <= 22;
              });
              
              if (morningEntries.length > eveningEntries.length && morningEntries.length > 0) {
                patterns.push({
                  text: `More health activities recorded in the morning (${morningEntries.length} vs ${eveningEntries.length} evening)`,
                  color: colors.main.softPeriwinkle
                });
              } else if (eveningEntries.length > morningEntries.length && eveningEntries.length > 0) {
                patterns.push({
                  text: `More health activities recorded in the evening (${eveningEntries.length} vs ${morningEntries.length} morning)`,
                  color: colors.main.softPeriwinkle
                });
              }
              
              // Pattern 5: If no patterns found, show encouragement
              if (patterns.length === 0) {
                patterns.push({
                  text: "Start logging health entries to discover patterns",
                  color: colors.text.secondary
                });
              }
              
              return patterns.slice(0, 3).map((pattern, index) => (
                <View key={index} style={globalStyles.analyticsPatternItem}>
                  <View style={[globalStyles.analyticsPatternDot, { backgroundColor: pattern.color }]} />
                  <Text style={globalStyles.analyticsPatternText}>
                    {pattern.text}
                  </Text>
                </View>
              ));
            })()}
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}