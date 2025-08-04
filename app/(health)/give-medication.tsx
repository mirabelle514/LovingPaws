import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Pill, Calendar, Clock, Scale } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { PetSelector } from '@/components/PetSelector';

export default function GiveMedicationScreen() {
  const { pets, addHealthEntry } = usePets();
  const [selectedPet, setSelectedPet] = useState(pets.length > 0 ? pets[0].id : '');
  const [medicationData, setMedicationData] = useState({
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    route: 'Oral',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    notes: '',
    prescribedBy: '',
  });

  const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'As needed', 'Other'];
  const routeOptions = ['Oral', 'Topical', 'Injection', 'Eye drops', 'Ear drops', 'Other'];

  const handleSave = async () => {
    if (!selectedPet || !medicationData.medicationName || !medicationData.dosage) {
      Alert.alert('Missing Information', 'Please select a pet and fill in medication name and dosage.');
      return;
    }

    try {
      await addHealthEntry({
        petId: selectedPet,
        type: 'medication',
        title: 'Medication Given',
        description: `${medicationData.medicationName} - ${medicationData.dosage}`,
        date: medicationData.date,
        time: medicationData.time,
        notes: medicationData.notes
      });

      router.back();
    } catch (error) {
      console.error('Error saving medication:', error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Give Medication</Text>
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
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date Given</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={medicationData.date}
              onChangeText={(text) => setMedicationData({ ...medicationData, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Time Given</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={medicationData.time}
              onChangeText={(text) => setMedicationData({ ...medicationData, time: text })}
              placeholder="HH:MM"
              placeholderTextColor={colors.text.tertiary}
            />
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
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Log Medication</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 