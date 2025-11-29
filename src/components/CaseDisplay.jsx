import { useState } from 'react';
import './CaseDisplay.css';
import FileBrowser from './FileBrowser';
import RevealedEvidence from './RevealedEvidence';

export default function CaseDisplay({ caseData, year }) {
  const [revealedFiles, setRevealedFiles] = useState([]);

  const handleFileRevealed = (fileData) => {
    setRevealedFiles(prev => [...prev, fileData]);
  };

  return (
    <div className="case-display">
      {/* Header bar */}
      <div className="case-header">
        <div className="case-header-left">
          <span className="case-year">YEAR {year}</span>
          <span className="case-separator">|</span>
          <span className="case-id">CASE #{caseData.id}</span>
        </div>
        <div className="case-header-right">
          <span className="case-status">AWAITING JUDGMENT</span>
        </div>
      </div>

      {/* Prisoner info grid */}
      <div className="prisoner-info-grid">
        <div className="info-cell">
          <div className="data-label">Name</div>
          <div className="data-field">{caseData.prisonerName}</div>
        </div>
        <div className="info-cell">
          <div className="data-label">Age</div>
          <div className="data-field">{caseData.age}</div>
        </div>
        <div className="info-cell">
          <div className="data-label">Station Role</div>
          <div className="data-field">{caseData.role}</div>
        </div>
      </div>

      {/* Crime */}
      <div className="case-section">
        <div className="section-header">
          <span className="section-indicator">///</span>
          <span>ACCUSED CRIME</span>
        </div>
        <div className="section-content crime-content">
          {caseData.crime}
        </div>
        {caseData.crimeSeverity && (
          <div className="crime-severity">
            <span className="severity-label">SEVERITY ASSESSMENT:</span>
            <span className="severity-content">{caseData.crimeSeverity}</span>
          </div>
        )}
      </div>

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
