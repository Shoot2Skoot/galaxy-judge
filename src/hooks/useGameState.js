import { useState, useEffect, useRef } from 'react';
import { generateCase, generateRetirementSummary } from '../services/openai';
import { saveGameState, loadGameState, clearGameState } from '../utils/storage';

const CASE_TRANSITION_DELAY = 625; // 0.625 seconds artificial delay

export function useGameState() {
  const [gameState, setGameState] = useState(() => {
    // Try to load saved game state on initial mount
    const saved = loadGameState();
    if (saved) {
      return {
        ...saved,
        isLoading: false,
        error: null,
      };
    }
    return {
      currentYear: 1,
      currentCase: null,
      nextCase: null, // Pre-loaded next case
      pastCases: [],
      isRetired: false,
      retirementSummary: null,
      isLoading: false,
      error: null,
      endYear: Math.floor(Math.random() * (55 - 15 + 1)) + 15, // Random 15-55
      forcedOutcome: null, // 'retired', 'died', or 'ousted'
    };
  });

  const hasLoadedInitialCase = useRef(false);
  const isLoadingNext = useRef(false);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    if (gameState.currentCase || gameState.pastCases.length > 0) {
      saveGameState(gameState);
    }
  }, [gameState]);

  // Load initial case
  useEffect(() => {
    if (!hasLoadedInitialCase.current && !gameState.currentCase && !gameState.isRetired && !gameState.isLoading) {
      hasLoadedInitialCase.current = true;
      loadInitialCases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentCase, gameState.isRetired, gameState.isLoading]);

  // Pre-load next case whenever current case is set and no next case exists
  useEffect(() => {
    if (gameState.currentCase && !gameState.nextCase && !isLoadingNext.current && !gameState.isRetired) {
      loadNextCaseInBackground();
    }
  }, [gameState.currentCase, gameState.nextCase, gameState.isRetired]);

  async function loadInitialCases() {
    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const currentCase = await generateCase([], 1);
      setGameState(prev => ({
        ...prev,
        currentCase,
        isLoading: false,
      }));
      // Next case will be loaded by the useEffect above
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }

  async function loadNextCaseInBackground() {
    isLoadingNext.current = true;

    try {
      const nextYear = gameState.currentYear + 1;
      const nextCase = await generateCase(gameState.pastCases, nextYear);
      setGameState(prev => ({
        ...prev,
        nextCase,
      }));
    } catch (error) {
      console.error('Error pre-loading next case:', error);
      // Don't show error to user for background loading
    } finally {
      isLoadingNext.current = false;
    }
  }

  function renderVerdict(verdict) {
    if (!gameState.currentCase) return;

    const caseWithVerdict = {
      ...gameState.currentCase,
      verdict,
      // wasGuilty is already set by the case generation AI
    };

    const newPastCases = [...gameState.pastCases, caseWithVerdict];
    const nextYear = gameState.currentYear + 1;

    // Check if player has reached their end year
    if (nextYear >= gameState.endYear) {
      // Force retirement with random outcome
      const outcomes = ['retired', 'died', 'ousted'];
      const forcedOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

      // Show loading screen with artificial delay for pacing
      setGameState(prev => ({
        ...prev,
        pastCases: newPastCases,
        currentCase: null,
        isLoading: true,
      }));

      // Wait for delay, then trigger forced retirement
      setTimeout(() => {
        forceRetirement(forcedOutcome);
      }, CASE_TRANSITION_DELAY);

      return;
    }

    // Show loading screen with artificial delay for pacing
    setGameState(prev => ({
      ...prev,
      pastCases: newPastCases,
      currentCase: null,
      isLoading: true,
    }));

    // Wait for delay, then show next case
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        currentCase: prev.nextCase, // Use pre-loaded case
        nextCase: null, // Clear it so a new one gets loaded
        currentYear: nextYear,
        isLoading: !prev.nextCase, // Continue loading only if no pre-loaded case
      }));

      // If no pre-loaded case was available, load one now
      if (!gameState.nextCase) {
        loadFallbackCase();
      }
    }, CASE_TRANSITION_DELAY);
  }

  async function loadFallbackCase() {
    try {
      const newCase = await generateCase(gameState.pastCases, gameState.currentYear);
      setGameState(prev => ({
        ...prev,
        currentCase: newCase,
        isLoading: false,
      }));
    } catch (error) {
      setGameState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
    }
  }

  async function retire() {
    console.log('Retire function called');
    console.log('Past cases:', gameState.pastCases);

    // Show loading state and set retired flag
    setGameState(prev => ({
      ...prev,
      isRetired: true,
      isLoading: true,
      currentCase: null,
      forcedOutcome: 'retired', // Voluntary retirement
    }));

    try {
      console.log('Calling generateRetirementSummary...');
      const summary = await generateRetirementSummary(gameState.pastCases, 'retired');
      console.log('Summary received:', summary);

      setGameState(prev => ({
        ...prev,
        retirementSummary: summary,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error generating retirement summary:', error);
      setGameState(prev => ({
        ...prev,
        error: 'Failed to generate retirement summary',
        isLoading: false,
      }));
    }
  }

  async function forceRetirement(outcome) {
    console.log('Force retirement:', outcome);
    console.log('Past cases:', gameState.pastCases);

    // Show loading state and set retired flag
    setGameState(prev => ({
      ...prev,
      isRetired: true,
      isLoading: true,
      currentCase: null,
      forcedOutcome: outcome,
    }));

    try {
      console.log('Calling generateRetirementSummary with outcome:', outcome);
      const summary = await generateRetirementSummary(gameState.pastCases, outcome);
      console.log('Summary received:', summary);

      setGameState(prev => ({
        ...prev,
        retirementSummary: summary,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error generating retirement summary:', error);
      setGameState(prev => ({
        ...prev,
        error: 'Failed to generate retirement summary',
        isLoading: false,
      }));
    }
  }

  function newGame() {
    hasLoadedInitialCase.current = false;
    isLoadingNext.current = false;
    clearGameState(); // Clear localStorage
    setGameState({
      currentYear: 1,
      currentCase: null,
      nextCase: null,
      pastCases: [],
      isRetired: false,
      retirementSummary: null,
      isLoading: false,
      error: null,
      endYear: Math.floor(Math.random() * (55 - 15 + 1)) + 15, // Random 15-55
      forcedOutcome: null,
    });
  }

  return {
    ...gameState,
    renderVerdict,
    retire,
    newGame,
  };
}
