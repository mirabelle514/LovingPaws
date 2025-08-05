import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, ChevronDown, Activity, Pill, Calendar } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { databaseService } from '@/database/DatabaseService';
import { HealthEntry } from '@/database/types';
import { PetSelector } from '@/components/PetSelector';
import { usePets } from '@/contexts/PetContext';

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, updateHealthEntry } = usePets();
  const [entry, setEntry] = useState<HealthEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<string>('');
  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);

  // Form data for different entry types
  const [formData, setFormData] = useState({
    // Common fields
    title: '',
    description: '',
    date: '',
    time: '',
    timePeriod: 'AM',
    notes: '',
    severity: 'Mild' as 'Mild' | 'Moderate' | 'Severe' | 'Emergency',
    
    // Symptom-specific fields
    symptom: '',
    duration: '',
    
    // Medication-specific fields
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    route: 'Oral',
    prescribedBy: '',
    
    // Appointment-specific fields
    appointmentType: 'Checkup',
    clinicName: '',
    veterinarian: '',
    reason: '',
    reminder: true,
  });

  const severityLevels = ['Mild', 'Moderate', 'Severe', 'Emergency'];
  const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Weekly', 'Monthly'];
  const routeOptions = ['Oral', 'Topical', 'Injection', 'Inhalation', 'Other'];
  const appointmentTypes = ['Checkup', 'Vaccination', 'Surgery', 'Emergency', 'Follow-up', 'Other'];

  useEffect(() => {
    if (id) {
      loadEntryDetails();
    }
  }, [id]);

  const loadEntryDetails = async () => {
    try {
      setLoading(true);
      
      const healthEntry = await databaseService.getHealthEntryById(id);
      if (!healthEntry) {
        Alert.alert('Error', 'Health entry not found');
        router.back();
        return;
      }

      setEntry(healthEntry);
      setSelectedPet(healthEntry.petId);

      // Parse time and time period
      let time = '';
      let timePeriod = 'AM';
      if (healthEntry.time) {
        const timeParts = healthEntry.time.split(' ');
        time = timeParts[0] || '';
        timePeriod = timeParts[1] || 'AM';
      }

      // Set form data based on entry type
      setFormData({
        title: healthEntry.title || '',
        description: healthEntry.description || '',
        date: healthEntry.date || '',
        time: time,
        timePeriod: timePeriod,
        notes: healthEntry.notes || '',
        severity: healthEntry.severity || 'Mild',
        
        // Symptom fields
        symptom: (healthEntry as any).symptom || '',
        duration: (healthEntry as any).duration || '',
        
        // Medication fields
        medicationName: (healthEntry as any).medicationName || '',
        dosage: (healthEntry as any).dosage || '',
        frequency: (healthEntry as any).frequency || 'Once daily',
        route: (healthEntry as any).route || 'Oral',
        prescribedBy: (healthEntry as any).prescribedBy || '',
        
        // Appointment fields
        appointmentType: (healthEntry as any).appointmentType || 'Checkup',
        clinicName: (healthEntry as any).clinicName || '',
        veterinarian: (healthEntry as any).veterinarian || '',
        reason: (healthEntry as any).reason || '',
        reminder: (healthEntry as any).reminder !== false,
      });

    } catch (error) {
      console.error('Error loading entry details:', error);
      Alert.alert('Error', 'Failed to load entry details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedPet || !formData.date) {
      Alert.alert('Missing Information', 'Please select a pet and enter the date.');
      return;
    }

    try {
      const updatedEntry: HealthEntry = {
        ...entry!,
        petId: selectedPet,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time ? `${formData.time} ${formData.timePeriod}` : undefined,
        notes: formData.notes,
        severity: formData.severity,
      };

      // Add type-specific fields
      if (entry?.type === 'symptom') {
        (updatedEntry as any).symptom = formData.symptom;
        (updatedEntry as any).duration = formData.duration;
      } else if (entry?.type === 'medication') {
        (updatedEntry as any).medicationName = formData.medicationName;
        (updatedEntry as any).dosage = formData.dosage;
        (updatedEntry as any).frequency = formData.frequency;
        (updatedEntry as any).route = formData.route;
        (updatedEntry as any).prescribedBy = formData.prescribedBy;
      } else if (entry?.type === 'appointment') {
        (updatedEntry as any).appointmentType = formData.appointmentType;
        (updatedEntry as any).clinicName = formData.clinicName;
        (updatedEntry as any).veterinarian = formData.veterinarian;
        (updatedEntry as any).reason = formData.reason;
        (updatedEntry as any).reminder = formData.reminder;
      }

      await databaseService.updateHealthEntry(updatedEntry);
      Alert.alert('Success', 'Entry updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error updating entry:', error);
      Alert.alert('Error', 'Failed to update entry');
    }
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
            <Text style={globalStyles.profileHeaderTitle}>Edit {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}</Text>
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

          {/* Entry Details */}
          <View style={globalStyles.profileSection}>
            <Text style={globalStyles.profileSectionTitle}>Entry Details</Text>
            
            {/* Title */}
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Title</Text>
              <TextInput
                style={globalStyles.profileFormInput}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Entry title"
                placeholderTextColor={colors.text.secondary}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* Date */}
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Date *</Text>
              <TextInput
                style={globalStyles.profileFormInput}
                value={formData.date}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const numbersOnly = text.replace(/[^0-9]/g, '');
                  
                  // Format as YYYY/MM/DD
                  let formatted = '';
                  if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 4);
                  if (numbersOnly.length >= 5) formatted += '/' + numbersOnly.slice(4, 6);
                  if (numbersOnly.length >= 7) formatted += '/' + numbersOnly.slice(6, 8);
                  
                  setFormData({ ...formData, date: formatted });
                }}
                placeholder="YYYY/MM/DD"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* Time */}
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Time</Text>
              <View style={globalStyles.formRow}>
                <TextInput
                  style={[globalStyles.profileFormInput, globalStyles.formInputFlex]}
                  value={formData.time}
                  onChangeText={(text) => {
                    // Remove all non-numeric characters
                    const numbersOnly = text.replace(/[^0-9]/g, '');
                    
                    // Format as HH:MM
                    let formatted = '';
                    if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 2);
                    if (numbersOnly.length >= 3) formatted += ':' + numbersOnly.slice(2, 4);
                    
                    setFormData({ ...formData, time: formatted });
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
                  <Text style={[globalStyles.dropdownText, !formData.timePeriod && globalStyles.dropdownTextPlaceholder]}>
                    {formData.timePeriod || 'AM/PM'}
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
                        setFormData({ ...formData, timePeriod: period });
                        setShowTimePeriodDropdown(false);
                      }}
                    >
                      <Text style={[
                        globalStyles.dropdownOptionText,
                        formData.timePeriod === period ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                      ]}>
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Severity (for symptoms) */}
            {entry.type === 'symptom' && (
              <View style={globalStyles.profileFormField}>
                <Text style={globalStyles.profileFormLabel}>Severity Level</Text>
                <View style={globalStyles.petTypeGrid}>
                  {severityLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        globalStyles.petTypeOption,
                        formData.severity === level && globalStyles.petTypeSelectedOption,
                      ]}
                      onPress={() => setFormData({ ...formData, severity: level })}
                    >
                      <Activity size={20} color={formData.severity === level ? colors.background.primary : colors.main.deepBlueGray} />
                      <Text style={[
                        globalStyles.petTypeLabel,
                        formData.severity === level && globalStyles.petTypeSelectedLabel,
                      ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Type-specific fields */}
            {entry.type === 'symptom' && (
              <>
                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Symptom Description</Text>
                  <TextInput
                    style={[globalStyles.profileFormInput, { height: 80 }]}
                    value={formData.symptom}
                    onChangeText={(text) => setFormData({ ...formData, symptom: text })}
                    placeholder="Describe the symptom..."
                    placeholderTextColor={colors.text.secondary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="default"
                    blurOnSubmit={true}
                  />
                </View>

                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Duration</Text>
                  <TextInput
                    style={globalStyles.profileFormInput}
                    value={formData.duration}
                    onChangeText={(text) => setFormData({ ...formData, duration: text })}
                    placeholder="e.g., 2 hours, 3 days"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
              </>
            )}

            {entry.type === 'medication' && (
              <>
                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Medication Name</Text>
                  <TextInput
                    style={globalStyles.profileFormInput}
                    value={formData.medicationName}
                    onChangeText={(text) => setFormData({ ...formData, medicationName: text })}
                    placeholder="e.g., Amoxicillin"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Dosage</Text>
                  <TextInput
                    style={globalStyles.profileFormInput}
                    value={formData.dosage}
                    onChangeText={(text) => setFormData({ ...formData, dosage: text })}
                    placeholder="e.g., 1 tablet, 5ml"
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
                          formData.frequency === freq && globalStyles.petTypeSelectedOption,
                        ]}
                        onPress={() => setFormData({ ...formData, frequency: freq })}
                      >
                        <Pill size={20} color={formData.frequency === freq ? colors.background.primary : colors.main.deepBlueGray} />
                        <Text style={[
                          globalStyles.petTypeLabel,
                          formData.frequency === freq && globalStyles.petTypeSelectedLabel,
                        ]}>
                          {freq}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Route</Text>
                  <View style={globalStyles.petTypeGrid}>
                    {routeOptions.map((route) => (
                      <TouchableOpacity
                        key={route}
                        style={[
                          globalStyles.petTypeOption,
                          formData.route === route && globalStyles.petTypeSelectedOption,
                        ]}
                        onPress={() => setFormData({ ...formData, route: route })}
                      >
                        <Pill size={20} color={formData.route === route ? colors.background.primary : colors.main.deepBlueGray} />
                        <Text style={[
                          globalStyles.petTypeLabel,
                          formData.route === route && globalStyles.petTypeSelectedLabel,
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
                    value={formData.prescribedBy}
                    onChangeText={(text) => setFormData({ ...formData, prescribedBy: text })}
                    placeholder="Veterinarian name"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
              </>
            )}

            {entry.type === 'appointment' && (
              <>
                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Appointment Type</Text>
                  <View style={globalStyles.petTypeGrid}>
                    {appointmentTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          globalStyles.petTypeOption,
                          formData.appointmentType === type && globalStyles.petTypeSelectedOption,
                        ]}
                        onPress={() => setFormData({ ...formData, appointmentType: type })}
                      >
                        <Calendar size={20} color={formData.appointmentType === type ? colors.background.primary : colors.main.deepBlueGray} />
                        <Text style={[
                          globalStyles.petTypeLabel,
                          formData.appointmentType === type && globalStyles.petTypeSelectedLabel,
                        ]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Clinic Name</Text>
                  <TextInput
                    style={globalStyles.profileFormInput}
                    value={formData.clinicName}
                    onChangeText={(text) => setFormData({ ...formData, clinicName: text })}
                    placeholder="Veterinary clinic name"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Veterinarian</Text>
                  <TextInput
                    style={globalStyles.profileFormInput}
                    value={formData.veterinarian}
                    onChangeText={(text) => setFormData({ ...formData, veterinarian: text })}
                    placeholder="Veterinarian name"
                    placeholderTextColor={colors.text.secondary}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>

                <View style={globalStyles.profileFormField}>
                  <Text style={globalStyles.profileFormLabel}>Reason for Visit</Text>
                  <TextInput
                    style={[globalStyles.profileFormInput, { height: 80 }]}
                    value={formData.reason}
                    onChangeText={(text) => setFormData({ ...formData, reason: text })}
                    placeholder="Describe the reason for the visit..."
                    placeholderTextColor={colors.text.secondary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="default"
                    blurOnSubmit={true}
                  />
                </View>
              </>
            )}

            {/* Notes */}
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Notes</Text>
              <TextInput
                style={[globalStyles.profileFormInput, { height: 80 }]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Additional notes..."
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                returnKeyType="default"
                blurOnSubmit={true}
              />
            </View>

            {/* Save Button */}
            <View style={globalStyles.profileSection}>
              <TouchableOpacity
                style={globalStyles.profileSaveButton}
                onPress={handleSave}
              >
                <Text style={globalStyles.profileSaveButtonText}>
                  {entry?.type === 'appointment' ? 'Save Appointment' : 
                   entry?.type === 'symptom' ? 'Save Symptom' :
                   entry?.type === 'medication' ? 'Save Medication' : 
                   'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 