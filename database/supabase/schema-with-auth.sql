-- Supabase Database Schema for LovingPaws
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS health_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sync_queue ENABLE ROW LEVEL SECURITY;

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  weight TEXT,
  color TEXT,
  microchip_id TEXT,
  date_of_birth TEXT,
  owner_notes TEXT,
  image TEXT,
  health_score INTEGER DEFAULT 100,
  last_checkup TEXT DEFAULT 'Never',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_to_cloud BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create health_entries table
CREATE TABLE IF NOT EXISTS health_entries (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('symptom', 'medication', 'appointment', 'behavior', 'vitals', 'feeding', 'hydration', 'examination')),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  severity TEXT CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Emergency')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_to_cloud BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  profile_image TEXT,
  avatar_initials TEXT NOT NULL,
  member_since DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_to_cloud BOOLEAN DEFAULT FALSE
);

-- Create sync_queue table
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_entries_pet_id ON health_entries(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_entries_date ON health_entries(date);
CREATE INDEX IF NOT EXISTS idx_health_entries_type ON health_entries(type);
CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
CREATE INDEX IF NOT EXISTS idx_pets_synced ON pets(synced_to_cloud);
CREATE INDEX IF NOT EXISTS idx_health_entries_synced ON health_entries(synced_to_cloud);
CREATE INDEX IF NOT EXISTS idx_users_synced ON users(synced_to_cloud);
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);
CREATE INDEX IF NOT EXISTS idx_health_entries_user_id ON health_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_user_id ON sync_queue(user_id);

-- Create RLS policies for pets table
CREATE POLICY "Users can view their own pets" ON pets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pets" ON pets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets" ON pets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets" ON pets
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for health_entries table
CREATE POLICY "Users can view their own health entries" ON health_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health entries" ON health_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health entries" ON health_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health entries" ON health_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON users
  FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for sync_queue table
CREATE POLICY "Users can view their own sync queue" ON sync_queue
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync queue" ON sync_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync queue" ON sync_queue
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sync queue" ON sync_queue
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert a test user (optional - for testing without auth)
-- INSERT INTO users (id, user_name, user_email, avatar_initials, member_since)
-- VALUES ('test-user-id', 'Test User', 'test@example.com', 'TU', CURRENT_DATE); 