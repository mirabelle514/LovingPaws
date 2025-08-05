import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Clock, MapPin, Phone, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { PetSelector } from '@/components/PetSelector';

export default function ScheduleVisitScreen() {
  const { pets, addHealthEntry } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');

  const [showTimePeriodDropdown, setShowTimePeriodDropdown] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    appointmentType: 'Checkup',
    date: '',
    time: '',
    timePeriod: 'AM',
    clinicName: '',
    veterinarian: '',
    reason: '',
    notes: '',
    reminder: true,
  });

  const appointmentTypes = [
    'Checkup', 'Vaccination', 'Surgery', 'Emergency', 'Follow-up', 'Dental', 'Other'
  ];



  const handleSave = () => {
    if (!selectedPet || !appointmentData.date || !appointmentData.time || !appointmentData.clinicName) {
      Alert.alert('Missing Information', 'Please select a pet and fill in date, time, and clinic name.');
      return;
    }

    // Add health entry to increase health score
    addHealthEntry({
      petId: selectedPet,
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: `${appointmentData.appointmentType} - ${appointmentData.clinicName}`,
      date: appointmentData.date,
      time: `${appointmentData.time} ${appointmentData.timePeriod}`,
      notes: appointmentData.notes
    });

    // Here you would typically save to a database or API
    console.log('Saving appointment data:', { petId: selectedPet, ...appointmentData });
    Alert.alert('Success', 'Appointment scheduled successfully! Health score updated.');
    router.back();
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
          <Text style={globalStyles.profileHeaderTitle}>Schedule Visit</Text>
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

        {/* Appointment Details */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Appointment Details</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Appointment Type</Text>
            <View style={globalStyles.petTypeGrid}>
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    globalStyles.petTypeOption,
                    appointmentData.appointmentType === type && globalStyles.petTypeSelectedOption,
                  ]}
                  onPress={() => setAppointmentData({ ...appointmentData, appointmentType: type })}
                >
                  <Clock size={20} color={appointmentData.appointmentType === type ? colors.background.primary : colors.main.deepBlueGray} />
                  <Text style={[
                    globalStyles.petTypeLabel,
                    appointmentData.appointmentType === type && globalStyles.petTypeSelectedLabel,
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={appointmentData.date}
              onChangeText={(text) => {
                // Remove all non-numeric characters
                const numbersOnly = text.replace(/[^0-9]/g, '');
                
                // Format as YYYY/MM/DD
                let formatted = '';
                if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 4);
                if (numbersOnly.length >= 5) formatted += '/' + numbersOnly.slice(4, 6);
                if (numbersOnly.length >= 7) formatted += '/' + numbersOnly.slice(6, 8);
                
                setAppointmentData({ ...appointmentData, date: formatted });
              }}
              placeholder="YYYY/MM/DD"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Time *</Text>
            <View style={globalStyles.formRow}>
              <TextInput
                style={[globalStyles.profileFormInput, globalStyles.formInputFlex]}
                value={appointmentData.time}
                onChangeText={(text) => {
                  // Remove all non-numeric characters
                  const numbersOnly = text.replace(/[^0-9]/g, '');
                  
                  // Format as HH:MM
                  let formatted = '';
                  if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 2);
                  if (numbersOnly.length >= 3) formatted += ':' + numbersOnly.slice(2, 4);
                  
                  setAppointmentData({ ...appointmentData, time: formatted });
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
                <Text style={[globalStyles.dropdownText, !appointmentData.timePeriod && globalStyles.dropdownTextPlaceholder]}>
                  {appointmentData.timePeriod || 'AM/PM'}
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
                      setAppointmentData({ ...appointmentData, timePeriod: period });
                      setShowTimePeriodDropdown(false);
                    }}
                  >
                    <Text style={[
                      globalStyles.dropdownOptionText,
                      appointmentData.timePeriod === period ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                    ]}>
                      {period}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Clinic Name *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={appointmentData.clinicName}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, clinicName: text })}
              placeholder="Veterinary clinic name"
              placeholderTextColor={colors.text.tertiary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Veterinarian</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={appointmentData.veterinarian}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, veterinarian: text })}
              placeholder="Veterinarian name"
              placeholderTextColor={colors.text.tertiary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Reason for Visit</Text>
            <TextInput
              style={[globalStyles.profileFormInput, { height: 80 }]}
              value={appointmentData.reason}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, reason: text })}
              placeholder="Describe the reason for the visit..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={true}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Additional Notes</Text>
            <TextInput
              style={[globalStyles.profileFormInput, { height: 80 }]}
              value={appointmentData.notes}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, notes: text })}
              placeholder="Any special instructions, questions to ask, or additional notes..."
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={true}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={globalStyles.profileSettingsItem}>
            <MapPin size={20} color={colors.main.deepBlueGray} />
            <Text style={globalStyles.profileSettingsItemText}>Find Nearby Clinics</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.profileSettingsItem}>
            <Phone size={20} color={colors.main.deepBlueGray} />
            <Text style={globalStyles.profileSettingsItemText}>Call Clinic</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Save Appointment</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 