import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testBasicImports = async () => {
    addResult('=== BASIC IMPORT TEST ===');
    try {
      addResult('Testing imports...');
      
      // Test 1: Import database service
      const { databaseService } = await import('../database/DatabaseService');
      addResult('✅ DatabaseService imported successfully');
      
      // Test 2: Import Supabase service
      const { supabaseService } = await import('../database/SupabaseService');
      addResult('✅ SupabaseService imported successfully');
      
      // Test 3: Check if services are instantiated
      if (databaseService) {
        addResult('✅ DatabaseService instance exists');
      } else {
        addResult('❌ DatabaseService instance is null');
      }
      
      if (supabaseService) {
        addResult('✅ SupabaseService instance exists');
      } else {
        addResult('❌ SupabaseService instance is null');
      }
      
      addResult('✅ Basic import test completed!');
      
    } catch (error) {
      addResult(`❌ Import test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addResult(`Error details: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    }
  };

  const testPlatformCompatibility = async () => {
    addResult('=== PLATFORM COMPATIBILITY TEST ===');
    addResult(`Current platform: ${Platform.OS}`);
    addResult(`Platform version: ${Platform.Version}`);
    
    if (Platform.OS === 'web') {
      addResult('⚠️  Testing on WEB platform');
      addResult('💡 SQLite has limited support on web');
      addResult('💡 Consider testing on iOS/Android for full functionality');
      
      // Test web storage as alternative
      try {
        addResult('Testing web localStorage...');
        localStorage.setItem('test', 'value');
        const testValue = localStorage.getItem('test');
        if (testValue === 'value') {
          addResult('✅ Web localStorage works');
        } else {
          addResult('❌ Web localStorage failed');
        }
      } catch (error) {
        addResult(`❌ Web localStorage error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      return false; // Don't proceed with SQLite tests on web
    } else {
      addResult('✅ Testing on MOBILE platform');
      addResult('✅ SQLite should work properly');
      return true; // Proceed with SQLite tests
    }
  };

  const testSimpleSQLite = async () => {
    addResult('=== SIMPLE SQLITE TEST ===');
    try {
      addResult('Testing basic SQLite functionality...');
      
      const SQLite = await import('expo-sqlite');
      addResult('✅ SQLite imported successfully');
      
      addResult('Attempting to open a simple database...');
      const testDb = await SQLite.openDatabaseAsync('test.db');
      addResult('✅ Simple database opened successfully');
      
      addResult('Testing basic query...');
      await testDb.execAsync('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)');
      addResult('✅ Basic table creation successful');
      
      await testDb.execAsync('INSERT INTO test (id, name) VALUES (1, "test")');
      addResult('✅ Basic insert successful');
      
      const result = await testDb.getAllAsync('SELECT * FROM test');
      addResult(`✅ Basic query successful, found ${result.length} rows`);
      
      await testDb.closeAsync();
      addResult('✅ Database closed successfully');
      
      addResult('✅ Simple SQLite test completed!');
      return true;
    } catch (error) {
      addResult(`❌ Simple SQLite test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addResult(`Error details: ${error instanceof Error ? error.stack : 'No stack trace'}`);
      return false;
    }
  };

  const testLocalDatabase = async () => {
    addResult('=== LOCAL DATABASE TEST ===');
    try {
      addResult('Importing database service...');
      const { databaseService } = await import('../database/DatabaseService');
      
      addResult('Checking database service properties...');
      addResult(`Database service type: ${typeof databaseService}`);
      addResult(`Has init method: ${typeof databaseService.init === 'function'}`);
      
      // Test SQLite import separately
      addResult('Testing SQLite import...');
      try {
        const SQLite = await import('expo-sqlite');
        addResult('✅ SQLite imported successfully');
        addResult(`SQLite type: ${typeof SQLite}`);
        addResult(`Has openDatabaseAsync: ${typeof SQLite.openDatabaseAsync === 'function'}`);
      } catch (sqliteError) {
        addResult(`❌ SQLite import failed: ${sqliteError instanceof Error ? sqliteError.message : 'Unknown error'}`);
        return;
      }
      
      addResult('Starting database initialization...');
      
      // Add a timeout to the init call
      const initPromise = databaseService.init();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database init timeout (10s)')), 10000)
      );
      
      await Promise.race([initPromise, timeoutPromise]);
      addResult('✅ Local database initialized successfully');

      addResult('Testing local operations...');
      const testPet = {
        id: `test_${Date.now()}`,
        name: 'Test Pet',
        type: 'Dog',
        breed: 'Test Breed',
        age: '2',
        weight: '10kg',
        color: 'Brown',
        healthScore: 85,
        lastCheckup: new Date().toISOString()
      };

      await databaseService.addPet(testPet);
      addResult('✅ Local pet added successfully');

      const pets = await databaseService.getPets();
      addResult(`✅ Retrieved ${pets.length} pets from local database`);

      addResult('✅ Local database test completed successfully!');
    } catch (error) {
      addResult(`❌ Local database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      if (error instanceof Error && error.message.includes('timeout')) {
        addResult('💡 Database initialization is hanging. This might be due to:');
        addResult('   - SQLite file permissions issue');
        addResult('   - Database file corruption');
        addResult('   - Schema creation problem');
        addResult('   - Web platform SQLite compatibility issue');
      }
      addResult(`Error details: ${error instanceof Error ? error.stack : 'No stack trace'}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    // Test basic imports first
    await testBasicImports();
    
    // Test platform compatibility
    const shouldTestSQLite = await testPlatformCompatibility();
    
    // Only test SQLite if platform supports it
    if (shouldTestSQLite) {
      // Test simple SQLite functionality
      const sqliteWorks = await testSimpleSQLite();
      
      // Only test full database if simple SQLite works
      if (sqliteWorks) {
        await testLocalDatabase();
      }
    } else {
      addResult('⏭️  Skipping SQLite tests on web platform');
      addResult('💡 To test SQLite functionality, please use:');
      addResult('   - iOS Simulator (press "i" in terminal)');
      addResult('   - Android Emulator (press "a" in terminal)');
      addResult('   - Physical device with Expo Go app');
    }
    
    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Connection Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={runAllTests}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
        <Text style={styles.clearButtonText}>Clear Results</Text>
      </TouchableOpacity>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  clearButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
}); 