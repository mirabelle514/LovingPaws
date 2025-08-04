import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Camera, Dog, Cat, Plus } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const { getPetById, updatePet } = usePets();
  const pet = getPetById(id as string);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    weight: '',
    color: '',
    microchipId: '',
    dateOfBirth: '',
    ownerNotes: '',
    image: undefined as string | undefined,
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed || '',
        age: pet.age || '',
        weight: pet.weight || '',
        color: pet.color || '',
        microchipId: pet.microchipId || '',
        dateOfBirth: pet.dateOfBirth || '',
        ownerNotes: pet.ownerNotes || '',
        image: pet.image,
      });
    }
  }, [pet]);

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

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.breed) {
      Alert.alert('Missing Information', 'Please fill in the required fields: Name, Type, and Breed.');
      return;
    }

    // Calculate age from date of birth if provided
    let age = formData.age;
    if (formData.dateOfBirth && !formData.age) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const ageInYears = today.getFullYear() - birthDate.getFullYear();
      age = `${ageInYears} years`;
    }

    const updatedPet = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      age: age || 'Unknown',
      weight: formData.weight || undefined,
      color: formData.color || undefined,
      microchipId: formData.microchipId || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      ownerNotes: formData.ownerNotes || undefined,
      image: formData.image,
    };

    updatePet(pet.id, updatedPet);
    Alert.alert('Success', `${formData.name}'s information has been updated!`);
    router.back();
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change the pet photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData({ ...formData, image: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const petTypes = [
    { id: 'Dog', label: 'Dog', icon: <Dog size={24} color={colors.main.deepBlueGray} /> },
    { id: 'Cat', label: 'Cat', icon: <Cat size={24} color={colors.main.deepBlueGray} /> },
    { id: 'Bird', label: 'Bird', icon: <Plus size={24} color={colors.main.deepBlueGray} /> },
    { id: 'Fish', label: 'Fish', icon: <Plus size={24} color={colors.main.deepBlueGray} /> },
    { id: 'Rabbit', label: 'Rabbit', icon: <Plus size={24} color={colors.main.deepBlueGray} /> },
    { id: 'Other', label: 'Other', icon: <Plus size={24} color={colors.main.deepBlueGray} /> },
  ];

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Edit {pet.name}</Text>
          <View style={globalStyles.profileHeaderSaveButton}>
            <Edit3 size={24} color={colors.main.deepBlueGray} />
          </View>
        </View>

        {/* Pet Photo Section */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Pet Photo</Text>
          <View style={globalStyles.profileAvatarSection}>
            <View style={globalStyles.profileHeaderAvatar}>
              {formData.image ? (
                <Image 
                  source={{ uri: formData.image }} 
                  style={globalStyles.profileHeaderAvatarImage}
                />
              ) : (
                <Text style={globalStyles.profileHeaderAvatarText}>{formData.name.charAt(0)}</Text>
              )}
            </View>
            <TouchableOpacity style={globalStyles.profileHeaderCameraButton} onPress={handleImagePick}>
              <Camera size={16} color={colors.main.deepBlueGray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Basic Information</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Pet Name *</Text>
            <TextInput
              
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter pet's name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Pet Type *</Text>
            <View style={globalStyles.petTypeGrid}>
              {petTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    globalStyles.petTypeOption,
                    formData.type === type.id && globalStyles.petTypeSelectedOption,
                  ]}
                  onPress={() => setFormData({ ...formData, type: type.id })}
                >
                  {type.icon}
                  <Text style={[
                    globalStyles.petTypeLabel,
                    formData.type === type.id && globalStyles.petTypeSelectedLabel,
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Breed *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.breed}
              onChangeText={(text) => setFormData({ ...formData, breed: text })}
              placeholder="Enter breed"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Age</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.age}
              onChangeText={(text) => setFormData({ ...formData, age: text })}
              placeholder="e.g., 3 years, 6 months"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date of Birth</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.dateOfBirth}
              onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>

        {/* Additional Details */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Additional Details</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Weight</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.weight}
              onChangeText={(text) => setFormData({ ...formData, weight: text })}
              placeholder="e.g., 65 lbs, 12 kg"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Color</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              placeholder="e.g., Golden, Black, White"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Microchip ID</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.microchipId}
              onChangeText={(text) => setFormData({ ...formData, microchipId: text })}
              placeholder="Enter microchip number"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Notes</Text>
            <TextInput
              style={[globalStyles.profileFormInput, { height: 80 }]}
              value={formData.ownerNotes}
              onChangeText={(text) => setFormData({ ...formData, ownerNotes: text })}
              placeholder="Any special notes about your pet..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Update Pet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 