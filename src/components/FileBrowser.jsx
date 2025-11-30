import { useState, useMemo, useEffect, useRef } from 'react';
import { FileText, FileX } from '@phosphor-icons/react';
import Panel from './Panel';
import FileModal from './FileModal';
import { gameConfig } from '../config/gameConfig';

export default function FileBrowser({ prosecutionEvidence, defenseArguments, informationGaps, onFileRevealed }) {
  const [revealedFiles, setRevealedFiles] = useState(new Set());
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCorruption, setFileCorruption] = useState({});
  const [corruptedFileCount, setCorruptedFileCount] = useState(0);
  const hasAutoRevealedRef = useRef(false);

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

  // Auto-reveal all evidence if config is enabled
  useEffect(() => {
    if (gameConfig.autoRevealEvidence && !hasAutoRevealedRef.current && allFiles.length > 0) {
      hasAutoRevealedRef.current = true;

      // Reveal all non-redacted files automatically
      const filesToReveal = allFiles.filter(f => !f.isRedacted && !f.isFake);
      const newRevealed = new Set();
      let corruptCount = 0;

      filesToReveal.forEach((file, index) => {
        newRevealed.add(file.id);

        // Calculate corruption for each file
        const unlockPercentage = Math.min(((index + 1) / totalRealFiles) * 100, 100);
        const randomOffset = (Math.random() * 10) - 5;
        const displayCorruption = Math.max(0, Math.min(100, unlockPercentage + randomOffset));

        // Only apply actual text corruption to 1-2 files
        const shouldApplyTextCorruption = corruptCount < 2 && Math.random() > 0.5;
        const actualTextCorruption = shouldApplyTextCorruption
          ? Math.min((displayCorruption / 100) * 12, 12)
          : 0;

        if (shouldApplyTextCorruption) {
          corruptCount++;
        }

        // Notify parent for real files
        onFileRevealed({
          type: file.type,
          content: file.content,
          corruption: actualTextCorruption / 100,
          displayCorruption: displayCorruption,
          index: file.index,
        });
      });

      setRevealedFiles(newRevealed);
      setCorruptedFileCount(corruptCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFiles, totalRealFiles]);

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
    if (selectedFile && !selectedFile.isRedacted) {
      // Mark as revealed (including fake files so they disappear)
      const newRevealed = new Set(revealedFiles);
      newRevealed.add(selectedFile.id);
      setRevealedFiles(newRevealed);

      // Only notify parent for real files (not fake files)
      if (!selectedFile.isFake) {
        onFileRevealed({
          type: selectedFile.type,
          content: selectedFile.content,
          corruption: selectedFile.corruption,
          displayCorruption: selectedFile.displayCorruption,
          index: selectedFile.index,
        });
      }
    }

    setSelectedFile(null);
  };

  if (gameConfig.autoRevealEvidence) {
    // When auto-reveal is enabled, show a simple status panel
    return (
      <Panel title="EVIDENCE DATABASE" className="mb-4">
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs uppercase tracking-wider text-term-dim">
            All files automatically accessed
          </div>
          <div className="text-xs text-term-green">
            {revealedCount}/{totalRealFiles} FILES | CORRUPT: {Math.round(currentCorruptionLevel)}%
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="EVIDENCE DATABASE" className="mb-4">
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-term-dim/30">
          <div className="text-xs uppercase tracking-wider text-term-dim">
            Select files to access evidence
          </div>
          <div className="text-xs text-term-green">
            {revealedCount}/{totalClickableFiles} ACCESSED | CORRUPT: {Math.round(currentCorruptionLevel)}%
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {allFiles
            .filter(file => !revealedFiles.has(file.id)) // Hide revealed files
            .map((file) => {
              const fillLevel = currentCorruptionLevel;

              return (
                <button
                  key={file.id}
                  className={`relative aspect-square border transition-all duration-200 flex items-center justify-center group ${
                    file.isRedacted
                      ? 'border-red-500/40 bg-red-500/5 cursor-not-allowed'
                      : 'border-term-green/40 bg-term-green/5 hover:bg-term-green/10 hover:border-term-green'
                  }`}
                  onClick={() => handleFileClick(file)}
                  disabled={file.isRedacted}
                >
                  {/* Fill indicator */}
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-term-green/20 transition-all duration-300"
                    style={{ height: `${fillLevel}%` }}
                  />

                  {/* Icon */}
                  <div className="relative z-10 text-term-green group-hover:scale-110 transition-transform">
                    {file.isRedacted ? (
                      <FileX size={20} weight="duotone" className="text-red-500" />
                    ) : (
                      <FileText size={20} weight="duotone" />
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {selectedFile && (
        <FileModal file={selectedFile} onClose={handleModalClose} />
      )}
    </Panel>
  );
}
