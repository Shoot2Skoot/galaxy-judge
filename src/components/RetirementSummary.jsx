import './RetirementSummary.css';

export default function RetirementSummary({ summary, onNewGame }) {
  const { stats, vignettes, epitaph } = summary;

  return (
    <div className="retirement-summary">
      {/* Terminal header */}
      <div className="summary-header">
        <span className="summary-title">CAREER TERMINATION REPORT</span>
        <span className="summary-status">MAGISTRATE SERVICE CONCLUDED</span>
      </div>

      {/* Part 1: The Record */}
      <div className="summary-section">
        <div className="section-header">
          <span className="section-number">[1]</span>
          <span>THE RECORD</span>
        </div>
        <div className="stats-grid">
          <div className="stat-row">
            <span className="stat-label">Years Served:</span>
            <span className="stat-value">{stats.yearsServed}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Cases:</span>
            <span className="stat-value">{stats.totalCases}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Released:</span>
            <span className="stat-value stat-green">{stats.released}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Detained:</span>
            <span className="stat-value stat-yellow">{stats.detained}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Airlocked:</span>
            <span className="stat-value stat-red">{stats.airlocked}</span>
          </div>
        </div>
      </div>

      {/* Part 2: The Reckoning */}
      {vignettes && vignettes.length > 0 && (
        <div className="summary-section">
          <div className="section-header">
            <span className="section-number">[2]</span>
            <span>THE RECKONING</span>
          </div>
          <div className="vignettes-container">
            {vignettes.map((vignette, index) => (
              <div key={index} className="vignette">
                <div className="vignette-header">
                  Prisoner {vignette.caseNumber}. {vignette.name}.
                </div>
                <div className="vignette-content">{vignette.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Part 3: The Epitaph */}
      {epitaph && (
        <div className="summary-section">
          <div className="section-header">
            <span className="section-number">[3]</span>
            <span>THE EPITAPH</span>
          </div>
          <div className="epitaph-content">{epitaph}</div>
        </div>
      )}

      {/* Placeholder message if no vignettes yet */}
      {(!vignettes || vignettes.length === 0) && (
        <div className="summary-section">
          <div className="section-header">
            <span className="section-number">[2]</span>
            <span>THE RECKONING</span>
          </div>
          <div className="placeholder-message">
            [AI-generated case revelations will appear here in future updates]
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="summary-actions">
        <button className="new-game-button" onClick={onNewGame}>
          <span className="action-icon">&gt;&gt;&gt;</span>
          <span>NEW MAGISTRATE</span>
        </button>
      </div>
    </div>
  );
}
