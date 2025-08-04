import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface Pet {
  id: string;
  name: string;
  type: string;
}

interface PetSelectorProps {
  pets: Pet[];
  selectedPet: string;
  onSelectPet: (petId: string) => void;
}

export function PetSelector({ pets, selectedPet, onSelectPet }: PetSelectorProps) {
  return (
    <View style={globalStyles.petSelectorContainer}>
      {pets.map((pet) => (
        <TouchableOpacity
          key={pet.id}
          style={[
            globalStyles.petSelectorOption,
            selectedPet === pet.id && globalStyles.petSelectorSelectedOption,
          ]}
          onPress={() => onSelectPet(pet.id)}
        >
          <View style={globalStyles.petSelectorInfo}>
            <Text
              style={[
                globalStyles.petSelectorName,
                selectedPet === pet.id && globalStyles.petSelectorSelectedName,
              ]}
            >
              {pet.name}
            </Text>
            <Text
              style={[
                globalStyles.petSelectorType,
                selectedPet === pet.id && globalStyles.petSelectorSelectedType,
              ]}
            >
              {pet.type}
            </Text>
          </View>
          <View
            style={[
              globalStyles.petSelectorRadioButton,
              selectedPet === pet.id && globalStyles.petSelectorSelectedRadioButton,
            ]}
          >
            {selectedPet === pet.id && <View style={globalStyles.petSelectorRadioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}