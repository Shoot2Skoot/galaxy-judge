import { useState, useMemo } from 'react';
import './FileViewer.css';

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

export default function FileViewer({ files, type, title, icon }) {
  const [openedFiles, setOpenedFiles] = useState(new Set());
  const [globalCorruptionLevel, setGlobalCorruptionLevel] = useState(0);
  const [corruptedFakeFiles, setCorruptedFakeFiles] = useState(new Set());

  // Generate and shuffle files only once using useMemo
  const allFiles = useMemo(() => {
    // 1-2 initially redacted files
    const redactedCount = 1 + Math.floor(Math.random() * 2); // 1-2 redacted
    const redactedFiles = Array.from({ length: redactedCount }, (_, i) => ({
      id: `redacted-${type}-${i}`,
      name: `[REDACTED_${String(i + 1).padStart(3, '0')}]`,
      isFake: true,
      isRedacted: true,
    }));

    // 2-3 fake files that appear normal but will corrupt
    const normalFakeCount = 2 + Math.floor(Math.random() * 2); // 2-3 normal-looking fakes
    const normalFakeFiles = Array.from({ length: normalFakeCount }, (_, i) => ({
      id: `fake-${type}-${i}`,
      name: `FILE_${String(redactedCount + i + 1).padStart(3, '0')}.dat`,
      isFake: true,
      isRedacted: false,
    }));

    // Real files with names
    const realFiles = files.map((content, i) => ({
      id: `real-${type}-${i}`,
      name: `FILE_${String(i + 1).padStart(3, '0')}.dat`,
      content,
      isFake: false,
      isRedacted: false,
    }));

    // Shuffle all files together - only happens once
    return [...realFiles, ...redactedFiles, ...normalFakeFiles].sort(() => Math.random() - 0.5);
  }, [files, type]);

  const handleFileClick = (file) => {
    if (file.isFake) {
      // Fake file - show error
      return;
    }

    if (openedFiles.has(file.id)) {
      // Already opened, don't increase corruption again
      return;
    }

    // Mark as opened
    const newOpened = new Set(openedFiles);
    newOpened.add(file.id);
    setOpenedFiles(newOpened);

    // Increase global corruption level (15% per file viewed)
    const newGlobalCorruption = globalCorruptionLevel + 0.15;
    setGlobalCorruptionLevel(newGlobalCorruption);

    // After certain corruption threshold, start corrupting fake files
    // Corrupt a fake file every 2 views (at 0.30, 0.60, 0.90, etc.)
    if (Math.floor(newGlobalCorruption / 0.30) > Math.floor(globalCorruptionLevel / 0.30)) {
      const nonRedactedFakes = allFiles.filter(f => f.isFake && !f.isRedacted && !corruptedFakeFiles.has(f.id));
      if (nonRedactedFakes.length > 0) {
        const randomFake = nonRedactedFakes[Math.floor(Math.random() * nonRedactedFakes.length)];
        const newCorrupted = new Set(corruptedFakeFiles);
        newCorrupted.add(randomFake.id);
        setCorruptedFakeFiles(newCorrupted);
      }
    }
  };

  return (
    <div className="file-viewer">
      <div className="file-viewer-header">
        <span className="file-icon">{icon}</span>
        <span className="file-title">{title}</span>
        <span className="file-count">
          {allFiles.length} FILES
        </span>
      </div>

      <div className="file-list">
        {allFiles.map((file) => {
          const isOpened = openedFiles.has(file.id);
          const isCorruptedFake = corruptedFakeFiles.has(file.id);

          // Calculate display corruption percentage (can go higher)
          const displayCorruption = Math.min(globalCorruptionLevel, 1.0);
          const displayPercent = Math.round(displayCorruption * 100);

          // Cap actual text corruption at 15%
          const actualTextCorruption = Math.min(globalCorruptionLevel, 0.15);

          // Determine file state
          const isRedacted = file.isFake && file.isRedacted;
          const isFakeCorrupted = file.isFake && !file.isRedacted && isCorruptedFake;
          const isFakeNormal = file.isFake && !file.isRedacted && !isCorruptedFake;

          return (
            <div
              key={file.id}
              className={`file-item ${
                isRedacted || isFakeCorrupted ? 'file-fake' : ''
              } ${isOpened ? 'file-opened' : 'file-unopened'}`}
              onClick={() => handleFileClick(file)}
            >
              <div className="file-item-header">
                <span className="file-item-icon">
                  {isRedacted || isFakeCorrupted ? '[X]' : isOpened ? '[O]' : '[ ]'}
                </span>
                <span className="file-item-name">{file.name}</span>

                {isRedacted && <span className="file-access-denied">ACCESS DENIED</span>}
                {isFakeCorrupted && <span className="file-access-denied">DATA CORRUPTED</span>}

                {!isRedacted && !isFakeCorrupted && displayPercent > 0 && (
                  <span className="file-corruption-level">
                    CORRUPT {displayPercent}%
                  </span>
                )}
              </div>

              {isOpened && !file.isFake && (
                <div className="file-content">
                  {actualTextCorruption > 0
                    ? corruptText(file.content, actualTextCorruption)
                    : file.content}
                </div>
              )}

              {isRedacted && (
                <div className="file-fake-reason">
                  [INSUFFICIENT CLEARANCE | FILE ENCRYPTED | RETINA SCAN REQUIRED]
                </div>
              )}

              {isFakeCorrupted && (
                <div className="file-fake-reason">
                  [DATA CORRUPTION DETECTED | INTEGRITY CHECK FAILED | UNRECOVERABLE]
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
