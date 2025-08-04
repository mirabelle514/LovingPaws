import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/contexts/UserContext';
import { PetProvider } from '@/contexts/PetContext';
import { ArchiveProvider } from '@/contexts/ArchiveContext';
import { databaseService } from '@/services/DatabaseService';

export default function RootLayout() {
  useFrameworkReady();

  // Initialize database on app start
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await databaseService.init();
        console.log('Database initialized successfully in root layout');
      } catch (error) {
        console.error('Failed to initialize database in root layout:', error);
      }
    };
    
    initDatabase();
  }, []);

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
