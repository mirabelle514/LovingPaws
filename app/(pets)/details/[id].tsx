import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Camera, Activity, Pill, Calendar, Heart, Thermometer, Utensils } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { useArchive } from '@/contexts/ArchiveContext';

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getPetById, deletePet } = usePets();
  const { archivePet } = useArchive();
  const pet = getPetById(id as string);

  if (!pet) {
    return (
      <SafeAreaView style={globalStyles.profileContainer}>
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Pet Not Found</Text>
        </View>
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileFormLabel}>The pet you're looking for doesn't exist.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleEditPet = () => {
    router.push(`/(pets)/edit/${pet.id}` as any);
  };

  const handleDeletePet = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'default',
          onPress: () => {
            archivePet(pet, 'User requested archive');
            deletePet(pet.id);
            Alert.alert('Pet Archived', `${pet.name} has been moved to the archive. You can restore it later.`);
            router.back();
          },
        },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            deletePet(pet.id);
            router.back();
          },
        },
      ]
    );
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return colors.semantic.success;
    if (score >= 60) return colors.semantic.warning;
    return colors.semantic.error;
  };

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>{pet.name}</Text>
          <TouchableOpacity onPress={handleEditPet} style={globalStyles.profileHeaderSaveButton}>
            <Edit3 size={24} color={colors.main.deepBlueGray} />
          </TouchableOpacity>
        </View>

        {/* Pet Photo */}
        <View style={globalStyles.profileSection}>
          <View style={globalStyles.profileAvatarSection}>
            {pet.image ? (
              <Image source={{ uri: pet.image }} style={globalStyles.profileHeaderAvatarImage} />
            ) : (
              <View style={[globalStyles.profileHeaderAvatar, { backgroundColor: colors.main.softPeriwinkle }]}>
                <Text style={globalStyles.profileHeaderAvatarText}>{pet.name.charAt(0)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Basic Information */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Basic Information</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Name</Text>
            <Text style={globalStyles.profileFormReadOnly}>{pet.name}</Text>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Type</Text>
            <Text style={globalStyles.profileFormReadOnly}>{pet.type}</Text>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Breed</Text>
            <Text style={globalStyles.profileFormReadOnly}>{pet.breed}</Text>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Age</Text>
            <Text style={globalStyles.profileFormReadOnly}>{pet.age}</Text>
          </View>

          {pet.weight && (
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Weight</Text>
              <Text style={globalStyles.profileFormReadOnly}>{pet.weight}</Text>
            </View>
          )}

          {pet.color && (
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Color</Text>
              <Text style={globalStyles.profileFormReadOnly}>{pet.color}</Text>
            </View>
          )}

          {pet.microchipId && (
            <View style={globalStyles.profileFormField}>
              <Text style={globalStyles.profileFormLabel}>Microchip ID</Text>
              <Text style={globalStyles.profileFormReadOnly}>{pet.microchipId}</Text>
            </View>
          )}
        </View>

        {/* Health Information */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Health Information</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Health Score</Text>
            <View style={globalStyles.petCardHealthBar}>
              <View
                style={[
                  globalStyles.petCardHealthFill,
                  {
                    width: `${pet.healthScore}%`,
                    backgroundColor: getHealthColor(pet.healthScore),
                  },
                ]}
              />
            </View>
            <Text style={[globalStyles.petCardHealthScore, { color: getHealthColor(pet.healthScore) }]}>
              {pet.healthScore}%
            </Text>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Last Checkup</Text>
            <Text style={globalStyles.profileFormReadOnly}>{pet.lastCheckup}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={globalStyles.profileSettingsItem}
            onPress={() => router.push('/(health)/log-symptom' as any)}
          >
            <Activity size={20} color={colors.main.deepBlueGray} />
            <Text style={globalStyles.profileSettingsItemText}>Log Symptom</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.profileSettingsItem}
            onPress={() => router.push('/(health)/give-medication' as any)}
          >
            <Pill size={20} color={colors.main.deepBlueGray} />
            <Text style={globalStyles.profileSettingsItemText}>Give Medication</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.profileSettingsItem}
            onPress={() => router.push('/(health)/schedule-visit' as any)}
          >
            <Calendar size={20} color={colors.main.deepBlueGray} />
            <Text style={globalStyles.profileSettingsItemText}>Schedule Visit</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={globalStyles.profileSettingsItem}
            onPress={() => router.push('/(tabs)/analytics' as any)}
          >
            <Heart size={20} color={colors.main.deepBlueGray} />
            <Text style={globalStyles.profileSettingsItemText}>View Health History</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        {pet.ownerNotes && (
          <View style={globalStyles.profileSection}>
            <Text style={globalStyles.profileSectionTitle}>Notes</Text>
            <Text style={globalStyles.profileFormReadOnly}>{pet.ownerNotes}</Text>
          </View>
        )}

        {/* Danger Zone */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Danger Zone</Text>
          <TouchableOpacity 
            style={[globalStyles.profileSettingsItem, { borderColor: colors.semantic.error }]}
            onPress={handleDeletePet}
          >
            <Text style={[globalStyles.profileSettingsItemText, { color: colors.semantic.error }]}>
              Delete Pet
            </Text>
            <Text style={[globalStyles.profileSettingsItemText, { color: colors.semantic.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 