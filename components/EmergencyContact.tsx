import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, Phone, MessageCircle } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

export function EmergencyContact() {
  return (
    <View style={globalStyles.emergencyContactContainer}>
      <View style={[globalStyles.emergencyContactCard, { backgroundColor: colors.semantic.error }]}>
        <View style={globalStyles.emergencyContactIconContainer}>
          <AlertTriangle size={24} color="#FFFFFF" />
        </View>
        <View style={globalStyles.emergencyContactContent}>
          <Text style={globalStyles.emergencyContactTitle}>24/7 Emergency Vet</Text>
          <Text style={globalStyles.emergencyContactSubtitle}>
            Urgent care available now • Response in under 5 minutes
          </Text>
        </View>
        <View style={globalStyles.emergencyContactActions}>
          <TouchableOpacity style={globalStyles.emergencyContactButton}>
            <Phone size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.emergencyContactButton}>
            <MessageCircle size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}