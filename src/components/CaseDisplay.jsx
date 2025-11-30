import { useState } from 'react';
import { Quotes, Detective, ShieldStar, SealQuestion, Gavel, DoorOpen, HourglassHigh, Skull } from '@phosphor-icons/react';
import Panel from './Panel';
import DataRow from './DataRow';
import TabButton from './TabButton';

export default function CaseDisplay({ caseData, onVerdict, onRetire, casesJudged, year }) {
  const [activeTab, setActiveTab] = useState('charges');
  const [selectedVerdict, setSelectedVerdict] = useState(null);
  const [showRetireModal, setShowRetireModal] = useState(false);

  // Convert evidence to arrays if needed
  const prosecutionEvidence = Array.isArray(caseData.prosecutionEvidence)
    ? caseData.prosecutionEvidence
    : [caseData.prosecutionEvidence];
  const defenseArguments = Array.isArray(caseData.defenseArgument)
    ? caseData.defenseArgument
    : [caseData.defenseArgument];
  const informationGaps = Array.isArray(caseData.informationGaps)
    ? caseData.informationGaps
    : [caseData.informationGaps];

  const handleVerdictSelect = (verdict) => {
    setSelectedVerdict(verdict);
  };

  const handleConfirm = () => {
    if (selectedVerdict && onVerdict) {
      onVerdict(selectedVerdict);
      setSelectedVerdict(null);
    }
  };

  const handleRetire = () => {
    setShowRetireModal(true);
  };

  const confirmRetire = () => {
    setShowRetireModal(false);
    onRetire();
  };

  const cancelRetire = () => {
    setShowRetireModal(false);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full flex-1 min-h-0 overflow-auto">

      {/* Status Section */}
      <Panel className="w-full">
        <div className="flex flex-col gap-2">
          {/* Mobile Layout */}
          <div className="flex md:hidden items-start mb-1">
            <div className="text-lg font-bold uppercase tracking-wider">
              <span className="text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">{caseData.prisonerName}</span>
              <span className="text-term-dim"> - #{String(caseData.id).slice(0, 8)}</span>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-center items-baseline mb-1">
            <h2 className="text-xl font-bold text-term-green/90 uppercase tracking-wider">
              <span className="text-term-dim mr-2">CASE #{String(caseData.id).slice(0, 8)}</span>
              <span className="text-term-dim mx-2">|</span>
              <span className="text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.8)] mx-2">{caseData.prisonerName}</span>
              <span className="text-term-dim mx-2">|</span>
              <span className="text-term-dim">AWAITING JUDGMENT</span>
            </h2>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-term-dim/20 border border-term-dim/40 p-0.5 relative">
            <div className="h-full w-3/4 bg-term-green/60 shadow-[0_0_10px_rgba(163,230,170,0.4)]"></div>
          </div>
        </div>
      </Panel>

      {/* Identity Section */}
      <Panel title="Accused Identity">
        <div className="flex flex-col border border-term-dim/30 bg-black/20">
          <DataRow label="Age" value={caseData.age} />
          <DataRow label="Gender" value={caseData.gender} />
          <DataRow label="Station Role" mobileLabel="Role" value={caseData.role} />
        </div>
      </Panel>

      {/* Tabbed Content */}
      <div className="w-full flex flex-col">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-1 flex-shrink-0">
          <TabButton
            label="Charges"
            icon={Quotes}
            isActive={activeTab === 'charges'}
            onClick={() => setActiveTab('charges')}
            activeColor="blue"
          />
          <TabButton
            label="Prosecution"
            icon={Detective}
            isActive={activeTab === 'prosecution'}
            onClick={() => setActiveTab('prosecution')}
            activeColor="red"
          />
          <TabButton
            label="Defense"
            icon={ShieldStar}
            isActive={activeTab === 'defense'}
            onClick={() => setActiveTab('defense')}
            activeColor="green"
          />
          <TabButton
            label="Info Gaps"
            icon={SealQuestion}
            isActive={activeTab === 'gaps'}
            onClick={() => setActiveTab('gaps')}
            activeColor="orange"
          />
          <TabButton
            label="Render Verdict"
            icon={Gavel}
            isActive={activeTab === 'verdict'}
            onClick={() => setActiveTab('verdict')}
            activeColor="white"
          />
        </div>

        {/* Tab Content */}
        <Panel
          className="w-full border-t-0"
          title={
            activeTab === 'charges' ? 'Charges' :
            activeTab === 'prosecution' ? 'Prosecution' :
            activeTab === 'defense' ? 'Defense' :
            activeTab === 'gaps' ? 'Information Gaps' :
            'Render Verdict'
          }
          showTopLeft={activeTab === 'charges'}
          showTopRight={activeTab === 'verdict'}
        >
          {activeTab === 'charges' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-2">Accused Crime:</h3>
                <div className="text-white text-lg md:text-xl tracking-wide leading-relaxed border-l-2 border-blue-500 pl-4 py-2">
                  {caseData.crime}
                </div>
              </div>

              {caseData.crimeSeverity && (
                <div>
                  <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-2">Severity Assessment:</h3>
                  <div className="text-term-green/80 text-base md:text-lg leading-relaxed border-l-2 border-term-dim pl-4">
                    {caseData.crimeSeverity}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prosecution' && (
            <div className="space-y-4">
              {prosecutionEvidence.map((evidence, index) => (
                <div key={index} className="border-l-2 border-red-500 pl-4 py-2">
                  <div className="text-white text-base md:text-lg leading-relaxed">
                    {evidence}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'defense' && (
            <div className="space-y-4">
              {defenseArguments.map((argument, index) => (
                <div key={index} className="border-l-2 border-green-500 pl-4 py-2">
                  <div className="text-white text-base md:text-lg leading-relaxed">
                    {argument}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gaps' && (
            <div className="space-y-4">
              {informationGaps.map((gap, index) => (
                <div key={index} className="border-l-2 border-orange-500 pl-4 py-2">
                  <div className="text-white text-base md:text-lg leading-relaxed">
                    {gap}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'verdict' && (
            <div>
              {/* Accused's Statement */}
              {caseData.accusedStatement && (
                <div className="mb-6">
                  <div className="text-term-dim text-xs uppercase tracking-wider mb-2">Statement from the Accused:</div>
                  <div className="relative bg-term-panel/80 border border-term-dim/40 p-4 rounded-sm">
                    {/* Speech bubble tail */}
                    <div className="absolute -left-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-term-dim/40 border-b-8 border-b-transparent"></div>
                    <div className="absolute -left-1.5 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-term-panel/80 border-b-8 border-b-transparent"></div>

                    <p className="text-white text-base md:text-lg leading-relaxed italic">
                      "{caseData.accusedStatement}"
                    </p>
                  </div>
                </div>
              )}

              {/* Verdict Buttons */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => handleVerdictSelect('release')}
                  className={`flex-1 py-3 border-2 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-200 flex flex-col md:flex-row items-center justify-center gap-2 ${
                    selectedVerdict === 'release'
                      ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : 'bg-green-500/5 border-green-500/40 text-green-500/70 hover:bg-green-500/10 hover:border-green-500/60 active:bg-green-500/15 active:border-green-500/80'
                  }`}
                >
                  <DoorOpen size={24} weight="duotone" />
                  <span>RELEASE</span>
                </button>
                <button
                  onClick={() => handleVerdictSelect('detain')}
                  className={`flex-1 py-3 border-2 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-200 flex flex-col md:flex-row items-center justify-center gap-2 ${
                    selectedVerdict === 'detain'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                      : 'bg-orange-500/5 border-orange-500/40 text-orange-500/70 hover:bg-orange-500/10 hover:border-orange-500/60 active:bg-orange-500/15 active:border-orange-500/80'
                  }`}
                >
                  <HourglassHigh size={24} weight="duotone" />
                  <span>DETAIN</span>
                </button>
                <button
                  onClick={() => handleVerdictSelect('airlock')}
                  className={`flex-1 py-3 border-2 text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-200 flex flex-col md:flex-row items-center justify-center gap-2 ${
                    selectedVerdict === 'airlock'
                      ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      : 'bg-red-500/5 border-red-500/40 text-red-500/70 hover:bg-red-500/10 hover:border-red-500/60 active:bg-red-500/15 active:border-red-500/80'
                  }`}
                >
                  <Skull size={24} weight="duotone" />
                  <span>AIRLOCK</span>
                </button>
              </div>

              {/* Confirm Button */}
              {selectedVerdict ? (
                <button
                  className="w-full py-3 border-2 bg-term-green/10 border-term-green text-term-green shadow-[0_0_15px_rgba(163,230,170,0.3)] text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-200 hover:bg-term-green/20 active:bg-term-green/30"
                  onClick={handleConfirm}
                >
                  &gt;&gt;&gt; CONFIRM VERDICT
                </button>
              ) : (
                <div className="text-center text-term-dim text-xs md:text-sm uppercase tracking-wider py-3">
                  Select verdict to continue
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>

      {/* Retirement Panel */}
      <Panel>
        <div className="flex flex-col gap-3">
          {/* Stats */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-term-dim uppercase tracking-wider">Cases Judged: {casesJudged}</span>
            <span className="text-term-dim uppercase tracking-wider">Year: {year}</span>
          </div>

          {/* Retirement Button */}
          <button
            className="w-full py-2 bg-black/60 border border-term-dim/40 text-term-dim transition-all duration-200 text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-term-dim/10 hover:border-term-dim/60 active:bg-term-dim/20 active:border-term-dim"
            onClick={handleRetire}
          >
            <span className="mr-2">///</span>
            RETIRE FROM SERVICE
          </button>
        </div>
      </Panel>

      {/* Retirement Confirmation Modal */}
      {showRetireModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-term-dark border-2 border-term-green shadow-[0_0_30px_rgba(163,230,170,0.3)] max-w-md w-full">
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-term-green"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-term-green"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-term-green"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-term-green"></div>

            <div className="p-6">
              {/* Header */}
              <div className="text-term-green text-xl md:text-2xl font-bold uppercase tracking-widest mb-4 text-center">
                CONFIRM RETIREMENT
              </div>

              {/* Message */}
              <div className="text-term-green/80 text-sm md:text-base leading-relaxed mb-6 text-center">
                Are you sure you want to retire from service? This will end your career and show your final summary.
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 border-2 border-term-dim text-term-dim hover:bg-term-dim/10 hover:border-term-dim/60 active:bg-term-dim/20 active:border-term-dim transition-all duration-200 text-sm font-bold uppercase tracking-widest"
                  onClick={cancelRetire}
                >
                  CANCEL
                </button>
                <button
                  className="flex-1 py-3 border-2 bg-term-green/10 border-term-green text-term-green shadow-[0_0_10px_rgba(163,230,170,0.2)] hover:bg-term-green/20 active:bg-term-green/30 transition-all duration-200 text-sm font-bold uppercase tracking-widest"
                  onClick={confirmRetire}
                >
                  RETIRE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
