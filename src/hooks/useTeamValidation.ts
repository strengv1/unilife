import { useCallback } from 'react';

interface ValidationResult {
  name: string;
  isValid: boolean;
  error: string | null;
}

export function useTeamValidation(existingTeams: string[] = []) {
  // Create a set of existing team names (case-insensitive)
  const existingNamesSet = new Set(existingTeams.map(name => name.toLowerCase()));

  const validateSingleTeam = useCallback((name: string): ValidationResult => {
    const trimmed = name.trim();
    
    if (trimmed.length === 0) {
      return { name: trimmed, isValid: false, error: 'Team name cannot be empty' };
    }
    
    if (existingNamesSet.has(trimmed.toLowerCase())) {
      return { name: trimmed, isValid: false, error: 'Team name already exists' };
    }
    
    return { name: trimmed, isValid: true, error: null };
  }, [existingNamesSet]);

  const validateMultipleTeams = useCallback((names: string[]): ValidationResult[] => {
    const results: ValidationResult[] = [];
    const seenNames = new Map<string, number>();
    
    // First pass: check for empty and existing names
    names.forEach((name, index) => {
      const trimmed = name.trim();
      const lower = trimmed.toLowerCase();
      
      if (trimmed.length === 0) {
        results[index] = { name: trimmed, isValid: false, error: 'Team name cannot be empty' };
      } else if (existingNamesSet.has(lower)) {
        results[index] = { name: trimmed, isValid: false, error: 'Team name already exists' };
      } else {
        // Track occurrences for duplicate check
        seenNames.set(lower, (seenNames.get(lower) || 0) + 1);
        results[index] = { name: trimmed, isValid: true, error: null };
      }
    });
    
    // Second pass: check for duplicates within the list
    names.forEach((name, index) => {
      const trimmed = name.trim();
      const lower = trimmed.toLowerCase();
      
      if (results[index].isValid && seenNames.get(lower)! > 1) {
        results[index] = { 
          name: trimmed, 
          isValid: false, 
          error: 'Duplicate team name in list' 
        };
      }
    });
    
    return results;
  }, [existingNamesSet]);

  const getDuplicatesInfo = useCallback((names: string[]) => {
    const trimmedNames = names.map(n => n.trim()).filter(n => n.length > 0);
    const uniqueNames = new Set(trimmedNames.map(n => n.toLowerCase()));
    const duplicateCount = trimmedNames.length - uniqueNames.size;
    
    return {
      total: trimmedNames.length,
      unique: uniqueNames.size,
      duplicates: duplicateCount,
      hasDuplicates: duplicateCount > 0
    };
  }, []);

  return {
    validateSingleTeam,
    validateMultipleTeams,
    getDuplicatesInfo
  };
}