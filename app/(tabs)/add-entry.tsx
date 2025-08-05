import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Activity,
  Pill,
  Calendar,
  Heart,
  Thermometer,
  Utensils,
  Droplets,
  Stethoscope,
  ArrowLeft,
} from 'lucide-react-native';

import { EntryTypeCard } from '@/components/EntryTypeCard';
import { PetSelector } from '@/components/PetSelector';
import { ActionButton } from '@/components/ActionButton';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { router } from 'expo-router';

export default function AddEntryScreen() {
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');
  const [selectedType, setSelectedType] = useState('');
  const [notes, setNotes] = useState('');

  const entryTypes = [
    {
      id: 'symptom',
      title: 'Symptom',
      subtitle: 'Track health changes',
      icon: <Activity size={24} color={colors.background.primary} />,
    },
    {
      id: 'medication',
      title: 'Medication',
      subtitle: 'Record treatments',
      icon: <Pill size={24} color={colors.background.primary} />,
    },
    {
      id: 'appointment',
      title: 'Appointment',
      subtitle: 'Vet visits & checkups',
      icon: <Calendar size={24} color={colors.background.primary} />,
    },
    {
      id: 'behavior',
      title: 'Behavior',
      subtitle: 'Mood & activity',
      icon: <Heart size={24} color={colors.background.primary} />,
    },
    {
      id: 'vitals',
      title: 'Vitals',
      subtitle: 'Temperature, weight',
      icon: <Thermometer size={24} color={colors.background.primary} />,
    },
    {
      id: 'feeding',
      title: 'Feeding',
      subtitle: 'Food & water intake',
      icon: <Utensils size={24} color={colors.background.primary} />,
    },
    {
      id: 'hydration',
      title: 'Hydration',
      subtitle: 'Water consumption',
      icon: <Droplets size={24} color={colors.background.primary} />,
    },
    {
      id: 'examination',
      title: 'Examination',
      subtitle: 'Physical checkup',
      icon: <Stethoscope size={24} color={colors.background.primary} />,
    },
  ];

  return (
    <SafeAreaView style={globalStyles.addEntryContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={globalStyles.addEntryScrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Header */}
        <View style={globalStyles.addEntryHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              style={globalStyles.headerButton}
              onPress={() => router.push('/(tabs)/' as any)}
            >
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={globalStyles.addEntryTitle}>Add Health Entry</Text>
          </View>
          <Text style={globalStyles.addEntrySubtitle}>
            Track your pet's health and wellbeing
          </Text>
        </View>

        {/* Pet Selection */}
        <View style={globalStyles.addEntrySection}>
          <Text style={globalStyles.addEntrySectionTitle}>Select Pet</Text>
          <PetSelector
            pets={pets}
            selectedPet={selectedPet}
            onSelectPet={setSelectedPet}
          />
        </View>

        {/* Entry Type Selection */}
        <View style={globalStyles.addEntrySection}>
          <Text style={globalStyles.addEntrySectionTitle}>Entry Type</Text>
          <View style={globalStyles.addEntryTypes}>
            {entryTypes.map((type) => (
              <EntryTypeCard
                key={type.id}
                type={type}
                isSelected={selectedType === type.id}
                onSelect={() => setSelectedType(type.id)}
              />
            ))}
          </View>
        </View>

        {/* Notes Section */}
        {selectedType && (
          <View style={globalStyles.addEntrySection}>
            <Text style={globalStyles.addEntrySectionTitle}>Notes & Details</Text>
            <View style={globalStyles.addEntryNotesContainer}>
              <TextInput
                style={globalStyles.addEntryNotesInput}
                placeholder="Describe what you observed..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                textAlignVertical="top"
                returnKeyType="default"
                blurOnSubmit={true}
              />
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {selectedType && (
          <View style={globalStyles.addEntryActions}>
            <ActionButton
              title="Save Entry"
              onPress={() => {
                // Handle save entry
                console.log('Saving entry:', { selectedPet, selectedType, notes });
              }}
              variant="primary"
            />
            <ActionButton
              title="Save & Add Another"
              onPress={() => {
                // Handle save and add another
                console.log('Save and add another');
              }}
              variant="secondary"
            />
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}