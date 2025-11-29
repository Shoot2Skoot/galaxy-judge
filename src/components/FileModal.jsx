import { useEffect } from 'react';
import './FileModal.css';

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

function getFileTypeLabel(type) {
  switch (type) {
    case 'prosecution':
      return 'PROSECUTION EVIDENCE';
    case 'defense':
      return 'DEFENSE ARGUMENT';
    case 'gaps':
      return 'INFORMATION GAP';
    case 'redacted':
      return 'REDACTED FILE';
    default:
      return 'DATA FILE';
  }
}

export default function FileModal({ file, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const displayContent = file.corruption > 0
    ? corruptText(file.content, file.corruption)
    : file.content;

  const corruptionPercent = Math.round(file.corruption * 100);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon">[FILE]</span>
          <span className="modal-type">{getFileTypeLabel(file.type)}</span>
          {corruptionPercent > 0 && (
            <span className="modal-corruption">
              CORRUPTION: {corruptionPercent}%
            </span>
          )}
        </div>

        <div className="modal-content">
          {displayContent}
        </div>

        <div className="modal-footer">
          <button className="modal-close-btn" onClick={onClose}>
            [CLOSE]
          </button>
          <span className="modal-hint">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
