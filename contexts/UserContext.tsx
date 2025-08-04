import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  userName: string;
  userEmail: string;
  memberSince: string;
  avatarInitials: string;
  profileImage?: string;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (newData: Partial<UserData>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userData, setUserData] = useState<UserData>({
    userName: 'John Peterson',
    userEmail: 'john.peterson@email.com',
    memberSince: 'Member since December 2023',
    avatarInitials: 'JP',
    profileImage: undefined,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserData();
  }, []);

  const updateUserData = async (newData: Partial<UserData>) => {
    const updatedData = {
      ...userData,
      ...newData,
    };
    setUserData(updatedData);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 