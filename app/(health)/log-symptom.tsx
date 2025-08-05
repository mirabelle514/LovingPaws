import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Activity, Clock, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { PetSelector } from '@/components/PetSelector';

export default function LogSymptomScreen() {
  const { pets, addHealthEntry } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');

  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);
  const [symptomData, setSymptomData] = useState({
    symptom: '',
    severity: 'Mild',
    duration: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timePeriod: 'AM',
  });

  const severityLevels = ['Mild', 'Moderate', 'Severe', 'Emergency'];



  const handleSave = async () => {
    if (!selectedPet || !symptomData.symptom || !symptomData.date) {
      Alert.alert('Missing Information', 'Please select a pet, describe the symptom, and enter the date.');
      return;
    }

    try {
      await addHealthEntry({
        petId: selectedPet,
        type: 'symptom',
        title: 'Symptom Logged',
        description: symptomData.symptom,
        date: symptomData.date,
        time: symptomData.time ? `${symptomData.time} ${symptomData.timePeriod}` : undefined,
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
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={globalStyles.profileScrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Log Symptom</Text>
          <TouchableOpacity onPress={handleSave} style={globalStyles.profileHeaderSaveButton}>
            <Text style={globalStyles.profileSaveButtonText}>Save</Text>
          </TouchableOpacity>
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
              returnKeyType="default"
              blurOnSubmit={true}
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
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={symptomData.date}
              onChangeText={(text) => {
                // Remove all non-numeric characters
                const numbersOnly = text.replace(/[^0-9]/g, '');
                
                // Format as YYYY/MM/DD
                let formatted = '';
                if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 4);
                if (numbersOnly.length >= 5) formatted += '/' + numbersOnly.slice(4, 6);
                if (numbersOnly.length >= 7) formatted += '/' + numbersOnly.slice(6, 8);
                
                setSymptomData({ ...symptomData, date: formatted });
              }}
              placeholder="YYYY/MM/DD"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Time</Text>
            <View style={globalStyles.formRow}>
              <TextInput
                style={[globalStyles.profileFormInput, globalStyles.formInputFlex]}
                value={symptomData.time}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const numbersOnly = text.replace(/[^0-9]/g, '');
                  
                  // Format as HH:MM
                  let formatted = '';
                  if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 2);
                  if (numbersOnly.length >= 3) formatted += ':' + numbersOnly.slice(2, 4);
                  
                  setSymptomData({ ...symptomData, time: formatted });
                }}
                placeholder="HH:MM"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity
                style={[globalStyles.profileFormInput, globalStyles.formDropdownFlex]}
                onPress={() => setShowTimePeriodDropdown(!showTimePeriodDropdown)}
              >
                <Text style={[globalStyles.dropdownText, !symptomData.timePeriod && globalStyles.dropdownTextPlaceholder]}>
                  {symptomData.timePeriod || 'AM/PM'}
                </Text>
                <ChevronDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            {showTimePeriodDropdown && (
              <View style={[globalStyles.dropdownContainer, { right: 0, width: '40%' }]}>
                {['AM', 'PM'].map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={globalStyles.dropdownOption}
                    onPress={() => {
                      setSymptomData({ ...symptomData, timePeriod: period });
                      setShowTimePeriodDropdown(false);
                    }}
                  >
                    <Text style={[
                      globalStyles.dropdownOptionText,
                      symptomData.timePeriod === period ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                    ]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
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
              returnKeyType="default"
              blurOnSubmit={true}
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
            <Text style={globalStyles.profileSaveButtonText}>Save Symptom</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 