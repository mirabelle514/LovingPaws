import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { databaseService } from '../services/DatabaseService';
import { generateId } from '../utils/helpers';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

export function DatabaseTest() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testDatabase = async () => {
    try {
      addTestResult('Starting database test...');
      
      // Test 1: Initialize database
      await databaseService.init();
      addTestResult('✅ Database initialized');
      
      // Test 2: Add a test pet
      const testPet = {
        id: generateId(),
        name: 'Test Pet',
        type: 'Dog',
        breed: 'Test Breed',
        age: '2 years',
        weight: '50 lbs',
        color: 'Brown',
        microchipId: 'TEST123',
        dateOfBirth: '2021-01-01',
        ownerNotes: 'Test pet for database verification',
        image: undefined,
        healthScore: 100,
        lastCheckup: 'Never'
      };
      
      await databaseService.addPet(testPet);
      addTestResult('✅ Test pet added');
      
      // Test 3: Retrieve pets
      const pets = await databaseService.getPets();
      addTestResult(`✅ Retrieved ${pets.length} pets`);
      
      // Test 4: Add health entry
      const testEntry = {
        id: generateId(),
        petId: testPet.id,
        type: 'symptom' as const,
        title: 'Test Symptom',
        description: 'Test symptom for database verification',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        severity: 'Mild' as const,
        notes: 'Test notes'
      };
      
      await databaseService.addHealthEntry(testEntry);
      addTestResult('✅ Test health entry added');
      
      // Test 5: Retrieve health entries
      const entries = await databaseService.getHealthEntries(testPet.id);
      addTestResult(`✅ Retrieved ${entries.length} health entries for test pet`);
      
      // Test 6: Add to sync queue
      await databaseService.addToSyncQueue('pets', testPet.id, 'INSERT', testPet);
      addTestResult('✅ Added to sync queue');
      
      // Test 7: Get unsynced items
      const unsynced = await databaseService.getUnsyncedItems();
      addTestResult(`✅ Found ${unsynced.length} unsynced items`);
      
      addTestResult('🎉 All database tests passed!');
      
    } catch (error) {
      addTestResult(`❌ Database test failed: ${error}`);
      console.error('Database test error:', error);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const resetDatabase = async () => {
    try {
      await databaseService.resetDatabase();
      addTestResult('✅ Database reset successfully');
    } catch (error) {
      addTestResult(`❌ Database reset failed: ${error}`);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: colors.background.secondary, margin: 10, borderRadius: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: colors.text.primary }}>
        Database Test Panel
      </Text>
      
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
        <TouchableOpacity 
          style={[globalStyles.actionButtonSecondary, { flex: 1 }]} 
          onPress={testDatabase}
        >
          <Text style={globalStyles.actionButtonSecondaryText}>Run Tests</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[globalStyles.actionButtonSecondary, { flex: 1 }]} 
          onPress={resetDatabase}
        >
          <Text style={globalStyles.actionButtonSecondaryText}>Reset DB</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[globalStyles.actionButtonSecondary, { flex: 1 }]} 
          onPress={clearTestResults}
        >
          <Text style={globalStyles.actionButtonSecondaryText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ maxHeight: 200 }}>
        {testResults.map((result, index) => (
          <Text key={index} style={{ fontSize: 12, marginBottom: 2, color: colors.text.secondary }}>
            {result}
          </Text>
        ))}
      </View>
    </View>
  );
} 