import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, Download, CircleHelp as HelpCircle, LogOut, ChevronRight, Heart, FolderOpen } from 'lucide-react-native';

import { ProfileHeader } from '@/components/ProfileHeader';
import { SettingsItem } from '@/components/SettingsItem';
import { globalStyles } from '@/styles/globalStyles';
import { colors } from '@/styles/colors';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { userData } = useUser();

  const handleEditProfile = () => {
    // Navigate to profile edit screen
    router.push('/(profile)/edit' as any);
  };

  return (
    <SafeAreaView style={globalStyles.profileContainer}>
      <ScrollView style={globalStyles.profileScrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader 
          userName={userData.userName}
          userEmail={userData.userEmail}
          memberSince={userData.memberSince}
          avatarInitials={userData.avatarInitials}
          profileImage={userData.profileImage}
          onEditPress={handleEditProfile}
        />

        {/* Quick Stats */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Your Activity</Text>
          <View style={globalStyles.profileStatsGrid}>
            <View style={globalStyles.profileStatCard}>
              <Text style={globalStyles.profileStatValue}>24</Text>
              <Text style={globalStyles.profileStatLabel}>Health Entries</Text>
            </View>
            <View style={globalStyles.profileStatCard}>
              <Text style={globalStyles.profileStatValue}>2</Text>
              <Text style={globalStyles.profileStatLabel}>Pets Tracked</Text>
            </View>
            <View style={globalStyles.profileStatCard}>
              <Text style={globalStyles.profileStatValue}>5</Text>
              <Text style={globalStyles.profileStatLabel}>Vet Visits</Text>
            </View>
            <View style={globalStyles.profileStatCard}>
              <Text style={globalStyles.profileStatValue}>30</Text>
              <Text style={globalStyles.profileStatLabel}>Days Active</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Settings</Text>
          <View style={globalStyles.profileSettingsList}>
            <SettingsItem
              icon={<Bell size={20} color={colors.text.secondary} />}
              title="Notifications"
              showSwitch
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingsItem
              icon={<Shield size={20} color={colors.text.secondary} />}
              title="Privacy & Security"
              showChevron
            />
            <SettingsItem
              icon={<Download size={20} color={colors.text.secondary} />}
              title="Export Health Data"
              showChevron
            />
            <SettingsItem
              icon={<Settings size={20} color={colors.text.secondary} />}
              title="App Preferences"
              showChevron
            />
          </View>
        </View>

        {/* Support */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Support</Text>
          <View style={globalStyles.profileSettingsList}>
            <SettingsItem
              icon={<HelpCircle size={20} color={colors.text.secondary} />}
              title="Help & FAQ"
              showChevron
            />
            <SettingsItem
              icon={<Heart size={20} color={colors.text.secondary} />}
              title="Rate LovingPaws"
              showChevron
            />
          </View>
        </View>

        {/* Archive */}
        <View style={globalStyles.profileSection}>
          <Text style={globalStyles.profileSectionTitle}>Data Management</Text>
          <View style={globalStyles.profileSettingsList}>
            <SettingsItem
              icon={<FolderOpen size={20} color={colors.text.secondary} />}
              title="Archive"
              showChevron
              onPress={() => router.push('/(settings)/archive' as any)}
            />
          </View>
        </View>

        {/* Account */}
        <View style={globalStyles.profileSection}>
          <View style={globalStyles.profileSettingsList}>
            <SettingsItem
              icon={<LogOut size={20} color={colors.semantic.error} />}
              title="Sign Out"
              titleColor={colors.semantic.error}
              showChevron
            />
          </View>
        </View>

        {/* App Info */}
        <View style={globalStyles.profileFooter}>
          <Text style={globalStyles.profileAppVersion}>LovingPaws v1.0.0</Text>
          <Text style={globalStyles.profileFooterText}>
            Made with ❤️ for pet parents everywhere
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}