import { useState, useEffect, useCallback } from 'react';
import { databaseService } from '../database/DatabaseService';
import { HealthEntry } from '../database/types';

export interface RecentEntryData {
  id: string;
  petName: string;
  type: string;
  title: string;
  time: string;
  icon: string;
  color: string;
}

export function useHealthEntries(limit: number = 10) {
  const [recentEntries, setRecentEntries] = useState<RecentEntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the fetch function to prevent stale closures
  const fetchRecentEntries = useCallback(async () => {
    try {
      setLoading(true);
      
      // Ensure database is initialized
      await databaseService.init();
      
      const healthEntries: HealthEntry[] = await databaseService.getHealthEntries();
      
      // Log raw data for debugging
      console.log('Raw health entries from database:', healthEntries);
      
      // Sort by date (most recent first) and limit
      const sortedEntries: HealthEntry[] = healthEntries
        .sort((a, b) => {
          // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
          const dateA = a.date ? new Date(a.date.replace(/\//g, '-')).getTime() : 0;
          const dateB = b.date ? new Date(b.date.replace(/\//g, '-')).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, limit);

      // Transform to RecentEntryData format
      const transformedEntries: RecentEntryData[] = await Promise.all(
        sortedEntries.map(async (entry) => {
          try {
            // Get pet name (you might want to cache this or join in the query)
            const pets = await databaseService.getPets();
            const pet = pets.find(p => p.id === entry.petId);
            
            // Map entry type to icon
            const getIcon = (type: string) => {
              switch (type) {
                case 'medication': return 'pill';
                case 'symptom': return 'activity';
                case 'appointment': return 'calendar';
                case 'behavior': return 'activity';
                case 'vitals': return 'activity';
                case 'feeding': return 'activity';
                case 'hydration': return 'activity';
                case 'examination': return 'activity';
                default: return 'activity';
              }
            };

            // Calculate time display
            const getTimeDisplay = (entry: HealthEntry) => {
              if (!entry.date || typeof entry.date !== 'string' || entry.date.trim() === '') return 'Unknown time';
              
              // For appointments, show the scheduled date and time
              if (entry.type === 'appointment') {
                const date = new Date(entry.date.replace(/\//g, '-'));
                if (isNaN(date.getTime())) return 'Invalid date';
                
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                
                // If there's a time, include it
                if (entry.time) {
                  return `${formattedDate} at ${entry.time}`;
                }
                
                return formattedDate;
              }
              
              // For other entries, show relative time
              const now = new Date();
              // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
              const entryDate = new Date(entry.date.replace(/\//g, '-'));
              
              // Check if date is valid
              if (isNaN(entryDate.getTime())) return 'Invalid date';
              
              const diffInHours = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60));
              
              if (diffInHours < 1) return 'Just now';
              if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
              
              const diffInDays = Math.floor(diffInHours / 24);
              if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
              
              const diffInWeeks = Math.floor(diffInDays / 7);
              return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
            };

            return {
              id: entry.id || 'unknown',
              petName: pet?.name || 'Unknown Pet',
              type: (entry.type || 'unknown').charAt(0).toUpperCase() + (entry.type || 'unknown').slice(1),
              title: entry.title || 'Untitled Entry',
              time: getTimeDisplay(entry),
              icon: getIcon(entry.type || 'unknown'),
              color: '#4A5568' // Default color, you can customize based on type
            };
          } catch (transformError) {
            console.error('Error transforming entry:', entry, transformError);
            // Return a fallback entry
            return {
              id: entry.id || 'unknown',
              petName: 'Unknown Pet',
              type: 'Unknown',
              title: entry.title || 'Untitled Entry',
              time: 'Unknown time',
              icon: 'activity',
              color: '#4A5568'
            };
          }
        })
      );

      setRecentEntries(transformedEntries);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recent entries');
      console.error('Error fetching recent entries:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]); // Include limit in dependencies since it affects the query

  useEffect(() => {
    fetchRecentEntries();
  }, [fetchRecentEntries]); // Include fetchRecentEntries in dependencies

  // Now refresh uses the memoized function
  const refresh = useCallback(() => {
    fetchRecentEntries();
  }, [fetchRecentEntries]);

  return {
    recentEntries,
    loading,
    error,
    refresh
  };
}