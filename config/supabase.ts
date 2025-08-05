// Supabase Configuration
// Replace these with your actual Supabase project credentials

export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};

// Database table names (should match your Supabase schema)
export const SUPABASE_TABLES = {
  PETS: 'pets',
  HEALTH_ENTRIES: 'health_entries',
  USERS: 'users',
  SYNC_QUEUE: 'sync_queue'
} as const;

// Column name mappings (local camelCase to Supabase snake_case)
export const COLUMN_MAPPINGS = {
  // Pets table
  pets: {
    id: 'id',
    name: 'name',
    type: 'type',
    breed: 'breed',
    age: 'age',
    weight: 'weight',
    color: 'color',
    microchipId: 'microchip_id',
    dateOfBirth: 'date_of_birth',
    ownerNotes: 'owner_notes',
    image: 'image',
    healthScore: 'health_score',
    lastCheckup: 'last_checkup',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    syncedToCloud: 'synced_to_cloud'
  },
  // Health entries table
  health_entries: {
    id: 'id',
    petId: 'pet_id',
    type: 'type',
    title: 'title',
    description: 'description',
    date: 'date',
    time: 'time',
    severity: 'severity',
    notes: 'notes',
    createdAt: 'created_at',
    syncedToCloud: 'synced_to_cloud'
  },
  // Users table
  users: {
    id: 'id',
    userName: 'user_name',
    userEmail: 'user_email',
    profileImage: 'profile_image',
    avatarInitials: 'avatar_initials',
    memberSince: 'member_since',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    syncedToCloud: 'synced_to_cloud'
  }
} as const;

// Row Level Security (RLS) policies
export const RLS_POLICIES = {
  // Users can only access their own data
  PETS: 'auth.uid() = user_id',
  HEALTH_ENTRIES: 'auth.uid() = user_id',
  USERS: 'auth.uid() = id'
} as const; 