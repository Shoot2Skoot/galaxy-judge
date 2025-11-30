import TerminalFrame from './TerminalFrame';
import Panel from './Panel';
import DataRow from './DataRow';

export default function RetirementSummary({ summary, onNewGame }) {
  const { stats, narrative } = summary;

  return (
    <TerminalFrame year={stats.yearsServed}>
      <Panel title="SERVICE CONCLUDED" className="mt-8">
        {/* Career Narrative */}
        <div className="mt-6 mb-8 px-4">
          <div className="text-term-green/90 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {narrative || 'Your career remains undocumented in the station archives.'}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 pt-6 border-t border-term-dim/30">
          <div className="text-xs uppercase tracking-wider text-term-dim mb-4 px-4">
            Service Record
          </div>
          <div className="space-y-0">
            <DataRow label="Years Served" value={stats.yearsServed} />
            <DataRow label="Cases Judged" value={stats.totalCases} />
            <DataRow label="Released" value={stats.released} />
            <DataRow label="Detained" value={stats.detained} />
            <DataRow label="Executed" value={stats.airlocked} />
          </div>
        </div>

        {/* New Game Button */}
        <div className="mt-8 px-4">
          <button
            className="w-full py-3 bg-term-green/10 border-2 border-term-green text-term-green hover:bg-term-green/20 hover:shadow-[0_0_15px_rgba(163,230,170,0.3)] transition-all duration-200 text-sm md:text-base font-bold tracking-widest uppercase"
            onClick={onNewGame}
          >
            &gt;&gt;&gt; NEW MAGISTRATE
          </button>
        </div>
      </Panel>
    </TerminalFrame>
  );
}
