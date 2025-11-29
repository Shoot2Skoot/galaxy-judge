import { useState, useEffect } from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import { hasStoredGame } from './utils/storage';
import CaseDisplay from './components/CaseDisplay';
import JudgmentInterface from './components/JudgmentInterface';
import RetirementSummary from './components/RetirementSummary';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  const {
    currentYear,
    currentCase,
    pastCases,
    isRetired,
    retirementSummary,
    isLoading,
    error,
    renderVerdict,
    retire,
    newGame,
  } = useGameState();

  // Check for saved game on mount
  useEffect(() => {
    setHasSavedGame(hasStoredGame());
  }, []);

  // Title screen
  if (!hasStarted) {
    const buttonText = hasSavedGame ? 'CONTINUE SERVICE' : 'BEGIN SERVICE';
    const statusText = hasSavedGame
      ? `RESUMING YEAR ${currentYear} | ${pastCases.length} CASES JUDGED`
      : 'NEW ASSIGNMENT';

    return (
      <div className="app">
        <div className="scanline-overlay" />
        <div className="title-screen">
          <div className="title-box">
            <div className="title-header">
              <div className="game-title">MAGISTRATE</div>
              <div className="game-subtitle">STATION AUTHORITY TERMINAL v2.7.4</div>
            </div>
            <div className="title-content">
              <p>
                You are a Magistrate on a space station in a dystopian future. Resources are scarce.
                Law is whatever you say it is.
              </p>
              <p>
                Your job is to judge prisoners—one per year—with incomplete information and
                irreversible consequences.
              </p>
              <p>You never have all the facts. You decide anyway.</p>
              <p>You only learn how you did when you retire.</p>
            </div>
            <div className="title-actions">
              <div className="title-status">{statusText}</div>
              <button className="start-button" onClick={() => setHasStarted(true)}>
                &gt;&gt;&gt; {buttonText}
              </button>
              {hasSavedGame && (
                <button
                  className="new-game-button-title"
                  onClick={() => {
                    newGame();
                    setHasSavedGame(false);
                  }}
                >
                  START NEW CAREER
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app">
        <div className="scanline-overlay" />
        <div className="error-screen">
          <div className="error-box">
            <div className="error-header">SYSTEM ERROR</div>
            <div className="error-content">
              <p>{error}</p>
              <p style={{ marginTop: '16px', fontSize: '11px', color: '#666' }}>
                Check that your VITE_OPENAI_API_KEY is set in .env file.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Retirement summary
  if (isRetired && retirementSummary) {
    return (
      <div className="app">
        <div className="scanline-overlay" />
        <RetirementSummary
          summary={retirementSummary}
          onNewGame={() => {
            newGame();
            setHasStarted(false);
          }}
        />
      </div>
    );
  }

  // Loading state
  if (isLoading || !currentCase) {
    return (
      <div className="app">
        <div className="scanline-overlay" />
        <LoadingScreen message="LOADING CASE DATA" />
      </div>
    );
  }

  // Main game view
  return (
    <div className="app">
      <div className="scanline-overlay" />
      <div className="game-container">
        <div className="game-header">
          <div className="game-header-title">MAGISTRATE</div>
          <div className="game-header-subtitle">JUDICIAL TERMINAL - STATION AUTHORITY</div>
        </div>

        <CaseDisplay caseData={currentCase} year={currentYear} />

        <JudgmentInterface
          onVerdict={renderVerdict}
          onRetire={retire}
          year={currentYear}
          casesJudged={pastCases.length}
        />
      </div>
    </div>
  );
}

export default App;
