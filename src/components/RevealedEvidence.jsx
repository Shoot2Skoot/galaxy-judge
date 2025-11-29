import './RevealedEvidence.css';

// Generate corrupted version of text
function corruptText(text, intensity = 0.3) {
  const corruptChars = ['█', '▓', '▒', '░', '╬', '╫', '╪', '┼', '┬', '┴', '├', '┤'];
  let corrupted = text;
  const numCorruptions = Math.floor(text.length * intensity);

  for (let i = 0; i < numCorruptions; i++) {
    const pos = Math.floor(Math.random() * corrupted.length);
    const char = corruptChars[Math.floor(Math.random() * corruptChars.length)];
    corrupted = corrupted.substring(0, pos) + char + corrupted.substring(pos + 1);
  }

  return corrupted;
}

function EvidenceSection({ title, icon, files, color }) {
  if (files.length === 0) return null;

  return (
    <div className="evidence-section">
      <div className="evidence-header">
        <span className="evidence-icon" style={{ color }}>{icon}</span>
        <span className="evidence-title">{title}</span>
        <span className="evidence-count">{files.length} ITEM{files.length !== 1 ? 'S' : ''}</span>
      </div>
      <div className="evidence-items">
        {files.map((file, idx) => {
          const displayContent = file.corruption > 0
            ? corruptText(file.content, file.corruption)
            : file.content;

          const corruptionPercent = Math.round(file.corruption * 100);

          return (
            <div key={idx} className="evidence-item">
              <div className="evidence-item-header">
                <span className="evidence-item-number">#{idx + 1}</span>
                {corruptionPercent > 0 && (
                  <span className="evidence-item-corruption">
                    CORRUPT {corruptionPercent}%
                  </span>
                )}
              </div>
              <div className="evidence-item-content">
                {displayContent}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RevealedEvidence({ revealedFiles }) {
  const prosecutionFiles = revealedFiles.filter(f => f.type === 'prosecution');
  const defenseFiles = revealedFiles.filter(f => f.type === 'defense');
  const gapFiles = revealedFiles.filter(f => f.type === 'gaps');

  if (revealedFiles.length === 0) {
    return (
      <div className="revealed-evidence-empty">
        <div className="empty-message">
          [NO FILES ACCESSED] Click files above to reveal evidence
        </div>
      </div>
    );
  }

  return (
    <div className="revealed-evidence">
      <EvidenceSection
        title="PROSECUTION EVIDENCE"
        icon="[⚖]"
        files={prosecutionFiles}
        color="var(--color-accent-red)"
      />
      <EvidenceSection
        title="DEFENSE ARGUMENTS"
        icon="[⚔]"
        files={defenseFiles}
        color="var(--color-accent-green)"
      />
      <EvidenceSection
        title="INFORMATION GAPS"
        icon="[?]"
        files={gapFiles}
        color="var(--color-accent-yellow)"
      />
    </div>
  );
}
