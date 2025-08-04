// Supabase Configuration
// Replace these with your actual Supabase project credentials

export const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_PROJECT_URL', // e.g., 'https://your-project.supabase.co'
  anonKey: 'YOUR_SUPABASE_ANON_KEY', // e.g., 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};

// Database table names (should match your Supabase schema)
export const SUPABASE_TABLES = {
  PETS: 'pets',
  HEALTH_ENTRIES: 'health_entries',
  USERS: 'users',
  SYNC_QUEUE: 'sync_queue'
} as const;

// Row Level Security (RLS) policies
export const RLS_POLICIES = {
  // Users can only access their own data
  PETS: 'auth.uid() = user_id',
  HEALTH_ENTRIES: 'auth.uid() = user_id',
  USERS: 'auth.uid() = id'
} as const; 