import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG, SUPABASE_TABLES } from '../config/supabase';
import { Pet, HealthEntry, User, SyncQueue } from '../types/database';
import { databaseService } from './DatabaseService';

class SupabaseService {
  private client: SupabaseClient;
  private isInitialized = false;

  constructor() {
    this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if we can connect to Supabase
      const { data, error } = await this.client.from('users').select('count').limit(1);
      if (error && error.code !== 'PGRST116') { // PGRST116 is "table doesn't exist" which is expected
        throw error;
      }
      
      this.isInitialized = true;
      console.log('Supabase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase:', error);
      throw error;
    }
  }

  // Authentication methods
  async signUp(email: string, password: string, userData: Partial<User>): Promise<{ user: any; error: any }> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { user: data.user, error };
  }

  async signIn(email: string, password: string): Promise<{ user: any; error: any }> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    return { user: data.user, error };
  }

  async signOut(): Promise<{ error: any }> {
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  async getCurrentUser(): Promise<any> {
    const { data: { user } } = await this.client.auth.getUser();
    return user;
  }

  async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await this.client.auth.resetPasswordForEmail(email);
    return { error };
  }

  // Data sync methods
  async syncToCloud(): Promise<void> {
    try {
      // Get all unsynced items from local database
      const unsyncedItems = await databaseService.getUnsyncedItems();
      
      for (const item of unsyncedItems) {
        try {
          switch (item.operation) {
            case 'INSERT':
              await this.insertRecord(item.tableName, item.recordId, JSON.parse(item.data || '{}'));
              break;
            case 'UPDATE':
              await this.updateRecord(item.tableName, item.recordId, JSON.parse(item.data || '{}'));
              break;
            case 'DELETE':
              await this.deleteRecord(item.tableName, item.recordId);
              break;
          }
          
          // Mark as synced
          await databaseService.markAsSynced(item.id);
          await databaseService.markTableAsSynced(item.tableName as any, item.recordId);
          
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Sync to cloud failed:', error);
      throw error;
    }
  }

  async syncFromCloud(): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return;

      // Sync pets
      await this.syncTableFromCloud(SUPABASE_TABLES.PETS);
      
      // Sync health entries
      await this.syncTableFromCloud(SUPABASE_TABLES.HEALTH_ENTRIES);
      
      // Sync user data
      await this.syncTableFromCloud(SUPABASE_TABLES.USERS);
      
    } catch (error) {
      console.error('Sync from cloud failed:', error);
      throw error;
    }
  }

  private async syncTableFromCloud(tableName: string): Promise<void> {
    const { data, error } = await this.client
      .from(tableName)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error(`Failed to sync ${tableName}:`, error);
      return;
    }

    if (data && data.length > 0) {
      for (const record of data) {
        try {
          // Check if record exists locally
          const existingRecord = await this.getLocalRecord(tableName, record.id);
          
          if (!existingRecord) {
            // Insert new record
            await this.insertLocalRecord(tableName, record);
          } else if (new Date(record.updated_at) > new Date(existingRecord.updatedAt)) {
            // Update existing record if cloud version is newer
            await this.updateLocalRecord(tableName, record);
          }
        } catch (error) {
          console.error(`Failed to sync record ${record.id} from ${tableName}:`, error);
        }
      }
    }
  }

  private async getLocalRecord(tableName: string, id: string): Promise<any> {
    switch (tableName) {
      case SUPABASE_TABLES.PETS:
        return await databaseService.getPetById(id);
      case SUPABASE_TABLES.HEALTH_ENTRIES:
        return await databaseService.getHealthEntryById(id);
      case SUPABASE_TABLES.USERS:
        return await databaseService.getUser();
      default:
        return null;
    }
  }

  private async insertLocalRecord(tableName: string, record: any): Promise<void> {
    switch (tableName) {
      case SUPABASE_TABLES.PETS:
        await databaseService.addPet(record);
        break;
      case SUPABASE_TABLES.HEALTH_ENTRIES:
        await databaseService.addHealthEntry(record);
        break;
      case SUPABASE_TABLES.USERS:
        await databaseService.addUser(record);
        break;
    }
  }

  private async updateLocalRecord(tableName: string, record: any): Promise<void> {
    switch (tableName) {
      case SUPABASE_TABLES.PETS:
        await databaseService.updatePet(record);
        break;
      case SUPABASE_TABLES.HEALTH_ENTRIES:
        // Note: Health entries are typically immutable, so we might not need updates
        break;
      case SUPABASE_TABLES.USERS:
        await databaseService.updateUser(record);
        break;
    }
  }

  // Cloud CRUD operations
  private async insertRecord(tableName: string, recordId: string, data: any): Promise<void> {
    const { error } = await this.client
      .from(tableName)
      .insert([{ id: recordId, ...data }]);

    if (error) throw error;
  }

  private async updateRecord(tableName: string, recordId: string, data: any): Promise<void> {
    const { error } = await this.client
      .from(tableName)
      .update(data)
      .eq('id', recordId);

    if (error) throw error;
  }

  private async deleteRecord(tableName: string, recordId: string): Promise<void> {
    const { error } = await this.client
      .from(tableName)
      .delete()
      .eq('id', recordId);

    if (error) throw error;
  }

  // Direct cloud operations (for when you need to bypass local database)
  async getPetsFromCloud(): Promise<Pet[]> {
    const { data, error } = await this.client
      .from(SUPABASE_TABLES.PETS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getHealthEntriesFromCloud(petId?: string): Promise<HealthEntry[]> {
    let query = this.client
      .from(SUPABASE_TABLES.HEALTH_ENTRIES)
      .select('*')
      .order('date', { ascending: false });

    if (petId) {
      query = query.eq('pet_id', petId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getUserFromCloud(): Promise<User | null> {
    const { data, error } = await this.client
      .from(SUPABASE_TABLES.USERS)
      .select('*')
      .limit(1)
      .single();

    if (error) throw error;
    return data || null;
  }

  // Utility methods
  async isOnline(): Promise<boolean> {
    try {
      await this.client.from('users').select('count').limit(1);
      return true;
    } catch {
      return false;
    }
  }

  async getClient(): Promise<SupabaseClient> {
    if (!this.isInitialized) {
      await this.init();
    }
    return this.client;
  }
}

export const supabaseService = new SupabaseService(); 