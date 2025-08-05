import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES, CREATE_INDEXES, DROP_TABLES } from '../database/schema';
import { Pet, HealthEntry, User, SyncQueue, TableName, TABLES } from './types';

// Define database name (adjust this to match your actual database name)
const DATABASE_NAME = 'petcare.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    // If already initialized, return immediately
    if (this.isInitialized) return;
    
    // If initialization is in progress, wait for it
    if (this.initPromise) return this.initPromise;

    // Start initialization
    this.initPromise = this.performInit();
    return this.initPromise;
  }

  private async performInit(): Promise<void> {
    try {
      console.log('Starting database initialization...');
      this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await this.createTables();
      await this.createIndexes();
      await this.runMigrations();
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Reset promises so retry is possible
      this.initPromise = null;
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    for (const [tableName, createSQL] of Object.entries(CREATE_TABLES)) {
      try {
        await this.db.execAsync(createSQL);
        console.log(`Created table: ${tableName}`);
      } catch (error) {
        console.error(`Failed to create table ${tableName}:`, error);
        throw error;
      }
    }
  }

  private async createIndexes(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    for (const indexSQL of CREATE_INDEXES) {
      try {
        await this.db.execAsync(indexSQL);
      } catch (error) {
        console.error('Failed to create index:', error);
        // Don't throw here as indexes are not critical
      }
    }
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Check if weightUnit column exists
      const checkWeightUnit = await this.db.getFirstAsync(`
        SELECT name FROM pragma_table_info('pets') WHERE name = 'weightUnit'
      `);
      
      if (!checkWeightUnit) {
        console.log('Adding weightUnit column to pets table...');
        await this.db.execAsync(`ALTER TABLE pets ADD COLUMN weightUnit TEXT`);
      }

      // Check if gender column exists
      const checkGender = await this.db.getFirstAsync(`
        SELECT name FROM pragma_table_info('pets') WHERE name = 'gender'
      `);
      
      if (!checkGender) {
        console.log('Adding gender column to pets table...');
        await this.db.execAsync(`ALTER TABLE pets ADD COLUMN gender TEXT`);
      }

      // Check if ageUnit column exists
      const checkAgeUnit = await this.db.getFirstAsync(`
        SELECT name FROM pragma_table_info('pets') WHERE name = 'ageUnit'
      `);
      
      if (!checkAgeUnit) {
        console.log('Adding ageUnit column to pets table...');
        await this.db.execAsync(`ALTER TABLE pets ADD COLUMN ageUnit TEXT`);
      }

      console.log('Database migrations completed successfully');
    } catch (error) {
      console.error('Failed to run migrations:', error);
      // Don't throw here as migrations should be non-critical
    }
  }

  async resetDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    for (const dropSQL of DROP_TABLES) {
      await this.db.execAsync(dropSQL);
    }
    await this.createTables();
    await this.createIndexes();
  }

  // Pet operations
  async addPet(pet: Omit<Pet, 'createdAt' | 'updatedAt' | 'syncedToCloud'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const sql = `
      INSERT INTO ${TABLES.PETS} 
      (id, name, type, breed, age, ageUnit, weight, weightUnit, gender, color, microchipId, dateOfBirth, ownerNotes, image, healthScore, lastCheckup, createdAt, updatedAt, syncedToCloud)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;
    
    await this.db.runAsync(sql, [
      pet.id || '',
      pet.name || '',
      pet.type || '',
      pet.breed || '',
      pet.age || '',
      pet.ageUnit || '',
      pet.weight || '',
      pet.weightUnit || '',
      pet.gender || '',
      pet.color || '',
      pet.microchipId || null,
      pet.dateOfBirth || null,
      pet.ownerNotes || '',
      pet.image || null, // This was the main culprit - undefined image
      pet.healthScore ?? 0, // Use nullish coalescing for numbers
      pet.lastCheckup || '',
      now,
      now
    ]);
  }

  async updatePet(pet: Partial<Pet> & { id: string }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const fields = Object.keys(pet).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const sql = `
      UPDATE ${TABLES.PETS} 
      SET ${setClause}, updatedAt = ?, syncedToCloud = 0
      WHERE id = ?
    `;
    
    // Handle undefined values in partial updates
    const values = [
      ...fields.map(field => {
        const value = pet[field as keyof Pet];
        // Handle different types appropriately
        if (value === undefined) {
          return null;
        }
        // For string fields, convert empty to null if preferred, or keep as is
        return value;
      }),
      now,
      pet.id
    ];
    
    await this.db.runAsync(sql, values);
  }

  async getPets(): Promise<Pet[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<Pet>(`
      SELECT * FROM ${TABLES.PETS} 
      ORDER BY createdAt DESC
    `);
    return result || [];
  }

  async getPetById(id: string): Promise<Pet | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<Pet>(`
      SELECT * FROM ${TABLES.PETS} 
      WHERE id = ?
    `, [id || '']);
    return result || null;
  }

  async deletePet(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`
      DELETE FROM ${TABLES.PETS} 
      WHERE id = ?
    `, [id || '']);
  }

  // Health entry operations
  async addHealthEntry(entry: Omit<HealthEntry, 'createdAt' | 'syncedToCloud'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `
      INSERT INTO ${TABLES.HEALTH_ENTRIES}
      (id, petId, type, title, description, date, time, severity, notes, createdAt, syncedToCloud)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 0)
    `;
    
    await this.db.runAsync(sql, [
      entry.id || '',
      entry.petId || '',
      entry.type || '',
      entry.title || '',
      entry.description || '',
      entry.date || null,
      entry.time || null,
      entry.severity || null,
      entry.notes || ''
    ]);
  }

  async getHealthEntries(petId?: string): Promise<HealthEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    let sql = `SELECT * FROM ${TABLES.HEALTH_ENTRIES}`;
    const params: (string | null)[] = [];

    if (petId) {
      sql += ` WHERE petId = ?`;
      params.push(petId);
    }

    sql += ` ORDER BY date DESC, createdAt DESC`;

    const result = await this.db.getAllAsync<HealthEntry>(sql, params);
    return result || [];
  }

  async getHealthEntryById(id: string): Promise<HealthEntry | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<HealthEntry>(`
      SELECT * FROM ${TABLES.HEALTH_ENTRIES} 
      WHERE id = ?
    `, [id || '']);
    return result || null;
  }

  async updateHealthEntry(entry: HealthEntry): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `
      UPDATE ${TABLES.HEALTH_ENTRIES}
      SET petId = ?, type = ?, title = ?, description = ?, date = ?, time = ?, severity = ?, notes = ?
      WHERE id = ?
    `;
    
    await this.db.runAsync(sql, [
      entry.petId || '',
      entry.type || '',
      entry.title || '',
      entry.description || '',
      entry.date || null,
      entry.time || null,
      entry.severity || null,
      entry.notes || '',
      entry.id || ''
    ]);
  }

  async deleteHealthEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`
      DELETE FROM ${TABLES.HEALTH_ENTRIES} 
      WHERE id = ?
    `, [id || '']);
  }

  // User operations
  async addUser(user: Omit<User, 'createdAt' | 'updatedAt' | 'syncedToCloud'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const sql = `
      INSERT INTO ${TABLES.USERS} 
      (id, userName, userEmail, profileImage, avatarInitials, memberSince, createdAt, updatedAt, syncedToCloud)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;
    
    await this.db.runAsync(sql, [
      user.id || '',
      user.userName || '',
      user.userEmail || '',
      user.profileImage || null,
      user.avatarInitials || '',
      user.memberSince || null,
      now,
      now
    ]);
  }

  async updateUser(user: Partial<User> & { id: string }): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const fields = Object.keys(user).filter(key => key !== 'id');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const sql = `
      UPDATE ${TABLES.USERS} 
      SET ${setClause}, updatedAt = ?, syncedToCloud = 0
      WHERE id = ?
    `;
    
    // Handle undefined values in partial updates
    const values = [
      ...fields.map(field => {
        const value = user[field as keyof User];
        return value === undefined ? null : value;
      }),
      now,
      user.id || ''
    ];
    
    await this.db.runAsync(sql, values);
  }

  async getUser(): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<User>(`
      SELECT * FROM ${TABLES.USERS} 
      LIMIT 1
    `);
    return result || null;
  }

  // Sync queue operations
  async addToSyncQueue(tableName: TableName, recordId: string, operation: 'INSERT' | 'UPDATE' | 'DELETE', data?: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const sql = `
      INSERT INTO ${TABLES.SYNC_QUEUE}
      (id, tableName, recordId, operation, data, createdAt, synced)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 0)
    `;
    
    await this.db.runAsync(sql, [
      `${tableName || ''}_${recordId || ''}_${Date.now()}`,
      tableName || '',
      recordId || '',
      operation || 'INSERT',
      data ? JSON.stringify(data) : null
    ]);
  }

  async getUnsyncedItems(): Promise<SyncQueue[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync<SyncQueue>(`
      SELECT * FROM ${TABLES.SYNC_QUEUE} 
      WHERE synced = 0 
      ORDER BY createdAt ASC
    `);
    return result || [];
  }

  async markAsSynced(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`
      UPDATE ${TABLES.SYNC_QUEUE} 
      SET synced = 1 
      WHERE id = ?
    `, [id || '']);
  }

  async markTableAsSynced(tableName: TableName, recordId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(`
      UPDATE ${tableName} 
      SET syncedToCloud = 1 
      WHERE id = ?
    `, [recordId || '']);
  }

  // Utility methods
  async getUnsyncedRecords(tableName: TableName): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(`
      SELECT * FROM ${tableName} 
      WHERE syncedToCloud = 0 
      ORDER BY createdAt ASC
    `);
    return result || [];
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
    }
  }
}

export const databaseService = new DatabaseService();