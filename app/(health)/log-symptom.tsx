import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Activity, Calendar, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { PetSelector } from '@/components/PetSelector';

export default function LogSymptomScreen() {
  const { pets, addHealthEntry } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');
  const [symptomData, setSymptomData] = useState({
    symptom: '',
    severity: 'Mild',
    duration: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const severityLevels = ['Mild', 'Moderate', 'Severe', 'Emergency'];

  const handleSave = async () => {
    if (!selectedPet || !symptomData.symptom) {
      Alert.alert('Missing Information', 'Please select a pet and describe the symptom.');
      return;
    }

    try {
      await addHealthEntry({
        petId: selectedPet,
        type: 'symptom',
        title: 'Symptom Logged',
        description: symptomData.symptom,
        date: symptomData.date,
        time: symptomData.time,
        severity: symptomData.severity as 'Mild' | 'Moderate' | 'Severe' | 'Emergency' | undefined,
        notes: symptomData.notes
      });

      router.back();
    } catch (error) {
      console.error('Error saving symptom:', error);
    }
  };

  const selectedPetData = pets.find(pet => pet.id === selectedPet);

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Log Symptom</Text>
          <View style={globalStyles.profileHeaderSaveButton}>
            <Edit3 size={24} color={colors.main.deepBlueGray} />
          </View>
        </View>

        {/* Pet Selection */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Select Pet</Text>
          <PetSelector
            pets={pets}
            selectedPet={selectedPet}
            onSelectPet={setSelectedPet}
          />
        </View>

        {/* Symptom Details */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Symptom Details</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Symptom Description *</Text>
            <TextInput
              style={[globalStyles.profileFormInput, { height: 80 }]}
              value={symptomData.symptom}
              onChangeText={(text) => setSymptomData({ ...symptomData, symptom: text })}
              placeholder="Describe the symptom you observed..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Severity Level</Text>
            <View style={globalStyles.petTypeGrid}>
              {severityLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    globalStyles.petTypeOption,
                    symptomData.severity === level && globalStyles.petTypeSelectedOption,
                  ]}
                  onPress={() => setSymptomData({ ...symptomData, severity: level })}
                >
                  <Activity size={20} color={symptomData.severity === level ? colors.background.primary : colors.main.deepBlueGray} />
                  <Text style={[
                    globalStyles.petTypeLabel,
                    symptomData.severity === level && globalStyles.petTypeSelectedLabel,
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Duration</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={symptomData.duration}
              onChangeText={(text) => setSymptomData({ ...symptomData, duration: text })}
              placeholder="e.g., 2 hours, 3 days"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={symptomData.date}
              onChangeText={(text) => setSymptomData({ ...symptomData, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Time</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={symptomData.time}
              onChangeText={(text) => setSymptomData({ ...symptomData, time: text })}
              placeholder="HH:MM"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Additional Notes</Text>
            <TextInput
              style={[globalStyles.profileFormInput, { height: 80 }]}
              value={symptomData.notes}
              onChangeText={(text) => setSymptomData({ ...symptomData, notes: text })}
              placeholder="Any additional observations, context, or concerns..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Emergency Warning */}
        {symptomData.severity === 'Emergency' && (
          <View style={globalStyles.profileSection}>
            <View style={globalStyles.emergencySymptomContainer}>
              <Text style={globalStyles.emergencySymptomTitle}>
                Emergency Symptom
              </Text>
              <Text style={globalStyles.emergencySymptomText}>
                This symptom requires immediate veterinary attention. Please contact your veterinarian or emergency pet clinic right away.
              </Text>
            </View>
          </View>
        )}

        {/* Save Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Log Symptom</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 