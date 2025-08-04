import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/contexts/UserContext';
import { PetProvider } from '@/contexts/PetContext';
import { ArchiveProvider } from '@/contexts/ArchiveContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <UserProvider>
      <PetProvider>
        <ArchiveProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ArchiveProvider>
      </PetProvider>
    </UserProvider>
  );
}
