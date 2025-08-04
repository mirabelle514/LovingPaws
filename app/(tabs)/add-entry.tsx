import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
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
} from 'lucide-react-native';

import { EntryTypeCard } from '@/components/EntryTypeCard';
import { PetSelector } from '@/components/PetSelector';
import { ActionButton } from '@/components/ActionButton';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';

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
      gradient: [colors.main.deepBlueGray, colors.main.dustyBlue] as readonly string[],
    },
    {
      id: 'medication',
      title: 'Medication',
      subtitle: 'Record treatments',
      icon: <Pill size={24} color={colors.background.primary} />,
      gradient: [colors.main.dustyBlue, colors.main.gentleLavenderGray] as readonly string[],
    },
    {
      id: 'appointment',
      title: 'Appointment',
      subtitle: 'Vet visits & checkups',
      icon: <Calendar size={24} color={colors.background.primary} />,
      gradient: [colors.main.softPeriwinkle, colors.main.dustyBlue] as readonly string[],
    },
    {
      id: 'behavior',
      title: 'Behavior',
      subtitle: 'Mood & activity',
      icon: <Heart size={24} color={colors.background.primary} />,
      gradient: [colors.main.gentleLavenderGray, colors.main.softPeriwinkle] as readonly string[],
    },
    {
      id: 'vitals',
      title: 'Vitals',
      subtitle: 'Temperature, weight',
      icon: <Thermometer size={24} color={colors.background.primary} />,
      gradient: [colors.main.deepBlueGray, colors.main.softPeriwinkle] as readonly string[],
    },
    {
      id: 'feeding',
      title: 'Feeding',
      subtitle: 'Food & water intake',
      icon: <Utensils size={24} color={colors.background.primary} />,
      gradient: [colors.main.dustyBlue, colors.main.deepBlueGray] as readonly string[],
    },
    {
      id: 'hydration',
      title: 'Hydration',
      subtitle: 'Water consumption',
      icon: <Droplets size={24} color={colors.background.primary} />,
      gradient: [colors.main.softPeriwinkle, colors.main.gentleLavenderGray] as readonly string[],
    },
    {
      id: 'examination',
      title: 'Examination',
      subtitle: 'Physical checkup',
      icon: <Stethoscope size={24} color={colors.background.primary} />,
      gradient: [colors.main.gentleLavenderGray, colors.main.deepBlueGray] as readonly string[],
        },
  ];

  return (
    <SafeAreaView style={globalStyles.addEntryContainer}>
      <ScrollView style={globalStyles.addEntryScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.addEntryHeader}>
          <Text style={globalStyles.addEntryTitle}>Add Health Entry</Text>
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
    </SafeAreaView>
  );
}