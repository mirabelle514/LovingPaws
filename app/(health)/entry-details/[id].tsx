import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit, Trash2, Activity, Pill, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { databaseService } from '@/database/DatabaseService';
import { HealthEntry } from '@/database/types';

export default function HealthEntryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<HealthEntry | null>(null);
  const [petName, setPetName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEntryDetails();
    }
  }, [id]);

  const loadEntryDetails = async () => {
    try {
      setLoading(true);
      
      // Get the health entry
      const healthEntry = await databaseService.getHealthEntryById(id);
      if (!healthEntry) {
        Alert.alert('Error', 'Health entry not found');
        router.back();
        return;
      }

      setEntry(healthEntry);

      // Get pet name
      const pets = await databaseService.getPets();
      const pet = pets.find(p => p.id === healthEntry.petId);
      setPetName(pet?.name || 'Unknown Pet');

    } catch (error) {
      console.error('Error loading entry details:', error);
      Alert.alert('Error', 'Failed to load entry details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this health entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteHealthEntry(id);
              Alert.alert('Success', 'Entry deleted successfully');
              router.back();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const getIcon = () => {
    switch (entry?.type) {
      case 'medication':
        return <Pill size={24} color={colors.main.deepBlueGray} />;
      case 'appointment':
        return <Calendar size={24} color={colors.main.deepBlueGray} />;
      default:
        return <Activity size={24} color={colors.main.deepBlueGray} />;
    }
  };

  const formatDate = (dateString: string) => {
    // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
    const date = new Date(dateString.replace(/\//g, '-'));
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text.secondary }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!entry) {
    return (
      <SafeAreaView style={globalStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.text.secondary }}>Entry not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.container}>
      {/* Header */}
      <View style={globalStyles.header}>
        <TouchableOpacity
          style={globalStyles.headerButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={globalStyles.headerTitle}>Entry Details</Text>
        <View style={globalStyles.headerButton}>
          <TouchableOpacity onPress={() => router.push(`/(health)/edit-entry/${id}` as any)}>
            <Edit size={24} color={colors.main.deepBlueGray} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
        {/* Entry Header */}
        <View style={globalStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={[globalStyles.iconContainer, { backgroundColor: colors.main.lightBlueGray }]}>
              {getIcon()}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={globalStyles.cardTitle}>{entry.title}</Text>
              <Text style={globalStyles.cardSubtitle}>{petName}</Text>
            </View>
          </View>

          <View style={globalStyles.divider} />

          {/* Entry Type */}
          <View style={globalStyles.detailRow}>
            <Text style={globalStyles.detailLabel}>Type</Text>
            <Text style={globalStyles.detailValue}>
              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
            </Text>
          </View>

          {/* Date */}
          <View style={globalStyles.detailRow}>
            <Text style={globalStyles.detailLabel}>Date</Text>
            <Text style={globalStyles.detailValue}>{formatDate(entry.date)}</Text>
          </View>

          {/* Time */}
          {entry.time && (
            <View style={globalStyles.detailRow}>
              <Text style={globalStyles.detailLabel}>Time</Text>
              <Text style={globalStyles.detailValue}>{formatTime(entry.time)}</Text>
            </View>
          )}

          {/* Severity */}
          {entry.severity && (
            <View style={globalStyles.detailRow}>
              <Text style={globalStyles.detailLabel}>Severity</Text>
              <Text style={globalStyles.detailValue}>{entry.severity}</Text>
            </View>
          )}

          {/* Description */}
          {entry.description && (
            <>
              <View style={globalStyles.divider} />
              <Text style={globalStyles.detailLabel}>Description</Text>
              <Text style={globalStyles.detailValue}>{entry.description}</Text>
            </>
          )}

          {/* Notes */}
          {entry.notes && (
            <>
              <View style={globalStyles.divider} />
              <Text style={globalStyles.detailLabel}>Notes</Text>
              <Text style={globalStyles.detailValue}>{entry.notes}</Text>
            </>
          )}

          {/* Type-specific fields */}
          {entry.type === 'medication' && 'medicationName' in entry && (
            <>
              <View style={globalStyles.divider} />
              <Text style={globalStyles.detailLabel}>Medication</Text>
              <Text style={globalStyles.detailValue}>{(entry as any).medicationName}</Text>
              {('dosage' in entry) && (
                <View style={globalStyles.detailRow}>
                  <Text style={globalStyles.detailLabel}>Dosage</Text>
                  <Text style={globalStyles.detailValue}>{(entry as any).dosage}</Text>
                </View>
              )}
            </>
          )}

          {entry.type === 'symptom' && 'symptom' in entry && (
            <>
              <View style={globalStyles.divider} />
              <Text style={globalStyles.detailLabel}>Symptom</Text>
              <Text style={globalStyles.detailValue}>{(entry as any).symptom}</Text>
              {('duration' in entry) && (entry as any).duration && (
                <View style={globalStyles.detailRow}>
                  <Text style={globalStyles.detailLabel}>Duration</Text>
                  <Text style={globalStyles.detailValue}>{(entry as any).duration}</Text>
                </View>
              )}
            </>
          )}

          {entry.type === 'appointment' && 'appointmentType' in entry && (
            <>
              <View style={globalStyles.divider} />
              <Text style={globalStyles.detailLabel}>Appointment Type</Text>
              <Text style={globalStyles.detailValue}>{(entry as any).appointmentType}</Text>
              {('clinicName' in entry) && (
                <View style={globalStyles.detailRow}>
                  <Text style={globalStyles.detailLabel}>Clinic</Text>
                  <Text style={globalStyles.detailValue}>{(entry as any).clinicName}</Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Delete Button */}
        <View style={globalStyles.card}>
          <TouchableOpacity
            style={globalStyles.profileSaveButton}
            onPress={handleDelete}
          >
            <Text style={globalStyles.profileSaveButtonText}>
              Delete Entry
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 