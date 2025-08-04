import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import { useArchive } from '../contexts/ArchiveContext';
import { usePets } from '../contexts/PetContext';
import { MoreVertical } from 'lucide-react-native';
import { Pet } from '../types/database';

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const { archivePet } = useArchive();
  const { deletePet } = usePets();

  const getHealthColor = (score: number) => {
      if (score >= 80) return colors.semantic.success;
  if (score >= 60) return colors.semantic.warning;
  return colors.semantic.error;
  };

  const handleArchivePet = () => {
    Alert.alert(
      'Archive Pet',
      `Would you like to archive ${pet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'default',
          onPress: () => {
            archivePet(pet, 'User requested archive from pet card');
            deletePet(pet.id);
            Alert.alert('Pet Archived', `${pet.name} has been moved to the archive.`);
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={globalStyles.petCardContainer}
      onPress={() => router.push(`/(pets)/details/${pet.id}` as any)}
    >
      <View style={globalStyles.petCard}>
        <View style={{ position: 'relative' }}>
          {pet.image ? (
            <Image 
              source={{ uri: pet.image }} 
              style={globalStyles.petCardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[globalStyles.petCardImage, { backgroundColor: colors.main.softPeriwinkle, justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: colors.main.deepBlueGray }}>
                {pet.name.charAt(0)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: colors.background.primary + 'CC',
              borderRadius: 16,
              padding: 4,
            }}
            onPress={handleArchivePet}
          >
            <MoreVertical size={16} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.petCardContent}>
          <Text style={globalStyles.petCardName}>{pet.name}</Text>
          <Text style={globalStyles.petCardDetails}>
            {pet.breed} • {pet.age}
          </Text>
          
          <View style={globalStyles.petCardHealthSection}>
            <Text style={globalStyles.petCardHealthLabel}>Health Score</Text>
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
          
          <Text style={globalStyles.petCardLastCheckup}>Last checkup: {pet.lastCheckup}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}