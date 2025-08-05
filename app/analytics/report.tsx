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
import { ArrowLeft, TrendingUp, Calendar, Activity, Pill, Heart, BarChart3 } from 'lucide-react-native';
import { router } from 'expo-router';

import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { databaseService } from '@/database/DatabaseService';
import { HealthEntry } from '@/database/types';

export default function AnalyticsReportScreen() {
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

  // Calculate detailed analytics
  const getDetailedAnalytics = () => {
    const medicationEntries = healthEntries.filter(entry => entry.type === 'medication');
    const appointmentEntries = healthEntries.filter(entry => entry.type === 'appointment');
    const symptomEntries = healthEntries.filter(entry => entry.type === 'symptom');
    const behaviorEntries = healthEntries.filter(entry => entry.type === 'behavior');
    const vitalsEntries = healthEntries.filter(entry => entry.type === 'vitals');
    
    // Calculate health score
    const recentEntries = healthEntries.filter(entry => {
      // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
      const entryDate = new Date(entry.date.replace(/\//g, '-'));
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });
    
    let healthScore = 85;
    const severityPenalty = { 'Mild': -5, 'Moderate': -15, 'Severe': -25, 'Emergency': -40 };
    
    recentEntries.forEach(entry => {
      if (entry.severity && severityPenalty[entry.severity as keyof typeof severityPenalty]) {
        healthScore += severityPenalty[entry.severity as keyof typeof severityPenalty];
      }
    });
    
    healthScore = Math.max(0, Math.min(100, healthScore));

    // Calculate trends
    const lastMonthEntries = healthEntries.filter(entry => {
      // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
      const entryDate = new Date(entry.date.replace(/\//g, '-'));
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    const previousMonthEntries = healthEntries.filter(entry => {
      // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
      const entryDate = new Date(entry.date.replace(/\//g, '-'));
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= sixtyDaysAgo && entryDate < thirtyDaysAgo;
    });

    const trend = lastMonthEntries.length > previousMonthEntries.length ? 'up' : 
                  lastMonthEntries.length < previousMonthEntries.length ? 'down' : 'stable';

    return {
      healthScore,
      medicationEntries,
      appointmentEntries,
      symptomEntries,
      behaviorEntries,
      vitalsEntries,
      totalEntries: healthEntries.length,
      lastMonthEntries: lastMonthEntries.length,
      previousMonthEntries: previousMonthEntries.length,
      trend
    };
  };

  const analytics = getDetailedAnalytics();

  const formatDate = (dateString: string) => {
    // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
    return new Date(dateString.replace(/\//g, '-')).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text.secondary }}>Loading report...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={globalStyles.header}>
          <TouchableOpacity
            style={globalStyles.headerButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.headerTitle}>Health Report</Text>
          <View style={globalStyles.headerButton} />
        </View>

        <ScrollView 
          style={globalStyles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Pet Info */}
        <View style={globalStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={[globalStyles.iconContainer, { backgroundColor: colors.main.lightBlueGray }]}>
              <Activity size={24} color={colors.main.deepBlueGray} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={globalStyles.cardTitle}>{selectedPetData?.name || 'Your Pet'}</Text>
              <Text style={globalStyles.cardSubtitle}>Comprehensive Health Analysis</Text>
            </View>
          </View>
        </View>

        {/* Health Score */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.detailLabel}>Overall Health Score</Text>
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 8,
              borderColor: analytics.healthScore >= 80 ? colors.semantic.success : 
                          analytics.healthScore >= 60 ? colors.semantic.warning : colors.semantic.error,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background.primary,
            }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>
                {analytics.healthScore}%
              </Text>
            </View>
            <Text style={{ marginTop: 8, color: colors.text.secondary, fontSize: 14 }}>
              {analytics.healthScore >= 80 ? 'Excellent' : 
               analytics.healthScore >= 60 ? 'Good' : 'Needs Attention'}
            </Text>
          </View>
        </View>

        {/* Entry Summary */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.detailLabel}>Health Entries Summary</Text>
          <View style={globalStyles.detailRow}>
            <Text style={[globalStyles.detailValue, { textAlign: 'left' }]}>Total Entries</Text>
            <Text style={globalStyles.detailValue}>{analytics.totalEntries}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <Text style={[globalStyles.detailValue, { textAlign: 'left' }]}>This Month</Text>
            <Text style={globalStyles.detailValue}>{analytics.lastMonthEntries}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <Text style={[globalStyles.detailValue, { textAlign: 'left' }]}>Previous Month</Text>
            <Text style={globalStyles.detailValue}>{analytics.previousMonthEntries}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <Text style={[globalStyles.detailValue, { textAlign: 'left' }]}>Trend</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TrendingUp 
                size={16} 
                color={analytics.trend === 'up' ? colors.semantic.success : 
                       analytics.trend === 'down' ? colors.semantic.error : colors.text.secondary} 
              />
              <Text style={[globalStyles.detailValue, { marginLeft: 4 }]}>
                {analytics.trend === 'up' ? 'Increasing' : 
                 analytics.trend === 'down' ? 'Decreasing' : 'Stable'}
              </Text>
            </View>
          </View>
        </View>

        {/* Entry Types Breakdown */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.detailLabel}>Entry Types Breakdown</Text>
          <View style={globalStyles.detailRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Pill size={16} color={colors.main.deepBlueGray} />
              <Text style={[globalStyles.detailValue, { textAlign: 'left', marginLeft: 8 }]}>Medications</Text>
            </View>
            <Text style={globalStyles.detailValue}>{analytics.medicationEntries.length}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={16} color={colors.main.deepBlueGray} />
              <Text style={[globalStyles.detailValue, { textAlign: 'left', marginLeft: 8 }]}>Appointments</Text>
            </View>
            <Text style={globalStyles.detailValue}>{analytics.appointmentEntries.length}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Activity size={16} color={colors.main.deepBlueGray} />
              <Text style={[globalStyles.detailValue, { textAlign: 'left', marginLeft: 8 }]}>Symptoms</Text>
            </View>
            <Text style={globalStyles.detailValue}>{analytics.symptomEntries.length}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Heart size={16} color={colors.main.deepBlueGray} />
              <Text style={[globalStyles.detailValue, { textAlign: 'left', marginLeft: 8 }]}>Behavior</Text>
            </View>
            <Text style={globalStyles.detailValue}>{analytics.behaviorEntries.length}</Text>
          </View>
          <View style={globalStyles.detailRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <BarChart3 size={16} color={colors.main.deepBlueGray} />
              <Text style={[globalStyles.detailValue, { textAlign: 'left', marginLeft: 8 }]}>Vitals</Text>
            </View>
            <Text style={globalStyles.detailValue}>{analytics.vitalsEntries.length}</Text>
          </View>
        </View>

        {/* Recent Activity */}
        {healthEntries.length > 0 && (
          <View style={globalStyles.card}>
            <Text style={globalStyles.detailLabel}>Recent Activity</Text>
            {healthEntries.slice(0, 5).map((entry, index) => (
              <View key={entry.id} style={[
                globalStyles.detailRow, 
                { marginBottom: index < 4 ? 8 : 0 }
              ]}>
                <View style={{ flex: 1 }}>
                  <Text style={[globalStyles.detailValue, { textAlign: 'left', fontSize: 14 }]}>
                    {entry.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                    {formatDate(entry.date)}
                  </Text>
                </View>
                <Text style={[globalStyles.detailValue, { fontSize: 12 }]}>
                  {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.detailLabel}>Recommendations</Text>
          {analytics.healthScore < 60 && (
            <Text style={{ color: colors.semantic.error, marginBottom: 8 }}>
              • Schedule a veterinary checkup soon
            </Text>
          )}
          {analytics.symptomEntries.length > 3 && (
            <Text style={{ color: colors.semantic.warning, marginBottom: 8 }}>
              • Monitor symptoms closely and consider vet consultation
            </Text>
          )}
          {analytics.medicationEntries.length === 0 && (
            <Text style={{ color: colors.text.secondary, marginBottom: 8 }}>
              • No medications currently tracked
            </Text>
          )}
          {analytics.appointmentEntries.length === 0 && (
            <Text style={{ color: colors.text.secondary, marginBottom: 8 }}>
              • No upcoming appointments scheduled
            </Text>
          )}
          {analytics.totalEntries === 0 && (
            <Text style={{ color: colors.text.secondary, marginBottom: 8 }}>
              • Start logging health entries to get personalized insights
            </Text>
          )}
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 