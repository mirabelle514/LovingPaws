import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, Pill, Activity, BarChart3 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

import { PetCard } from '@/components/PetCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { RecentEntry } from '@/components/RecentEntry';
import { EmergencyAlert } from '@/components/EmergencyAlert';
import DatabaseTest from '@/components/DatabaseTest';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { useUser } from '@/contexts/UserContext';
import { useHealthEntries } from '@/hooks/useHealthEntries';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { pets } = usePets();
  const { userData } = useUser();
  const { recentEntries, loading, error, refresh } = useHealthEntries(5);

  // Dynamic greeting based on time of day and user name
  const getDynamicGreeting = () => {
    const hour = new Date().getHours();
    const userName = userData.userName.split(' ')[0]; // Get first name only
    
    if (hour >= 5 && hour < 12) {
      return `Good morning, ${userName}!`;
    } else if (hour >= 12 && hour < 17) {
      return `Good afternoon, ${userName}!`;
    } else if (hour >= 17 && hour < 21) {
      return `Good evening, ${userName}!`;
    } else {
      return `Good night, ${userName}!`;
    }
  };

  // Dynamic welcome text based on pets
  const getDynamicWelcomeText = () => {
    if (pets.length === 0) {
      return "Ready to add your first pet?";
    } else if (pets.length === 1) {
      const pet = pets[0];
      return `Let's check on ${pet.name}`;
    } else {
      // 2 pets and more - show first pet and "and company"
      return `Let's check on ${pets[0].name}and company`;
    }
  };

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
            <Text style={globalStyles.homeGreeting}>{getDynamicGreeting()}</Text>
            <Text style={globalStyles.homeWelcomeText}>{getDynamicWelcomeText()}</Text>
          </View>
        </View>

        {/* Emergency Alert */}
        <EmergencyAlert />

       {/* Database Test (Temporary) */}
        {/* <DatabaseTest /> */}

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
                icon={<BarChart3 size={24} color={colors.main.deepBlueGray} />}
                title="Analytics"
                subtitle="View health insights"
                onPress={() => router.push('/analytics' as any)}
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
              <View style={[globalStyles.homeInsightBackground, { backgroundColor: colors.main.deepBlueGray }]}>
                <View style={globalStyles.homeInsightContent}>
                  <Text style={globalStyles.homeInsightTitle}>Activity Overview</Text>
                  
                  {/* Activity Count */}
                  <Text style={globalStyles.homeInsightText}>
                    {recentEntries.length} health entries in the last 30 days
                  </Text>
                  
                  {/* Entry Type Breakdown */}
                  {(() => {
                    const typeCounts = recentEntries.reduce((acc, entry) => {
                      acc[entry.type] = (acc[entry.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    const typeBreakdown = Object.entries(typeCounts)
                      .map(([type, count]) => `${count} ${type.toLowerCase()}${count > 1 ? 's' : ''}`)
                      .join(', ');
                    
                    return (
                      <Text style={globalStyles.homeInsightText}>
                        Includes: {typeBreakdown}
                      </Text>
                    );
                  })()}
                  
                  {/* Most Active Pet */}
                  {(() => {
                    const petCounts = recentEntries.reduce((acc, entry) => {
                      acc[entry.petName] = (acc[entry.petName] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    const mostActivePet = Object.entries(petCounts)
                      .sort(([,a], [,b]) => b - a)[0];
                    
                    if (mostActivePet) {
                      return (
                        <Text style={globalStyles.homeInsightText}>
                          {mostActivePet[0]} has the most activity ({mostActivePet[1]} entries)
                        </Text>
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Latest Activity */}
                  {recentEntries.length > 0 && (
                    <Text style={globalStyles.homeInsightText}>
                      Latest: {recentEntries[0].petName}'s {recentEntries[0].type.toLowerCase()} - {recentEntries[0].time}
                    </Text>
                  )}
                  
                  <TouchableOpacity 
                    style={globalStyles.homeInsightButton}
                    onPress={() => router.push('/analytics' as any)}
                  >
                    <Text style={globalStyles.homeInsightButtonText}>View Detailed Analytics</Text>
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