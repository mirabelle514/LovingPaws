import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MapPin, Phone, Star, Clock, Navigation } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  phone: string;
  isOpen: boolean;
  specialties: string[];
  hours: string;
}

interface VetClinicCardProps {
  clinic: Clinic;
}

export function VetClinicCard({ clinic }: VetClinicCardProps) {
  return (
    <View style={globalStyles.vetClinicCardContainer}>
      <View style={globalStyles.vetClinicCardHeader}>
        <View style={globalStyles.vetClinicCardInfo}>
          <Text style={globalStyles.vetClinicCardName}>{clinic.name}</Text>
          <View style={globalStyles.vetClinicCardAddressRow}>
            <MapPin size={14} color={colors.text.secondary} />
            <Text style={globalStyles.vetClinicCardAddress}>{clinic.address}</Text>
          </View>
          <Text style={globalStyles.vetClinicCardDistance}>{clinic.distance} away</Text>
        </View>
        <View style={globalStyles.vetClinicCardRating}>
            <Star size={16} color={colors.accent.yellow} fill={colors.accent.yellow} />
          <Text style={globalStyles.vetClinicCardRatingText}>{clinic.rating}</Text>
        </View>
      </View>

      <View style={globalStyles.vetClinicCardStatusRow}>
        <View style={globalStyles.vetClinicCardStatusContainer}>
          <View
            style={[
              globalStyles.vetClinicCardStatusDot,
              { backgroundColor: clinic.isOpen ? colors.semantic.success : colors.semantic.error },
            ]}
          />
          <Text style={globalStyles.vetClinicCardStatusText}>
            {clinic.isOpen ? 'Open' : 'Closed'}
          </Text>
          <Text style={globalStyles.vetClinicCardHoursText}>{clinic.hours}</Text>
        </View>
      </View>

      <View style={globalStyles.vetClinicCardSpecialties}>
        {clinic.specialties.slice(0, 3).map((specialty, index) => (
          <View key={index} style={globalStyles.vetClinicCardSpecialtyTag}>
            <Text style={globalStyles.vetClinicCardSpecialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={globalStyles.vetClinicCardActions}>
        <TouchableOpacity style={globalStyles.vetClinicCardActionButton}>
            <Phone size={16} color={colors.main.deepBlueGray} />
          <Text style={globalStyles.vetClinicCardActionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.vetClinicCardActionButton}>
            <Navigation size={16} color={colors.main.deepBlueGray} />
          <Text style={globalStyles.vetClinicCardActionText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[globalStyles.vetClinicCardActionButton, globalStyles.vetClinicCardPrimaryAction]}>
          <Text style={globalStyles.vetClinicCardPrimaryActionText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}