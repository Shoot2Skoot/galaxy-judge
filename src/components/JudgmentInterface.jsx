import './JudgmentInterface.css';

export default function JudgmentInterface({ onVerdict, onRetire, year, casesJudged }) {
  return (
    <div className="judgment-interface">
      <div className="judgment-header">
        <span className="judgment-label">RENDER VERDICT</span>
        <div className="judgment-stats">
          <span className="stat-item">CASES: {casesJudged}</span>
          <span className="stat-separator">|</span>
          <span className="stat-item">YEAR: {year}</span>
        </div>
      </div>

      <div className="verdict-grid">
        <button
          className="verdict-button verdict-release"
          onClick={() => onVerdict('release')}
        >
          <div className="verdict-icon">[R]</div>
          <div className="verdict-label">RELEASE</div>
          <div className="verdict-desc">Return to station population</div>
        </button>

        <button
          className="verdict-button verdict-detain"
          onClick={() => onVerdict('detain')}
        >
          <div className="verdict-icon">[D]</div>
          <div className="verdict-label">DETAIN</div>
          <div className="verdict-desc">Cryo / Isolation / Labor</div>
        </button>

        <button
          className="verdict-button verdict-airlock"
          onClick={() => onVerdict('airlock')}
        >
          <div className="verdict-icon">[X]</div>
          <div className="verdict-label">AIRLOCK</div>
          <div className="verdict-desc">Terminal sentence</div>
        </button>
      </div>

      <div className="retirement-section">
        <button
          className="retirement-button"
          onClick={onRetire}
        >
          <span className="retirement-icon">///</span>
          <span>RETIRE FROM SERVICE</span>
        </button>
      </div>
    </div>
  );
}
