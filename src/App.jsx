import { useState, useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import { hasStoredGame } from './utils/storage';
import TerminalFrame from './components/TerminalFrame';
import Panel from './components/Panel';
import CaseDisplay from './components/CaseDisplay';
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
    forcedOutcome,
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
      <TerminalFrame year="--">
        <Panel className="mt-4 sm:mt-8 welcome-panel">
          <div className="text-center mb-6 sm:mb-8 pt-2 sm:pt-4">
            <div className="text-4xl md:text-6xl font-bold tracking-widest text-term-green mb-2">
              MAGISTRATE
            </div>
            <div className="text-xs md:text-sm tracking-wider text-term-dim uppercase">
              Station Authority Terminal v2.7.4
            </div>
          </div>

          <div className="space-y-4 text-term-green/80 text-sm md:text-base leading-relaxed mb-6 sm:mb-8 px-1 sm:px-2">
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

          <div className="space-y-4">
            <div className="text-center text-xs tracking-widest text-term-dim uppercase border-t border-term-dim/30 pt-4">
              {statusText}
            </div>
            <button
              className="w-full py-3 bg-term-green/10 border-2 border-term-green text-term-green hover:bg-term-green/20 hover:shadow-[0_0_15px_rgba(163,230,170,0.3)] transition-all duration-200 text-sm md:text-base font-bold tracking-widest uppercase"
              onClick={() => setHasStarted(true)}
            >
              &gt;&gt;&gt; {buttonText}
            </button>
            {hasSavedGame && (
              <button
                className="w-full py-2 bg-black/40 border border-term-dim text-term-dim hover:text-term-green/70 hover:border-term-green/50 transition-all duration-200 text-xs md:text-sm font-bold tracking-widest uppercase"
                onClick={() => {
                  newGame();
                  setHasSavedGame(false);
                }}
              >
                START NEW CAREER
              </button>
            )}
          </div>
        </Panel>
      </TerminalFrame>
    );
  }

  // Error state
  if (error) {
    return (
      <TerminalFrame year="--">
        <Panel className="mt-8 border-red-500/40">
          <div className="text-center py-8">
            <div className="text-2xl md:text-4xl font-bold tracking-widest text-red-500 mb-4">
              SYSTEM ERROR
            </div>
            <div className="text-term-green/70 mb-4">
              {error}
            </div>
            <div className="text-xs text-term-dim">
              Check that your VITE_OPENAI_API_KEY is set in .env file.
            </div>
          </div>
        </Panel>
      </TerminalFrame>
    );
  }

  // Retirement summary
  if (isRetired && retirementSummary) {
    return (
      <RetirementSummary
        summary={retirementSummary}
        outcome={forcedOutcome}
        onNewGame={() => {
          newGame();
          setHasStarted(false);
        }}
      />
    );
  }

  // Loading state (including retirement summary generation)
  if (isLoading || !currentCase) {
    const message = isRetired ? "GENERATING CAREER SUMMARY" : "LOADING CASE DATA";
    return <LoadingScreen message={message} />;
  }

  // Main game view
  return (
    <TerminalFrame year={currentYear}>
      <CaseDisplay
        caseData={currentCase}
        onVerdict={renderVerdict}
        onRetire={retire}
        casesJudged={pastCases.length}
        year={currentYear}
      />
    </TerminalFrame>
  );
}

export default App;
