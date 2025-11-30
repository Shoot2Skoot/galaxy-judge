import Panel from './Panel';

// Generate corrupted version of text
function corruptText(text, intensity = 0.3) {
  if (!text || typeof text !== 'string') {
    return '';
  }

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

// Ensure text ends with punctuation
function ensurePunctuation(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return '';
  }

  const lastChar = trimmed[trimmed.length - 1];
  const punctuation = ['.', '!', '?', ';', ':'];

  if (punctuation.includes(lastChar)) {
    return trimmed;
  }
  return trimmed + '.';
}

function EvidenceSection({ title, icon, files, iconColor, textColor, borderColor }) {
  if (files.length === 0) return null;

  // Combine all file contents into a single paragraph
  const combinedContent = files.map((file) => {
    // Ensure file and content exist
    if (!file || !file.content) {
      return '';
    }

    const content = file.corruption > 0
      ? corruptText(file.content, file.corruption)
      : file.content;
    return ensurePunctuation(content);
  }).filter(text => text.length > 0).join(' ');

  // Calculate average corruption for display
  const avgCorruption = files.reduce((sum, file) => sum + (file.displayCorruption || 0), 0) / files.length;
  const corruptionPercent = Math.round(avgCorruption);

  return (
    <Panel title={title} className="mb-4" accentColor={borderColor}>
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: borderColor + '50' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ color: iconColor }}>{icon}</span>
            <span className="text-xs uppercase tracking-wider" style={{ color: iconColor + 'bb' }}>
              {files.length} ITEM{files.length !== 1 ? 'S' : ''}
            </span>
          </div>
          {corruptionPercent > 0 && (
            <span className="text-xs" style={{ color: iconColor + '88' }}>
              AVG CORRUPT {corruptionPercent}%
            </span>
          )}
        </div>
        <div className="text-sm md:text-base leading-relaxed" style={{ color: textColor }}>
          {combinedContent}
        </div>
      </div>
    </Panel>
  );
}

export default function RevealedEvidence({ revealedFiles }) {
  const prosecutionFiles = revealedFiles.filter(f => f.type === 'prosecution');
  const defenseFiles = revealedFiles.filter(f => f.type === 'defense');
  const gapFiles = revealedFiles.filter(f => f.type === 'gaps');

  if (revealedFiles.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <EvidenceSection
        title="PROSECUTION EVIDENCE"
        icon="[⚖]"
        files={prosecutionFiles}
        iconColor="#ff5555"
        textColor="#ffaaaa"
        borderColor="#ff5555"
      />
      <EvidenceSection
        title="DEFENSE ARGUMENTS"
        icon="[⚔]"
        files={defenseFiles}
        iconColor="#a3e6aa"
        textColor="#a3e6aa"
        borderColor="#a3e6aa"
      />
      <EvidenceSection
        title="INFORMATION GAPS"
        icon="[?]"
        files={gapFiles}
        iconColor="#ffaa00"
        textColor="#ffcc66"
        borderColor="#ffaa00"
      />
    </div>
  );
}
