import { useState, useMemo } from 'react';
import { FileText, FileX } from 'phosphor-react';
import './FileBrowser.css';
import FileModal from './FileModal';

export default function FileBrowser({ prosecutionEvidence, defenseArguments, informationGaps, onFileRevealed }) {
  const [revealedFiles, setRevealedFiles] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCorruption, setFileCorruption] = useState({});
  const [corruptedFileCount, setCorruptedFileCount] = useState(0);

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

    // Add 2-4 extra fake files to show corruption progression
    const fakeFileCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < fakeFileCount; i++) {
      shuffled.splice(
        Math.floor(Math.random() * shuffled.length),
        0,
        {
          id: `fake-${i}`,
          type: 'fake',
          content: 'DATA CORRUPTED - UNABLE TO RETRIEVE FILE CONTENTS',
          isFake: true
        }
      );
    }

    return shuffled;
  }, [prosecutionEvidence, defenseArguments, informationGaps]);

  const totalRealFiles = allFiles.filter(f => !f.isRedacted && !f.isFake).length;
  const totalClickableFiles = allFiles.filter(f => !f.isRedacted).length; // Real + Fake
  const revealedCount = revealedFiles.size;

  // Calculate corruption level for remaining files (percentage of info unlocked)
  const currentCorruptionLevel = totalRealFiles > 0 ? Math.min((revealedCount / totalRealFiles) * 100, 100) : 0;

  const handleFileClick = (file) => {
    if (file.isRedacted || revealedFiles.has(file.id)) {
      return; // Can't click redacted or already revealed files
    }

    // Calculate corruption for this file
    const unlockPercentage = Math.min(((revealedCount + 1) / totalRealFiles) * 100, 100);
    const randomOffset = (Math.random() * 10) - 5; // ±5%
    const displayCorruption = Math.max(0, Math.min(100, unlockPercentage + randomOffset));

    // Only apply actual text corruption to 1-2 files for style (not all files)
    const shouldApplyTextCorruption = corruptedFileCount < 2 && Math.random() > 0.5;
    const actualTextCorruption = shouldApplyTextCorruption
      ? Math.min((displayCorruption / 100) * 12, 12) // Max 12%
      : 0; // No text corruption

    if (shouldApplyTextCorruption) {
      setCorruptedFileCount(corruptedFileCount + 1);
    }

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
      corruption: actualTextCorruption / 100, // Convert to 0-0.12 range for text corruption
      displayCorruption: displayCorruption, // 0-100% for display
    });
  };

  const handleModalClose = () => {
    if (selectedFile && !selectedFile.isRedacted && !selectedFile.isFake) {
      // Mark as revealed
      const newRevealed = new Set(revealedFiles);
      newRevealed.add(selectedFile.id);
      setRevealedFiles(newRevealed);

      // Notify parent
      onFileRevealed({
        type: selectedFile.type,
        content: selectedFile.content,
        corruption: selectedFile.corruption,
        displayCorruption: selectedFile.displayCorruption,
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
          {revealedCount}/{totalClickableFiles} ACCESSED | CORRUPTION: {Math.round(currentCorruptionLevel)}%
        </span>
      </div>

      <div className="file-grid">
        {allFiles
          .filter(file => !revealedFiles.has(file.id)) // Hide revealed files
          .map((file) => {
            const fillLevel = currentCorruptionLevel;

            return (
              <button
                key={file.id}
                className={`file-button ${file.isRedacted ? 'file-redacted' : ''}`}
                onClick={() => handleFileClick(file)}
                disabled={file.isRedacted}
              >
                <div className="file-fill" style={{ width: `${fillLevel}%` }} />
                <div className="file-label">
                  {file.isRedacted ? <FileX size={20} weight="duotone" /> : <FileText size={20} weight="duotone" />}
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
