// Utility functions for LovingPaws

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateAvatarInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

export function formatDate(date: string | Date): string {
  // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
  const dateStr = typeof date === 'string' ? date.replace(/\//g, '-') : date;
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function formatTime(time: string): string {
  // Ensure time is in HH:MM format
  if (time.includes(':')) {
    return time.substring(0, 5);
  }
  return time;
}

export function getCurrentDate(): string {
  return formatDate(new Date());
}

export function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

export function calculateHealthScore(entries: any[]): number {
  // Simple health score calculation based on recent entries
  // This can be made more sophisticated later
  const recentEntries = entries.filter(entry => {
    // Convert YYYY/MM/DD to YYYY-MM-DD for proper date parsing
    const entryDate = new Date(entry.date.replace(/\//g, '-'));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return entryDate > thirtyDaysAgo;
  });

  let score = 100;

  // Deduct points for symptoms
  recentEntries.forEach(entry => {
    if (entry.type === 'symptom') {
      switch (entry.severity) {
        case 'Mild':
          score -= 5;
          break;
        case 'Moderate':
          score -= 15;
          break;
        case 'Severe':
          score -= 30;
          break;
        case 'Emergency':
          score -= 50;
          break;
      }
    }
  });

  // Add points for positive entries (medications, checkups)
  recentEntries.forEach(entry => {
    if (entry.type === 'medication' || entry.type === 'appointment') {
      score += 2;
    }
  });

  return Math.max(0, Math.min(100, score));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 