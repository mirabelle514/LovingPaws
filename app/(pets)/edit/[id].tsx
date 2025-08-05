import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Camera, Dog, Cat, Plus, ChevronDown } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { usePets } from '@/contexts/PetContext';
import { useArchive } from '@/contexts/ArchiveContext';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams();
  const { getPetById, updatePet, deletePet } = usePets();
  const { archivePet } = useArchive();
  const pet = getPetById(id as string);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showAgeDropdown, setShowAgeDropdown] = useState(false);



  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    ageUnit: 'years',
    weight: '',
    weightUnit: 'lbs',
    gender: '',
    color: '',
    microchipId: '',
    dateOfBirth: '',
    ownerNotes: '',
    image: undefined as string | undefined,
  });

  useEffect(() => {
    if (pet) {
      // Parse existing age value (e.g., "3 years" -> age: "3", ageUnit: "years")
      let ageValue = '';
      let ageUnitValue = 'years';
      
      if (pet.age && pet.age !== 'Unknown') {
        const ageParts = pet.age.split(' ');
        if (ageParts.length >= 2) {
          ageValue = ageParts[0];
          ageUnitValue = ageParts[1];
          
          // Check if it's months (less than 12 months)
          if (parseFloat(ageValue) < 12 && ageUnitValue === 'years') {
            ageUnitValue = 'months';
          }
        } else {
          ageValue = pet.age;
        }
      }

      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed || '',
        age: ageValue,
        ageUnit: ageUnitValue,
        weight: pet.weight || '',
        weightUnit: pet.weightUnit || 'lbs',
        gender: pet.gender || '',
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
      age: formData.age ? `${formData.age} ${formData.ageUnit}` : 'Unknown',
      ageUnit: formData.ageUnit || 'years',
      weight: formData.weight || undefined,
      weightUnit: formData.weightUnit || undefined,
      gender: formData.gender || undefined,
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

  const handleArchivePet = () => {
    Alert.alert(
      'Rainbow Bridge',
      `Are you sure you want to add ${pet.name} to the Rainbow Bridge? This will move ${pet.name} to the archive where you can restore them later if needed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cross the Rainbow Bridge',
          style: 'default',
          onPress: () => {
            archivePet(pet, 'User requested Rainbow Bridge from edit page');
            deletePet(pet.id);
            Alert.alert('Rainbow Bridge', `${pet.name} has been passed to the Rainbow Bridge. You can restore them from the Settings > Archive section if needed.`);
            router.back();
          },
        },
      ]
    );
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

  const weightUnits = ['lbs', 'kg'];

  const genderOptions = ['Male', 'Female'];

  const ageUnits = ['years', 'months'];



  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          style={globalStyles.profileScrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Edit {pet.name}</Text>
          <TouchableOpacity onPress={handleSave} style={globalStyles.profileHeaderSaveButton}>
            <Text style={globalStyles.profileSaveButtonText}>Save</Text>
          </TouchableOpacity>
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
              <Camera size={20} color={colors.main.deepBlueGray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Basic Information</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Pet Name *</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter pet's name"
              placeholderTextColor={colors.text.secondary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
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
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Age</Text>
            <View style={globalStyles.formRow}>
              <TextInput
                style={[globalStyles.profileFormInput, globalStyles.formInputFlex]}
                value={formData.age}
                onChangeText={(text) => {
                  // Only allow numbers
                  const numericText = text.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, age: numericText });
                }}
                placeholder="Enter age"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity
                style={[globalStyles.profileFormInput, globalStyles.formDropdownFlex]}
                onPress={() => setShowAgeDropdown(!showAgeDropdown)}
              >
                <Text style={[globalStyles.dropdownText, !formData.ageUnit && globalStyles.dropdownTextPlaceholder]}>
                  {formData.ageUnit}
                </Text>
                <ChevronDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            {showAgeDropdown && (
              <View style={[globalStyles.dropdownContainer, { right: 0, width: '40%' }]}>
                  {ageUnits.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={globalStyles.dropdownOption}
                      onPress={() => {
                        setFormData({ ...formData, ageUnit: unit });
                        setShowAgeDropdown(false);
                      }}
                    >
                      <Text style={[
                        globalStyles.dropdownOptionText,
                        formData.ageUnit === unit ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                      ]}>
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Date of Birth</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.dateOfBirth}
              onChangeText={(text) => {
                // Remove all non-numeric characters
                const numbersOnly = text.replace(/[^0-9]/g, '');
                
                // Format as YYYY/MM/DD
                let formatted = '';
                if (numbersOnly.length >= 1) formatted += numbersOnly.slice(0, 4);
                if (numbersOnly.length >= 5) formatted += '/' + numbersOnly.slice(4, 6);
                if (numbersOnly.length >= 7) formatted += '/' + numbersOnly.slice(6, 8);
                
                setFormData({ ...formData, dateOfBirth: formatted });
              }}
              placeholder="YYYY/MM/DD"
              placeholderTextColor={colors.text.secondary}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>
        </View>

        {/* Additional Details */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Additional Details</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Weight</Text>
            <View style={globalStyles.formRow}>
              <TextInput
                style={[globalStyles.profileFormInput, globalStyles.formInputFull]}
                value={formData.weight}
                onChangeText={(text) => {
                  // Allow numbers and one decimal point
                  const decimalText = text.replace(/[^0-9.]/g, '');
                  // Ensure only one decimal point
                  const parts = decimalText.split('.');
                  const validText = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : decimalText;
                  setFormData({ ...formData, weight: validText });
                }}
                placeholder="Enter weight"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <TouchableOpacity
                style={[globalStyles.profileFormInput, globalStyles.formDropdownFlex]}
                onPress={() => setShowWeightDropdown(!showWeightDropdown)}
              >
                <Text style={[globalStyles.dropdownText, !formData.weightUnit && globalStyles.dropdownTextPlaceholder]}>
                  {formData.weightUnit}
                </Text>
                <ChevronDown size={16} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
            {showWeightDropdown && (
              <View style={[globalStyles.dropdownContainer, { right: 0, width: '40%' }]}>
                {weightUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={globalStyles.dropdownOption}
                    onPress={() => {
                      setFormData({ ...formData, weightUnit: unit });
                      setShowWeightDropdown(false);
                    }}
                  >
                    <Text style={[
                      globalStyles.dropdownOptionText,
                      formData.weightUnit === unit ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                    ]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Gender</Text>
            <TouchableOpacity
              style={[globalStyles.profileFormInput, globalStyles.dropdownTrigger]}
              onPress={() => setShowGenderDropdown(!showGenderDropdown)}
            >
              <Text style={[globalStyles.dropdownText, !formData.gender && globalStyles.dropdownTextPlaceholder]}>
                {formData.gender || 'Select gender'}
              </Text>
              <ChevronDown size={16} color={colors.text.secondary} />
            </TouchableOpacity>
            {showGenderDropdown && (
              <View style={globalStyles.dropdownContainer}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={globalStyles.dropdownOption}
                    onPress={() => {
                      setFormData({ ...formData, gender: option });
                      setShowGenderDropdown(false);
                    }}
                  >
                    <Text style={[
                      formData.gender === option ? globalStyles.dropdownOptionTextSelected : globalStyles.dropdownOptionTextUnselected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Color</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.color}
              onChangeText={(text) => setFormData({ ...formData, color: text })}
              placeholder="e.g., Golden, Black, White"
              placeholderTextColor={colors.text.secondary}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
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
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Notes</Text>
            <TextInput
              style={[globalStyles.profileFormInput, globalStyles.formInputMultiline]}
              value={formData.ownerNotes}
              onChangeText={(text) => setFormData({ ...formData, ownerNotes: text })}
              placeholder="Any special notes about your pet..."
              placeholderTextColor={colors.text.secondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="default"
              blurOnSubmit={true}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Rainbow Bridge Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity 
            style={[globalStyles.profileSaveButton, { backgroundColor: colors.semantic.error }]} 
            onPress={handleArchivePet}
          >
            <Text style={globalStyles.profileSaveButtonText}>Cross the Rainbow Bridge</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 