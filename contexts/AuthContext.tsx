import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { supabaseService } from '../database/SupabaseService';
import { databaseService } from '../database/DatabaseService';
import { User } from '../database/types';
import { generateAvatarInitials } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  syncData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Initialize Supabase
      await supabaseService.init();
      
      // Check for existing session
      const currentUser = await supabaseService.getCurrentUser();
      
      if (currentUser) {
        // User is authenticated, load their data
        await loadUserData(currentUser.id);
      } else {
        // No authenticated user
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Try to get user from local database first
      let userData = await databaseService.getUser();
      
      if (!userData) {
        // Try to get from cloud
        userData = await supabaseService.getUserFromCloud();
        
        if (userData) {
          // Save to local database
          await databaseService.addUser(userData);
        }
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUser(null);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Create user data with defaults
      const newUser: Partial<User> = {
        id: userData.id || '',
        userName: userData.userName || email.split('@')[0],
        userEmail: email,
        avatarInitials: generateAvatarInitials(userData.userName || email.split('@')[0]),
        memberSince: new Date().toISOString().split('T')[0],
        ...userData
      };

      const { user: authUser, error } = await supabaseService.signUp(email, password, newUser);
      
      if (error) {
        Alert.alert('Sign Up Failed', error.message);
        return false;
      }

      if (authUser) {
        // Save user data to local database
        await databaseService.addUser(newUser as User);
        setUser(newUser as User);
        
        Alert.alert('Success', 'Account created successfully! Please check your email to verify your account.');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { user: authUser, error } = await supabaseService.signIn(email, password);
      
      if (error) {
        Alert.alert('Sign In Failed', error.message);
        return false;
      }

      if (authUser) {
        // Load user data
        await loadUserData(authUser.id);
        
        // Sync data from cloud
        await syncData();
        
        Alert.alert('Success', 'Welcome back!');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Failed to sign in. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Sync any unsaved changes before signing out
      await syncData();
      
      // Sign out from Supabase
      const { error } = await supabaseService.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear local user data
      setUser(null);
      
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabaseService.resetPassword(email);
      
      if (error) {
        Alert.alert('Reset Failed', error.message);
        return false;
      }
      
      Alert.alert('Success', 'Password reset email sent! Please check your inbox.');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const syncData = async (): Promise<void> => {
    try {
      // Check if online
      const isOnline = await supabaseService.isOnline();
      
      if (!isOnline) {
        console.log('Offline - skipping sync');
        return;
      }

      // Sync local changes to cloud
      await supabaseService.syncToCloud();
      
      // Sync cloud changes to local
      await supabaseService.syncFromCloud();
      
      console.log('Data sync completed');
    } catch (error) {
      console.error('Data sync failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      signUp,
      signIn,
      signOut,
      resetPassword,
      syncData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 