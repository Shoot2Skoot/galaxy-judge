import { useState } from 'react';
import Panel from './Panel';
import DataRow from './DataRow';
import FileBrowser from './FileBrowser';
import RevealedEvidence from './RevealedEvidence';

export default function CaseDisplay({ caseData }) {
  const [revealedFiles, setRevealedFiles] = useState([]);

  const handleFileRevealed = (fileData) => {
    setRevealedFiles(prev => {
      // Check for duplicates based on type and index
      const isDuplicate = prev.some(
        file => file.type === fileData.type && file.index === fileData.index
      );

      if (isDuplicate) {
        return prev; // Don't add duplicate
      }

      return [...prev, fileData];
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">

      {/* Status Section */}
      <Panel className="w-full">
        <div className="flex flex-col gap-2">
          <div className="flex justify-center items-baseline mb-1">
            <h2 className="text-lg md:text-xl font-bold text-term-green/90 uppercase tracking-wider">
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
          <DataRow label="Name" value={caseData.prisonerName} />
          <DataRow label="Age" value={caseData.age} />
          <DataRow label="Station Role" mobileLabel="Role" value={caseData.role} />
        </div>
      </Panel>

      {/* Charges Section */}
      <Panel title="Charges">
        <div className="space-y-6">
          <div>
            <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-2">Accused Crime:</h3>
            <div className="text-white text-lg md:text-xl tracking-wide leading-relaxed border-l-2 border-term-green pl-4 bg-gradient-to-r from-term-green/5 to-transparent py-2">
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
      </Panel>

      {/* File Browser */}
      <FileBrowser
        prosecutionEvidence={Array.isArray(caseData.prosecutionEvidence) ? caseData.prosecutionEvidence : [caseData.prosecutionEvidence]}
        defenseArguments={Array.isArray(caseData.defenseArgument) ? caseData.defenseArgument : [caseData.defenseArgument]}
        informationGaps={Array.isArray(caseData.informationGaps) ? caseData.informationGaps : [caseData.informationGaps]}
        onFileRevealed={handleFileRevealed}
      />

      {/* Revealed Evidence Sections */}
      <RevealedEvidence revealedFiles={revealedFiles} />
    </div>
  );
}
