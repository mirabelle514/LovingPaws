import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Phone, Clock, Star, Navigation, Calendar, TriangleAlert as AlertTriangle, ArrowLeft } from 'lucide-react-native';

import { VetClinicCard } from '@/components/VetClinicCard';
import { EmergencyContact } from '@/components/EmergencyContact';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { router } from 'expo-router';

export default function VeterinaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const veterinarians = [
    {
      id: '1',
      name: 'Pet Care Central',
      address: '123 Main St, Downtown',
      distance: '0.8 miles',
      rating: 4.8,
      phone: '(555) 123-4567',
      isOpen: true,
      specialties: ['General Care', 'Surgery', 'Dental'],
      hours: 'Open until 8:00 PM',
    },
    {
      id: '2',
      name: 'Animal Health Clinic',
      address: '456 Oak Ave, Midtown',
      distance: '1.2 miles',
      rating: 4.6,
      phone: '(555) 987-6543',
      isOpen: true,
      specialties: ['Emergency', 'Cardiology', 'Oncology'],
      hours: 'Open 24/7',
    },
    {
      id: '3',
      name: 'Happy Paws Veterinary',
      address: '789 Pine Rd, Uptown',
      distance: '2.1 miles',
      rating: 4.9,
      phone: '(555) 456-7890',
      isOpen: false,
      specialties: ['Exotic Pets', 'Dermatology'],
      hours: 'Opens at 9:00 AM',
    },
  ];

  return (
    <SafeAreaView style={globalStyles.veterinaryContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={globalStyles.veterinaryScrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Header */}
        <View style={globalStyles.veterinaryHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              style={globalStyles.headerButton}
              onPress={() => router.push('/(tabs)/' as any)}
            >
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={globalStyles.veterinaryTitle}>Veterinary Care</Text>
          </View>
          <Text style={globalStyles.veterinarySubtitle}>
            Find trusted veterinarians near you
          </Text>
        </View>

        {/* Emergency Banner */}
        <View style={globalStyles.veterinarySection}>
          <EmergencyContact />
        </View>

        {/* Search */}
        <View style={globalStyles.veterinarySection}>
          <View style={globalStyles.veterinarySearchContainer}>
            <Search size={20} color={colors.text.tertiary} />
            <TextInput
              style={globalStyles.veterinarySearchInput}
              placeholder="Search veterinarians..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={globalStyles.veterinarySection}>
          <Text style={globalStyles.veterinarySectionTitle}>Quick Actions</Text>
          <View style={globalStyles.veterinaryQuickActions}>
            <TouchableOpacity style={globalStyles.veterinaryActionButton}>
              <Calendar size={20} color={colors.main.deepBlueGray} />
              <Text style={globalStyles.veterinaryActionText}>Book Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.veterinaryActionButton}>
              <Navigation size={20} color={colors.main.deepBlueGray} />
              <Text style={globalStyles.veterinaryActionText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Nearby Veterinarians */}
        <View style={globalStyles.veterinarySection}>
          <Text style={globalStyles.veterinarySectionTitle}>Nearby Veterinarians</Text>
          <View style={globalStyles.veterinaryVetList}>
            {veterinarians.map((vet) => (
              <VetClinicCard key={vet.id} clinic={vet} />
            ))}
          </View>
        </View>

        {/* Appointment History */}
        <View style={globalStyles.veterinarySection}>
          <Text style={globalStyles.veterinarySectionTitle}>Recent Appointments</Text>
          <View style={globalStyles.veterinaryAppointmentsList}>
            <View style={globalStyles.veterinaryAppointmentItem}>
              <View style={globalStyles.veterinaryAppointmentDate}>
                <Text style={globalStyles.veterinaryAppointmentDay}>15</Text>
                <Text style={globalStyles.veterinaryAppointmentMonth}>Dec</Text>
              </View>
              <View style={globalStyles.veterinaryAppointmentDetails}>
                <Text style={globalStyles.veterinaryAppointmentTitle}>Annual Checkup</Text>
                <Text style={globalStyles.veterinaryAppointmentVet}>Pet Care Central</Text>
                <Text style={globalStyles.veterinaryAppointmentTime}>Buddy • 2:00 PM</Text>
              </View>
              <TouchableOpacity style={globalStyles.veterinaryAppointmentAction}>
                <Text style={globalStyles.veterinaryAppointmentActionText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}