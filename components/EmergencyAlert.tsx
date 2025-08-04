import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, Phone } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

export function EmergencyAlert() {
  return (
    <View style={globalStyles.emergencyAlertContainer}>
      <View style={globalStyles.emergencyAlertCard}>
        <View style={globalStyles.emergencyAlertIconContainer}>
          <AlertTriangle size={24} color={colors.main.warning} />
        </View>
        <View style={globalStyles.emergencyAlertContent}>
          <Text style={globalStyles.emergencyAlertTitle}>Emergency Vet Available 24/7</Text>
          <Text style={globalStyles.emergencyAlertSubtitle}>
            Need urgent care? Connect with emergency veterinarians now
          </Text>
        </View>
        <TouchableOpacity style={globalStyles.emergencyAlertCallButton}>
          <Phone size={18} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>
    </View>
  );
}