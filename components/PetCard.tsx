import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Edit3 } from 'lucide-react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import { Pet } from '../database/types';

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const getHealthColor = (score: number) => {
    if (score >= 80) return '#4CAF50'; // Green for good health
    if (score >= 60) return '#FF9800'; // Yellow/Orange for needs attention
    return '#F44336'; // Red for poor health
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
            onPress={() => router.push(`/(pets)/edit/${pet.id}` as any)}
          >
            <Edit3 size={16} color={colors.main.deepBlueGray} />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.petCardContent}>
          <Text style={globalStyles.petCardName}>{pet.name}</Text>
          <Text style={globalStyles.petCardDetails}>
            {(() => {
              const details = [];
              if (pet.breed) details.push(pet.breed);
                if (pet.age) {
                details.push(pet.age);
              }
              if (pet.weight) {
                const weightDisplay = pet.weightUnit ? `${pet.weight} ${pet.weightUnit}` : pet.weight;
                details.push(weightDisplay);
              }
              if (pet.gender) details.push(pet.gender);
              return details.join(' • ');
            })()}
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