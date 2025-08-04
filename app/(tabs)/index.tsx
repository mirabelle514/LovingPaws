import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Pill, Activity, MapPin } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import { PetCard } from '@/components/PetCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { RecentEntry } from '@/components/RecentEntry';
import { EmergencyAlert } from '@/components/EmergencyAlert';
import { DatabaseTest } from '@/components/DatabaseTest';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { useHealthEntries } from '@/hooks/useHealthEntries';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { pets } = usePets();
  const { recentEntries, loading, error, refresh } = useHealthEntries(5);

  // Refresh recent entries when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, []) // Remove refresh from dependencies to prevent infinite loop
  );

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
                icon={<Activity size={24} color={colors.main.deepBlueGray} />}
                title="Log Symptom"
                subtitle="Track health changes"
                onPress={() => router.push('/(health)/log-symptom' as any)}
              />
              <QuickActionCard
                icon={<Pill size={24} color={colors.main.deepBlueGray} />}
                title="Give Medication"
                subtitle="Record treatments"
                onPress={() => router.push('/(health)/give-medication' as any)}
              />
              <QuickActionCard
                icon={<Calendar size={24} color={colors.main.deepBlueGray} />}
                title="Schedule Visit"
                subtitle="Book appointment"
                onPress={() => router.push('/(health)/schedule-visit' as any)}
              />
              <QuickActionCard
                icon={<MapPin size={24} color={colors.main.deepBlueGray} />}
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
            {loading ? (
              <Text style={{ color: colors.text.secondary, textAlign: 'center', padding: 20 }}>
                Loading recent activity...
              </Text>
            ) : error ? (
              <Text style={{ color: colors.semantic.error, textAlign: 'center', padding: 20 }}>
                {error}
              </Text>
            ) : recentEntries.length === 0 ? (
              <Text style={{ color: colors.text.secondary, textAlign: 'center', padding: 20 }}>
                No recent activity. Start by logging a health entry!
              </Text>
            ) : (
              recentEntries.map((entry) => (
                <RecentEntry key={entry.id} entry={entry} />
              ))
            )}
          </View>
        </View>

        {/* Health Insights */}
        {recentEntries.length > 0 && (
          <View style={globalStyles.homeSection}>
            <Text style={globalStyles.homeSectionTitle}>Health Insights</Text>
            <View style={globalStyles.homeInsightCard}>
              <View style={[globalStyles.homeInsightGradient, { backgroundColor: colors.main.deepBlueGray }]}>
                <View style={globalStyles.homeInsightContent}>
                  <Text style={globalStyles.homeInsightTitle}>Recent Activity Summary</Text>
                  <Text style={globalStyles.homeInsightText}>
                    {recentEntries.length} health entries recorded recently. 
                    {recentEntries.length > 0 && ` Latest: ${recentEntries[0].petName}'s ${recentEntries[0].type.toLowerCase()}`}
                  </Text>
                  <TouchableOpacity style={globalStyles.homeInsightButton}>
                    <Text style={globalStyles.homeInsightButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}