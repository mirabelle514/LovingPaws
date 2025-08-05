import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, RotateCcw, FolderOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { useArchive } from '@/contexts/ArchiveContext';
import { usePets } from '@/contexts/PetContext';
import { useUser } from '@/contexts/UserContext';

export default function ArchiveScreen() {
  const { archivedPets, archivedUsers, restorePet, restoreUser, permanentlyDeletePet, permanentlyDeleteUser } = useArchive();
  const { addPet } = usePets();
  const { updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState<'pets' | 'users'>('pets');

  const handleRestorePet = (petId: string) => {
    const petToRestore = restorePet(petId);
    if (petToRestore) {
      // Remove archived fields before adding back
      const { archivedAt, archivedReason, ...petData } = petToRestore as any;
      addPet(petData);
      Alert.alert('Pet Restored', `${(petToRestore as any).name} has been restored successfully!`);
    }
  };

  const handleRestoreUser = (userId: string) => {
    const userToRestore = restoreUser(userId);
    if (userToRestore) {
      // Remove archived fields before updating
      const { id, archivedAt, archivedReason, ...userData } = userToRestore;
      updateUserData(userData);
      Alert.alert('User Restored', 'User profile has been restored successfully!');
    }
  };

  const handlePermanentlyDeletePet = (petId: string, petName: string) => {
    Alert.alert(
      'Permanently Delete Pet',
      `Are you sure you want to permanently delete ${petName}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            permanentlyDeletePet(petId);
            Alert.alert('Pet Deleted', `${petName} has been permanently deleted.`);
          },
        },
      ]
    );
  };

  const handlePermanentlyDeleteUser = (userId: string) => {
    Alert.alert(
      'Permanently Delete User',
      'Are you sure you want to permanently delete this user profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => {
            permanentlyDeleteUser(userId);
            Alert.alert('User Deleted', 'User profile has been permanently deleted.');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
    return new Date(dateString.replace(/\//g, '-')).toLocaleDateString();
  };

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={globalStyles.profileHeader}>
          <TouchableOpacity onPress={() => router.back()} style={globalStyles.profileHeaderBackButton}>
            <ArrowLeft size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={globalStyles.profileHeaderTitle}>Archive</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Tab Navigation */}
        <View style={globalStyles.profileSection}>
          <View style={{ flexDirection: 'row', backgroundColor: colors.background.secondary, borderRadius: 8, padding: 4 }}>
            <TouchableOpacity
              style={[
                { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
                activeTab === 'pets' && { backgroundColor: colors.main.deepBlueGray }
              ]}
              onPress={() => setActiveTab('pets')}
            >
              <Text style={[
                { fontWeight: '600' },
                activeTab === 'pets' ? { color: colors.background.primary } : { color: colors.text.secondary }
              ]}>
                Pets ({archivedPets.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 6 },
                activeTab === 'users' && { backgroundColor: colors.main.deepBlueGray }
              ]}
              onPress={() => setActiveTab('users')}
            >
              <Text style={[
                { fontWeight: '600' },
                activeTab === 'users' ? { color: colors.background.primary } : { color: colors.text.secondary }
              ]}>
                Users ({archivedUsers.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Archived Pets */}
        {activeTab === 'pets' && (
          <View style={globalStyles.profileSection}>
            <Text style={globalStyles.profileSectionTitle}>Archived Pets</Text>
            {archivedPets.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <FolderOpen size={48} color={colors.text.tertiary} />
                <Text style={[globalStyles.profileFormLabel, { marginTop: 16, color: colors.text.tertiary }]}>
                  No archived pets
                </Text>
              </View>
            ) : (
              archivedPets.map((pet: any) => (
                <View key={pet.id} style={[globalStyles.profileSettingsItem, { marginBottom: 12 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {pet.image ? (
                      <Image source={{ uri: pet.image }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
                    ) : (
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.main.softPeriwinkle, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.main.deepBlueGray }}>
                          {pet.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={globalStyles.profileSettingsItemText}>{pet.name}</Text>
                      <Text style={[globalStyles.profileFormLabel, { fontSize: 12, color: colors.text.tertiary }]}>
                        {pet.type} • {pet.breed}
                      </Text>
                      <Text style={[globalStyles.profileFormLabel, { fontSize: 12, color: colors.text.tertiary }]}>
                        Archived: {formatDate(pet.archivedAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleRestorePet(pet.id)}
                      style={{ padding: 8, backgroundColor: colors.semantic.success + '20', borderRadius: 6 }}
                    >
                      <RotateCcw size={16} color={colors.semantic.success} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handlePermanentlyDeletePet(pet.id, pet.name)}
                      style={{ padding: 8, backgroundColor: colors.semantic.error + '20', borderRadius: 6 }}
                    >
                      <Trash2 size={16} color={colors.semantic.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Archived Users */}
        {activeTab === 'users' && (
          <View style={globalStyles.profileSection}>
            <Text style={globalStyles.profileSectionTitle}>Archived Users</Text>
            {archivedUsers.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <FolderOpen size={48} color={colors.text.tertiary} />
                <Text style={[globalStyles.profileFormLabel, { marginTop: 16, color: colors.text.tertiary }]}>
                  No archived users
                </Text>
              </View>
            ) : (
              archivedUsers.map((user) => (
                <View key={user.id} style={[globalStyles.profileSettingsItem, { marginBottom: 12 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {user.profileImage ? (
                      <Image source={{ uri: user.profileImage }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
                    ) : (
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.main.softPeriwinkle, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.main.deepBlueGray }}>
                          {user.avatarInitials}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={globalStyles.profileSettingsItemText}>{user.userName}</Text>
                      <Text style={[globalStyles.profileFormLabel, { fontSize: 12, color: colors.text.tertiary }]}>
                        {user.userEmail}
                      </Text>
                      <Text style={[globalStyles.profileFormLabel, { fontSize: 12, color: colors.text.tertiary }]}>
                        Archived: {formatDate(user.archivedAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleRestoreUser(user.id)}
                      style={{ padding: 8, backgroundColor: colors.semantic.success + '20', borderRadius: 6 }}
                    >
                      <RotateCcw size={16} color={colors.semantic.success} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handlePermanentlyDeleteUser(user.id)}
                      style={{ padding: 8, backgroundColor: colors.semantic.error + '20', borderRadius: 6 }}
                    >
                      <Trash2 size={16} color={colors.semantic.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
} 