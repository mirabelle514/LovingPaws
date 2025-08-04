import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Edit3, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { useUser } from '@/contexts/UserContext';

export default function ProfileEditScreen() {
  const { userData, updateUserData } = useUser();
  const [formData, setFormData] = useState({
    userName: userData.userName,
    userEmail: userData.userEmail,
    memberSince: userData.memberSince,
    avatarInitials: userData.avatarInitials,
    profileImage: userData.profileImage,
  });

  const handleSave = () => {
    // Update the user data in context
    updateUserData({
      userName: formData.userName,
      userEmail: formData.userEmail,
      avatarInitials: formData.avatarInitials,
      profileImage: formData.profileImage,
    });
    
    // Show success message
    Alert.alert('Success', 'Profile updated successfully!');
    
    // Navigate back
    router.back();
  };

  const handleCameraPress = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0].uri;
        setFormData({ ...formData, profileImage: selectedImage });
        
        // Update avatar initials based on the first letter of the name
        const initials = formData.userName
          .split(' ')
          .map(name => name.charAt(0))
          .join('')
          .toUpperCase();
        setFormData(prev => ({ ...prev, avatarInitials: initials }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Edit Profile</Text>
          <View style={globalStyles.profileHeaderSaveButton}>
            <Edit3 size={24} color={colors.main.deepBlueGray} />
          </View>
        </View>

        {/* Avatar Section */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Profile Picture</Text>
          <View style={globalStyles.profileAvatarSection}>
            <View style={globalStyles.profileHeaderAvatar}>
              {formData.profileImage ? (
                <Image 
                  source={{ uri: formData.profileImage }} 
                  style={globalStyles.profileHeaderAvatarImage}
                />
              ) : (
                <Text style={globalStyles.profileHeaderAvatarText}>{formData.avatarInitials}</Text>
              )}
            </View>
            <TouchableOpacity style={globalStyles.profileHeaderCameraButton} onPress={handleCameraPress}>
              <Camera size={16} color={colors.main.deepBlueGray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Personal Information</Text>
          
          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Full Name</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.userName}
              onChangeText={(text) => setFormData({ ...formData, userName: text })}
              placeholder="Enter your full name"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Email Address</Text>
            <TextInput
              style={globalStyles.profileFormInput}
              value={formData.userEmail}
              onChangeText={(text) => setFormData({ ...formData, userEmail: text })}
              placeholder="Enter your email"
              placeholderTextColor={colors.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={globalStyles.profileFormField}>
            <Text style={globalStyles.profileFormLabel}>Member Since</Text>
            <Text style={globalStyles.profileFormReadOnly}>{formData.memberSince}</Text>
          </View>
        </View>

        {/* Additional Settings */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={globalStyles.profileSettingsItem}>
            <Text style={globalStyles.profileSettingsItemText}>Change Password</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.profileSettingsItem}>
            <Text style={globalStyles.profileSettingsItemText}>Privacy Settings</Text>
            <Text style={globalStyles.profileSettingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.profileSettingsItem}>
            <Text style={globalStyles.profileSettingsItemText}>Delete Account</Text>
            <Text style={[globalStyles.profileSettingsItemText, { color: colors.semantic.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Save Profile Button */}
        <View style={globalStyles.profileSection}>
          <TouchableOpacity style={globalStyles.profileSaveButton} onPress={handleSave}>
            <Text style={globalStyles.profileSaveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 