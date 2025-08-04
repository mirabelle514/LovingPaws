import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Calendar, Clock, MapPin, Phone } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { PetSelector } from '@/components/PetSelector';

export default function ScheduleVisitScreen() {
  const { pets, addHealthEntry } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');
  const [appointmentData, setAppointmentData] = useState({
    appointmentType: 'Checkup',
    date: '',
    time: '',
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
    if (!selectedPet || !appointmentData.date || !appointmentData.clinicName) {
      Alert.alert('Missing Information', 'Please select a pet and fill in date and clinic name.');
      return;
    }

    // Add health entry to increase health score
    addHealthEntry(selectedPet);

    // Here you would typically save to a database or API
    console.log('Saving appointment data:', { petId: selectedPet, ...appointmentData });
    Alert.alert('Success', 'Appointment scheduled successfully! Health score updated.');
    router.back();
  };

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Schedule Visit</Text>
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
                  <Calendar size={20} color={appointmentData.appointmentType === type ? colors.background.primary : colors.main.deepBlueGray} />
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
              onChangeText={(text) => setAppointmentData({ ...appointmentData, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Time</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={appointmentData.time}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, time: text })}
              placeholder="HH:MM"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Clinic Name *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={appointmentData.clinicName}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, clinicName: text })}
              placeholder="Veterinary clinic name"
              placeholderTextColor={colors.text.tertiary}
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
            <Text style={globalStyles.profileSaveButtonText}>Schedule Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 