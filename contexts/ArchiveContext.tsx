import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from './PetContext';

interface ArchivedPet extends Pet {
  archivedAt: string;
  archivedReason: string;
}

interface ArchivedUser {
  id: string;
  userName: string;
  userEmail: string;
  memberSince: string;
  avatarInitials: string;
  profileImage?: string;
  archivedAt: string;
  archivedReason: string;
}

interface ArchiveContextType {
  archivedPets: ArchivedPet[];
  archivedUsers: ArchivedUser[];
  archivePet: (pet: Pet, reason: string) => void;
  archiveUser: (user: any, reason: string) => void;
  restorePet: (petId: string) => ArchivedPet | undefined;
  restoreUser: (userId: string) => ArchivedUser | undefined;
  permanentlyDeletePet: (petId: string) => void;
  permanentlyDeleteUser: (userId: string) => void;
}

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

interface ArchiveProviderProps {
  children: ReactNode;
}

export function ArchiveProvider({ children }: ArchiveProviderProps) {
  const [archivedPets, setArchivedPets] = useState<ArchivedPet[]>([]);
  const [archivedUsers, setArchivedUsers] = useState<ArchivedUser[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load archived data from AsyncStorage on mount
  useEffect(() => {
    const loadArchivedData = async () => {
      try {
        const storedArchivedPets = await AsyncStorage.getItem('archivedPets');
        const storedArchivedUsers = await AsyncStorage.getItem('archivedUsers');
        
        if (storedArchivedPets) {
          setArchivedPets(JSON.parse(storedArchivedPets));
        }
        if (storedArchivedUsers) {
          setArchivedUsers(JSON.parse(storedArchivedUsers));
        }
      } catch (error) {
        console.error('Error loading archived data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadArchivedData();
  }, []);

  const archivePet = async (pet: Pet, reason: string) => {
    const archivedPet: ArchivedPet = {
      ...pet,
      archivedAt: new Date().toISOString(),
      archivedReason: reason,
    };
    const updatedArchivedPets = [...archivedPets, archivedPet];
    setArchivedPets(updatedArchivedPets);
    try {
      await AsyncStorage.setItem('archivedPets', JSON.stringify(updatedArchivedPets));
    } catch (error) {
      console.error('Error archiving pet:', error);
    }
  };

  const archiveUser = async (user: any, reason: string) => {
    const archivedUser: ArchivedUser = {
      id: user.id || Date.now().toString(),
      userName: user.userName,
      userEmail: user.userEmail,
      memberSince: user.memberSince,
      avatarInitials: user.avatarInitials,
      profileImage: user.profileImage,
      archivedAt: new Date().toISOString(),
      archivedReason: reason,
    };
    const updatedArchivedUsers = [...archivedUsers, archivedUser];
    setArchivedUsers(updatedArchivedUsers);
    try {
      await AsyncStorage.setItem('archivedUsers', JSON.stringify(updatedArchivedUsers));
    } catch (error) {
      console.error('Error archiving user:', error);
    }
  };

  const restorePet = async (petId: string) => {
    const petToRestore = archivedPets.find(pet => pet.id === petId);
    if (petToRestore) {
      const updatedArchivedPets = archivedPets.filter(pet => pet.id !== petId);
      setArchivedPets(updatedArchivedPets);
      try {
        await AsyncStorage.setItem('archivedPets', JSON.stringify(updatedArchivedPets));
      } catch (error) {
        console.error('Error restoring pet:', error);
      }
    }
    return petToRestore;
  };

  const restoreUser = async (userId: string) => {
    const userToRestore = archivedUsers.find(user => user.id === userId);
    if (userToRestore) {
      const updatedArchivedUsers = archivedUsers.filter(user => user.id !== userId);
      setArchivedUsers(updatedArchivedUsers);
      try {
        await AsyncStorage.setItem('archivedUsers', JSON.stringify(updatedArchivedUsers));
      } catch (error) {
        console.error('Error restoring user:', error);
      }
    }
    return userToRestore;
  };

  const permanentlyDeletePet = async (petId: string) => {
    const updatedArchivedPets = archivedPets.filter(pet => pet.id !== petId);
    setArchivedPets(updatedArchivedPets);
    try {
      await AsyncStorage.setItem('archivedPets', JSON.stringify(updatedArchivedPets));
    } catch (error) {
      console.error('Error permanently deleting pet:', error);
    }
  };

  const permanentlyDeleteUser = async (userId: string) => {
    const updatedArchivedUsers = archivedUsers.filter(user => user.id !== userId);
    setArchivedUsers(updatedArchivedUsers);
    try {
      await AsyncStorage.setItem('archivedUsers', JSON.stringify(updatedArchivedUsers));
    } catch (error) {
      console.error('Error permanently deleting user:', error);
    }
  };

  return (
    <ArchiveContext.Provider value={{
      archivedPets,
      archivedUsers,
      archivePet,
      archiveUser,
      restorePet,
      restoreUser,
      permanentlyDeletePet,
      permanentlyDeleteUser,
    }}>
      {children}
    </ArchiveContext.Provider>
  );
}

export function useArchive() {
  const context = useContext(ArchiveContext);
  if (context === undefined) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
} 