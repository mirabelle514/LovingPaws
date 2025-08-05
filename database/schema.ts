import { TABLES } from './types';

export const CREATE_TABLES = {
  [TABLES.PETS]: `
    CREATE TABLE IF NOT EXISTS pets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      breed TEXT,
      age TEXT,
      ageUnit TEXT,
      weight TEXT,
      weightUnit TEXT,
      gender TEXT,
      color TEXT,
      microchipId TEXT,
      dateOfBirth TEXT,
      ownerNotes TEXT,
      image TEXT,
      healthScore INTEGER DEFAULT 100,
      lastCheckup TEXT DEFAULT 'Never',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      syncedToCloud INTEGER DEFAULT 0
    )
  `,

  [TABLES.HEALTH_ENTRIES]: `
    CREATE TABLE IF NOT EXISTS health_entries (
      id TEXT PRIMARY KEY,
      petId TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT,
      severity TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      syncedToCloud INTEGER DEFAULT 0,
      FOREIGN KEY (petId) REFERENCES pets (id) ON DELETE CASCADE
    )
  `,

  [TABLES.USERS]: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      userEmail TEXT NOT NULL UNIQUE,
      profileImage TEXT,
      avatarInitials TEXT NOT NULL,
      memberSince TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      syncedToCloud INTEGER DEFAULT 0
    )
  `,

  [TABLES.SYNC_QUEUE]: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      tableName TEXT NOT NULL,
      recordId TEXT NOT NULL,
      operation TEXT NOT NULL,
      data TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      synced INTEGER DEFAULT 0
    )
  `
};

export const CREATE_INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_health_entries_pet_id ON health_entries(petId)`,
  `CREATE INDEX IF NOT EXISTS idx_health_entries_date ON health_entries(date)`,
  `CREATE INDEX IF NOT EXISTS idx_health_entries_type ON health_entries(type)`,
  `CREATE INDEX IF NOT EXISTS idx_sync_queue_synced ON sync_queue(synced)`,
  `CREATE INDEX IF NOT EXISTS idx_pets_synced ON pets(syncedToCloud)`,
  `CREATE INDEX IF NOT EXISTS idx_health_entries_synced ON health_entries(syncedToCloud)`,
  `CREATE INDEX IF NOT EXISTS idx_users_synced ON users(syncedToCloud)`
];

export const DROP_TABLES = [
  `DROP TABLE IF EXISTS ${TABLES.SYNC_QUEUE}`,
  `DROP TABLE IF EXISTS ${TABLES.HEALTH_ENTRIES}`,
  `DROP TABLE IF EXISTS ${TABLES.PETS}`,
  `DROP TABLE IF EXISTS ${TABLES.USERS}`
]; 