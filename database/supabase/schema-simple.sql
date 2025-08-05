-- Simple Supabase Database Schema for LovingPaws (No Auth Required)
-- Run this in your Supabase SQL Editor for testing

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
  synced_to_cloud BOOLEAN DEFAULT FALSE
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
  FOREIGN KEY (pet_id) REFERENCES pets (id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
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
  synced BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_entries_pet_id ON health_entries(pet_id);
CREATE INDEX IF NOT EXISTS idx_health_entries_date ON health_entries(date);
CREATE INDEX IF NOT EXISTS idx_health_entries_type ON health_entries(type);
CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced);
CREATE INDEX IF NOT EXISTS idx_pets_synced ON pets(synced_to_cloud);
CREATE INDEX IF NOT EXISTS idx_health_entries_synced ON health_entries(synced_to_cloud);
CREATE INDEX IF NOT EXISTS idx_users_synced ON users(synced_to_cloud);

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

-- Insert a test user for testing
INSERT INTO users (id, user_name, user_email, avatar_initials, member_since)
VALUES ('test-user-123', 'Test User', 'test@lovingpaws.com', 'TU', CURRENT_DATE)
ON CONFLICT (id) DO NOTHING; 