/**
 * localStorage utilities for game persistence
 */

const STORAGE_KEY = 'magistrate_game_state';

export function saveGameState(gameState) {
  try {
    const serialized = JSON.stringify({
      currentYear: gameState.currentYear,
      currentCase: gameState.currentCase,
      nextCase: gameState.nextCase,
      pastCases: gameState.pastCases,
      isRetired: gameState.isRetired,
      retirementSummary: gameState.retirementSummary,
      timestamp: Date.now(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

export function loadGameState() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;

    const data = JSON.parse(serialized);

    // Optional: Check if save is too old (e.g., 30 days)
    const age = Date.now() - (data.timestamp || 0);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    if (age > maxAge) {
      clearGameState();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}

export function hasStoredGame() {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
