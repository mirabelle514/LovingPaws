import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { databaseService } from '../services/DatabaseService';
import { Pet, HealthEntry } from '../types/database';
import { generateId, calculateHealthScore } from '../utils/helpers';

interface PetContextType {
  pets: Pet[];
  loading: boolean;
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'syncedToCloud'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;
  addHealthEntry: (entry: Omit<HealthEntry, 'id' | 'createdAt' | 'syncedToCloud'>) => Promise<void>;
  getHealthEntries: (petId?: string) => Promise<HealthEntry[]>;
  refreshPets: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

interface PetProviderProps {
  children: ReactNode;
}

export function PetProvider({ children }: PetProviderProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true); // Set back to true for initial loading

  // Initialize database and load pets
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await databaseService.init();
        await loadPets();
        console.log('Database initialized and pets loaded successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        Alert.alert('Database Error', 'Failed to initialize database. Please restart the app.');
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const loadPets = async () => {
    try {
      const petsData = await databaseService.getPets();
      setPets(petsData);
      console.log('Loaded pets from database:', petsData.length);
    } catch (error) {
      console.error('Error loading pets:', error);
      Alert.alert('Error', 'Failed to load pets from database.');
    }
  };

  const addPet = async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'syncedToCloud'>) => {
    try {
      const now = new Date().toISOString();
      const newPet: Pet = {
        ...petData,
        id: generateId(),
        healthScore: 100, // Default health score
        lastCheckup: 'Never',
        createdAt: now,
        updatedAt: now,
        syncedToCloud: false
      };

      await databaseService.addPet(newPet);
      await databaseService.addToSyncQueue('pets', newPet.id, 'INSERT', newPet);
      
      // Update local state
      setPets(prev => [newPet, ...prev]);
      
      Alert.alert('Success', `${newPet.name} has been added to your pets!`);
    } catch (error) {
      console.error('Error adding pet:', error);
      Alert.alert('Error', 'Failed to add pet. Please try again.');
    }
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    try {
      await databaseService.updatePet({ id, ...updates });
      await databaseService.addToSyncQueue('pets', id, 'UPDATE', updates);
      
      // Update local state
      setPets(prev => prev.map(pet => 
        pet.id === id ? { ...pet, ...updates } : pet
      ));
      
      Alert.alert('Success', 'Pet updated successfully!');
    } catch (error) {
      console.error('Error updating pet:', error);
      Alert.alert('Error', 'Failed to update pet. Please try again.');
    }
  };

  const deletePet = async (id: string) => {
    try {
      await databaseService.deletePet(id);
      await databaseService.addToSyncQueue('pets', id, 'DELETE', { id });
      
      // Update local state
      setPets(prev => prev.filter(pet => pet.id !== id));
      
      Alert.alert('Success', 'Pet deleted successfully!');
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert('Error', 'Failed to delete pet. Please try again.');
    }
  };

  const getPetById = (id: string) => {
    return pets.find(pet => pet.id === id);
  };

  const addHealthEntry = async (entry: Omit<HealthEntry, 'id' | 'createdAt' | 'syncedToCloud'>) => {
    try {
      const newEntry = {
        ...entry,
        id: generateId()
      };

      await databaseService.addHealthEntry(newEntry);
      await databaseService.addToSyncQueue('health_entries', newEntry.id, 'INSERT', newEntry);
      
      // Update pet's health score
      const pet = getPetById(entry.petId);
      if (pet) {
        const healthEntries = await databaseService.getHealthEntries(entry.petId);
        const newHealthScore = calculateHealthScore(healthEntries);
        await updatePet(entry.petId, { healthScore: newHealthScore });
      }
      
      Alert.alert('Success', 'Health entry added successfully!');
    } catch (error) {
      console.error('Error adding health entry:', error);
      Alert.alert('Error', 'Failed to add health entry. Please try again.');
    }
  };

  const getHealthEntries = async (petId?: string) => {
    try {
      return await databaseService.getHealthEntries(petId);
    } catch (error) {
      console.error('Error loading health entries:', error);
      Alert.alert('Error', 'Failed to load health entries.');
      return [];
    }
  };

  const refreshPets = async () => {
    await loadPets();
  };

  return (
    <PetContext.Provider value={{ 
      pets, 
      loading,
      addPet, 
      updatePet, 
      deletePet, 
      getPetById, 
      addHealthEntry,
      getHealthEntries,
      refreshPets
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}