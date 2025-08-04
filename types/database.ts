// Database Types for LovingPaws

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age?: string;
  weight?: string;
  color?: string;
  microchipId?: string;
  dateOfBirth?: string;
  ownerNotes?: string;
  image?: string;
  healthScore: number;
  lastCheckup: string;
  createdAt: string;
  updatedAt: string;
  syncedToCloud?: boolean;
}

export interface HealthEntry {
  id: string;
  petId: string;
  type: 'symptom' | 'medication' | 'appointment' | 'behavior' | 'vitals' | 'feeding' | 'hydration' | 'examination';
  title: string;
  description?: string;
  date: string;
  time?: string;
  severity?: 'Mild' | 'Moderate' | 'Severe' | 'Emergency';
  notes?: string;
  createdAt: string;
  syncedToCloud?: boolean;
}

export interface MedicationEntry extends HealthEntry {
  type: 'medication';
  medicationName: string;
  dosage: string;
  frequency?: string;
  route?: string;
  prescribedBy?: string;
}

export interface SymptomEntry extends HealthEntry {
  type: 'symptom';
  symptom: string;
  duration?: string;
}

export interface AppointmentEntry extends HealthEntry {
  type: 'appointment';
  appointmentType: string;
  clinicName: string;
  veterinarian?: string;
  reason?: string;
  reminder: boolean;
}

export interface User {
  id: string;
  userName: string;
  userEmail: string;
  profileImage?: string;
  avatarInitials: string;
  memberSince: string;
  createdAt: string;
  updatedAt: string;
  syncedToCloud?: boolean;
}

export interface SyncQueue {
  id: string;
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  data?: any;
  createdAt: string;
  synced: boolean;
}

// Database schema constants
export const DATABASE_VERSION = 1;
export const DATABASE_NAME = 'lovingpaws.db';

export const TABLES = {
  PETS: 'pets',
  HEALTH_ENTRIES: 'health_entries',
  USERS: 'users',
  SYNC_QUEUE: 'sync_queue'
} as const;

export type TableName = typeof TABLES[keyof typeof TABLES]; 