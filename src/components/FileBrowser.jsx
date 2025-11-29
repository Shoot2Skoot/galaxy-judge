import { useState, useMemo } from 'react';
import './FileBrowser.css';
import FileModal from './FileModal';

export default function FileBrowser({ prosecutionEvidence, defenseArguments, informationGaps, onFileRevealed }) {
  const [revealedFiles, setRevealedFiles] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCorruption, setFileCorruption] = useState({});

  // Combine all files with metadata
  const allFiles = useMemo(() => {
    const files = [];

    // Add prosecution files
    prosecutionEvidence.forEach((content, i) => {
      files.push({
        id: `prosecution-${i}`,
        type: 'prosecution',
        content,
        index: i,
      });
    });

    // Add defense files
    defenseArguments.forEach((content, i) => {
      files.push({
        id: `defense-${i}`,
        type: 'defense',
        content,
        index: i,
      });
    });

    // Add information gaps
    informationGaps.forEach((content, i) => {
      files.push({
        id: `gaps-${i}`,
        type: 'gaps',
        content,
        index: i,
      });
    });

    // Shuffle all files together
    const shuffled = files.sort(() => Math.random() - 0.5);

    // Add 1-2 redacted files
    const redactedCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < redactedCount; i++) {
      shuffled.splice(
        Math.floor(Math.random() * shuffled.length),
        0,
        { id: `redacted-${i}`, type: 'redacted', isRedacted: true }
      );
    }

    return shuffled;
  }, [prosecutionEvidence, defenseArguments, informationGaps]);

  const totalRealFiles = allFiles.filter(f => !f.isRedacted).length;
  const revealedCount = revealedFiles.size;

  // Calculate corruption level for remaining files (percentage of info unlocked)
  const currentCorruptionLevel = totalRealFiles > 0 ? (revealedCount / totalRealFiles) * 100 : 0;

  const handleFileClick = (file) => {
    if (file.isRedacted || revealedFiles.has(file.id)) {
      return; // Can't click redacted or already revealed files
    }

    // Calculate corruption for this file
    const unlockPercentage = ((revealedCount + 1) / totalRealFiles) * 100;
    const randomOffset = (Math.random() * 10) - 5; // ±5%
    const displayCorruption = Math.max(0, Math.min(100, unlockPercentage + randomOffset));
    const actualTextCorruption = Math.min((displayCorruption / 100) * 25, 25); // Max 25%

    // Store corruption for this file
    setFileCorruption({
      ...fileCorruption,
      [file.id]: {
        display: displayCorruption,
        actual: actualTextCorruption,
      },
    });

    // Show modal
    setSelectedFile({
      ...file,
      corruption: actualTextCorruption / 100, // Convert to 0-0.25 range
    });
  };

  const handleModalClose = () => {
    if (selectedFile && !selectedFile.isRedacted) {
      // Mark as revealed
      const newRevealed = new Set(revealedFiles);
      newRevealed.add(selectedFile.id);
      setRevealedFiles(newRevealed);

      // Notify parent
      onFileRevealed({
        type: selectedFile.type,
        content: selectedFile.content,
        corruption: selectedFile.corruption,
        index: selectedFile.index,
      });
    }

    setSelectedFile(null);
  };

  return (
    <div className="file-browser">
      <div className="file-browser-header">
        <span className="browser-icon">[FILES]</span>
        <span className="browser-title">CASE EVIDENCE DATABASE</span>
        <span className="browser-stats">
          {revealedCount}/{totalRealFiles} ACCESSED | CORRUPTION: {Math.round(currentCorruptionLevel)}%
        </span>
      </div>

      <div className="file-grid">
        {allFiles.map((file) => {
          const isRevealed = revealedFiles.has(file.id);
          const fillLevel = isRevealed ? 100 : currentCorruptionLevel;

          return (
            <button
              key={file.id}
              className={`file-button ${file.isRedacted ? 'file-redacted' : ''} ${
                isRevealed ? 'file-revealed' : ''
              }`}
              onClick={() => handleFileClick(file)}
              disabled={file.isRedacted || isRevealed}
            >
              <div className="file-fill" style={{ width: `${fillLevel}%` }} />
              <div className="file-label">
                {file.isRedacted ? '[REDACTED]' : isRevealed ? '[VIEWED]' : '[ DATA ]'}
              </div>
            </button>
          );
        })}
      </div>

      {selectedFile && (
        <FileModal file={selectedFile} onClose={handleModalClose} />
      )}
    </div>
  );
}
