import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Edit3, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import { useUser } from '../contexts/UserContext';

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
  memberSince?: string;
  avatarInitials?: string;
  profileImage?: string;
  onEditPress?: () => void;
}

export function ProfileHeader({ 
  userName = 'John Peterson',
  userEmail = 'john.peterson@email.com',
  memberSince = 'Member since December 2023',
  avatarInitials = 'JP',
  profileImage,
  onEditPress
}: ProfileHeaderProps) {
  const { updateUserData } = useUser();

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
        
        // Update avatar initials based on the first letter of the name
        const initials = userName
          .split(' ')
          .map(name => name.charAt(0))
          .join('')
          .toUpperCase();
        
        // Update user data with new image and initials
        updateUserData({
          profileImage: selectedImage,
          avatarInitials: initials,
        });
        
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };
  return (
    <View style={globalStyles.profileHeaderContainer}>
      <View style={[globalStyles.profileHeaderGradient, { backgroundColor: colors.main.deepBlueGray }]}>
        <View style={globalStyles.profileHeaderSection}>
          <View style={globalStyles.profileHeaderAvatarContainer}>
            <View style={globalStyles.profileHeaderAvatar}>
              {profileImage ? (
                <Image 
                  source={{ uri: profileImage }} 
                  style={globalStyles.profileHeaderAvatarImage}
                />
              ) : (
                <Text style={globalStyles.profileHeaderAvatarText}>{avatarInitials}</Text>
              )}
            </View>
            <TouchableOpacity style={globalStyles.profileHeaderCameraButton} onPress={handleCameraPress}>
              <Camera size={16} color={colors.main.deepBlueGray} />
            </TouchableOpacity>
          </View>
          <View style={globalStyles.profileHeaderUserInfo}>
            <Text style={globalStyles.profileHeaderUserName}>{userName}</Text>
            <Text style={globalStyles.profileHeaderUserEmail}>{userEmail}</Text>
            <Text style={globalStyles.profileHeaderMemberSince}>{memberSince}</Text>
          </View>
          <TouchableOpacity style={globalStyles.profileHeaderEditButton} onPress={onEditPress}>
            <Edit3 size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}