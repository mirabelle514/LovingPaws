import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Pill, Clock, Scale, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { PetSelector } from '@/components/PetSelector';

export default function GiveMedicationScreen() {
  const { pets, addHealthEntry } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');

  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);
  const [medicationData, setMedicationData] = useState({
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    route: 'Oral',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timePeriod: 'AM',
    notes: '',
    prescribedBy: '',
  });

  const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Other'];
  const routeOptions = ['Oral', 'Topical', 'Injection', 'Eye drops', 'Ear drops', 'Other'];



  const handleSave = async () => {
    if (!selectedPet || !medicationData.medicationName || !medicationData.dosage || !medicationData.date || !medicationData.time) {
      Alert.alert('Missing Information', 'Please select a pet and fill in medication name, dosage, date, and time.');
      return;
    }

    try {
      await addHealthEntry({
        petId: selectedPet,
        type: 'medication',
        title: 'Medication Given',
        description: `${medicationData.medicationName} - ${medicationData.dosage}`,
        date: medicationData.date,
        time: `${medicationData.time} ${medicationData.timePeriod}`,
        notes: medicationData.notes
      });

      router.back();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

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
          <Text style={globalStyles.profileHeaderTitle}>Give Medication</Text>
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

        {/* Medication Details */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Medication Details</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Medication Name *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={medicationData.medicationName}
              onChangeText={(text) => setMedicationData({ ...medicationData, medicationName: text })}
              placeholder="e.g., Amoxicillin, Flea treatment"
              placeholderTextColor={colors.text.secondary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Dosage *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={medicationData.dosage}
              onChangeText={(text) => setMedicationData({ ...medicationData, dosage: text })}
              placeholder="e.g., 1 tablet, 5ml, 1 drop"
              placeholderTextColor={colors.text.secondary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Frequency</Text>
            <View style={globalStyles.petTypeGrid}>
              {frequencyOptions.map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    globalStyles.petTypeOption,
                    medicationData.frequency === freq && globalStyles.petTypeSelectedOption,
                  ]}
                  onPress={() => setMedicationData({ ...medicationData, frequency: freq })}
                >
                  <Clock size={20} color={medicationData.frequency === freq ? colors.background.primary : colors.main.deepBlueGray} />
                  <Text style={[
                    globalStyles.petTypeLabel,
                    medicationData.frequency === freq && globalStyles.petTypeSelectedLabel,
                  ]}>
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Route of Administration</Text>
            <View style={globalStyles.petTypeGrid}>
              {routeOptions.map((route) => (
                <TouchableOpacity
                  key={route}
                  style={[
                    globalStyles.petTypeOption,
                    medicationData.route === route && globalStyles.petTypeSelectedOption,
                  ]}
                  onPress={() => setMedicationData({ ...medicationData, route: route })}
                >
                  <Pill size={20} color={medicationData.route === route ? colors.background.primary : colors.main.deepBlueGray} />
                  <Text style={[
                    globalStyles.petTypeLabel,
                    medicationData.route === route && globalStyles.petTypeSelectedLabel,
                  ]}>
                    {route}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Prescribed By</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={medicationData.prescribedBy}
              onChangeText={(text) => setMedicationData({ ...medicationData, prescribedBy: text })}
              placeholder="Veterinarian name"
              placeholderTextColor={colors.text.secondary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date Given *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={medicationData.date}
              onChangeText={(text) => {
                // Remove all non-numeric characters
                const numbersOnly = text.replace(/[^0-9]/g, '');
                
                // Format as YYYY/MM/DD
                let formatted = '';
                if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 4);
                if (numbersOnly.length >= 5) formatted += '/' + numbersOnly.slice(4, 6);
                if (numbersOnly.length >= 7) formatted += '/' + numbersOnly.slice(6, 8);
                
                setMedicationData({ ...medicationData, date: formatted });
              }}
              placeholder="YYYY/MM/DD"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Time Given *</Text>
            <View style={globalStyles.formRow}>
              <TextInput
                style={[globalStyles.profileFormInput, globalStyles.formInputFlex]}
                value={medicationData.time}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const numbersOnly = text.replace(/[^0-9]/g, '');
                  
                  // Format as HH:MM
                  let formatted = '';
                  if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 2);
                  if (numbersOnly.length >= 3) formatted += ':' + numbersOnly.slice(2, 4);
                  
                  setMedicationData({ ...medicationData, time: formatted });
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
                <Text style={[globalStyles.dropdownText, !medicationData.timePeriod && globalStyles.dropdownTextPlaceholder]}>
                  {medicationData.timePeriod || 'AM/PM'}
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
                      setMedicationData({ ...medicationData, timePeriod: period });
                      setShowTimePeriodDropdown(false);
                    }}
                  >
                    <Text style={[
                      globalStyles.dropdownOptionText,
                      medicationData.timePeriod === period ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                    ]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Notes</Text>
            <TextInput
              style={[globalStyles.profileFormInput, { height: 80 }]}
              value={medicationData.notes}
              onChangeText={(text) => setMedicationData({ ...medicationData, notes: text })}
              placeholder="Any special instructions, side effects observed, or additional notes..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={true}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Save Medication</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 