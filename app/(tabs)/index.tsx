import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Pill, Activity, MapPin } from 'lucide-react-native';

import { PetCard } from '@/components/PetCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { RecentEntry } from '@/components/RecentEntry';
import { EmergencyAlert } from '@/components/EmergencyAlert';
import { DatabaseTest } from '@/components/DatabaseTest';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { pets } = usePets();

  const [recentEntries] = useState([
    {
      id: '1',
      petName: 'Buddy',
      type: 'Medication',
      title: 'Flea Treatment',
      time: '2 hours ago',
      icon: 'pill',
              color: colors.main.dustyBlue,
    },
    {
      id: '2',
      petName: 'Whiskers',
      type: 'Symptom',
      title: 'Decreased appetite',
      time: '1 day ago',
      icon: 'activity',
              color: colors.semantic.error,
    },
    {
      id: '3',
      petName: 'Buddy',
      type: 'Appointment',
      title: 'Vaccination checkup',
      time: '3 days ago',
      icon: 'calendar',
              color: colors.main.deepBlueGray,
    },
  ]);

  return (
    <SafeAreaView style={globalStyles.homeContainer}>
      <ScrollView style={globalStyles.homeScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.homeHeader}>
          <View>
            <Text style={globalStyles.homeGreeting}>Good morning!</Text>
            <Text style={globalStyles.homeWelcomeText}>Let's check on your furry babies</Text>
          </View>
        </View>

        {/* Emergency Alert */}
        <EmergencyAlert />

        {/* Database Test (Temporary) */}
        <DatabaseTest />

        {/* My Pets Section */}
        <View style={globalStyles.homeSection}>
          <View style={globalStyles.homeSectionHeader}>
            <Text style={globalStyles.homeSectionTitle}>My Pets</Text>
            <TouchableOpacity 
              style={globalStyles.homeAddButton}
              onPress={() => router.push('/(pets)/add' as any)}
            >
              <Plus size={20} color={colors.main.deepBlueGray} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={globalStyles.homePetsScroll}
          >
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={globalStyles.homeSection}>
          <Text style={globalStyles.homeSectionTitle}>Quick Actions</Text>
          <View style={globalStyles.homeQuickActions}>
              <QuickActionCard
                icon={<Activity size={24} color={colors.background.primary} />}
                title="Log Symptom"
                subtitle="Track health changes"
                onPress={() => router.push('/(health)/log-symptom' as any)}
              />
              <QuickActionCard
                icon={<Pill size={24} color={colors.background.primary} />}
                title="Give Medication"
                subtitle="Record treatments"
                onPress={() => router.push('/(health)/give-medication' as any)}
              />
              <QuickActionCard
                icon={<Calendar size={24} color={colors.background.primary} />}
                title="Schedule Visit"
                subtitle="Book appointment"
                onPress={() => router.push('/(health)/schedule-visit' as any)}
              />
              <QuickActionCard
                icon={<MapPin size={24} color={colors.background.primary} />}
                title="Find Vet"
                subtitle="Locate nearby clinics"
                onPress={() => router.push('/(tabs)/veterinary' as any)}
              />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={globalStyles.homeSection}>
          <Text style={globalStyles.homeSectionTitle}>Recent Activity</Text>
          <View style={globalStyles.homeRecentEntries}>
            {recentEntries.map((entry) => (
              <RecentEntry key={entry.id} entry={entry} />
            ))}
          </View>
        </View>

        {/* Health Insights */}
      <View style={globalStyles.homeSection}>
        <Text style={globalStyles.homeSectionTitle}>Health Insights</Text>
          <View style={globalStyles.homeInsightCard}>
            <View style={[globalStyles.homeInsightGradient, { backgroundColor: colors.main.softPeriwinkle }]}>
              <View style={globalStyles.homeInsightContent}>
                <Text style={globalStyles.homeInsightTitle}>Weekly Summary</Text>
                <Text style={globalStyles.homeInsightText}>
                  Buddy's appetite has improved 15% this week. Great progress!
                </Text>
                <TouchableOpacity style={globalStyles.homeInsightButton}>
                  <Text style={globalStyles.homeInsightButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}