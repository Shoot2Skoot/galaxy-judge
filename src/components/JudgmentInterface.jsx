import { useState } from 'react';
import Panel from './Panel';
import TabButton from './TabButton';

export default function JudgmentInterface({ onVerdict, onRetire, year, casesJudged }) {
  const [selectedVerdict, setSelectedVerdict] = useState(null);

  const handleVerdictSelect = (verdict) => {
    setSelectedVerdict(verdict);
  };

  const handleConfirm = () => {
    if (selectedVerdict) {
      onVerdict(selectedVerdict);
      setSelectedVerdict(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <Panel title="RENDER VERDICT">
        <div className="mt-4">
          {/* Stats */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-term-dim/30 text-xs">
            <span className="text-term-dim uppercase tracking-wider">Cases Judged: {casesJudged}</span>
            <span className="text-term-dim uppercase tracking-wider">Year: {year}</span>
          </div>

          {/* Verdict Tabs */}
          <div className="flex gap-2 mb-6">
            <TabButton
              label="RELEASE"
              isActive={selectedVerdict === 'release'}
              onClick={() => handleVerdictSelect('release')}
            />
            <TabButton
              label="DETAIN"
              isActive={selectedVerdict === 'detain'}
              onClick={() => handleVerdictSelect('detain')}
            />
            <TabButton
              label="AIRLOCK"
              isActive={selectedVerdict === 'airlock'}
              onClick={() => handleVerdictSelect('airlock')}
            />
          </div>

          {/* Verdict Description */}
          {selectedVerdict && (
            <div className="mb-4 p-4 bg-term-green/5 border border-term-green/20">
              {selectedVerdict === 'release' && (
                <>
                  <div className="text-sm font-bold text-term-green mb-1 uppercase tracking-wider">[R] RELEASE</div>
                  <div className="text-xs text-term-green/70">Return to station population</div>
                </>
              )}
              {selectedVerdict === 'detain' && (
                <>
                  <div className="text-sm font-bold text-term-green mb-1 uppercase tracking-wider">[D] DETAIN</div>
                  <div className="text-xs text-term-green/70">Cryo / Isolation / Labor</div>
                </>
              )}
              {selectedVerdict === 'airlock' && (
                <>
                  <div className="text-sm font-bold text-term-green mb-1 uppercase tracking-wider">[X] AIRLOCK</div>
                  <div className="text-xs text-term-green/70">Terminal sentence</div>
                </>
              )}
            </div>
          )}

          {/* Confirm Button */}
          <button
            className={`w-full py-3 border-2 text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-200 ${
              selectedVerdict
                ? 'bg-term-green/10 border-term-green text-term-green hover:bg-term-green/20 hover:shadow-[0_0_15px_rgba(163,230,170,0.3)]'
                : 'bg-black/40 border-term-dim/40 text-term-dim cursor-not-allowed'
            }`}
            onClick={handleConfirm}
            disabled={!selectedVerdict}
          >
            {selectedVerdict ? '>>> CONFIRM VERDICT' : 'SELECT VERDICT TO CONTINUE'}
          </button>
        </div>
      </Panel>

      {/* Retirement */}
      <button
        className="w-full py-2 bg-black/60 border border-term-dim/40 text-term-dim hover:text-term-green/70 hover:border-term-green/50 transition-all duration-200 text-xs md:text-sm font-bold tracking-widest uppercase"
        onClick={onRetire}
      >
        <span className="mr-2">///</span>
        RETIRE FROM SERVICE
      </button>
    </div>
  );
}
