import TerminalFrame from './TerminalFrame';
import Panel from './Panel';
import DataRow from './DataRow';

export default function RetirementSummary({ summary, outcome, onNewGame }) {
  const { stats, narrative } = summary;

  const getOutcomeMessage = () => {
    if (!outcome || outcome === 'retired') return null;

    if (outcome === 'died') {
      return {
        title: 'DIED IN SERVICE',
        message: 'Your service ended abruptly. Station records indicate you did not survive your tenure as Magistrate.',
        color: 'text-red-500'
      };
    }

    if (outcome === 'ousted') {
      return {
        title: 'REMOVED FROM OFFICE',
        message: 'Station Command determined your service was no longer required. You were relieved of your duties as Magistrate.',
        color: 'text-orange-500'
      };
    }

    return null;
  };

  const outcomeInfo = getOutcomeMessage();

  return (
    <TerminalFrame year={stats.yearsServed}>
      <Panel title="SERVICE CONCLUDED" className="w-full flex-1 min-h-0 overflow-auto">
        {/* Forced Outcome Message */}
        {outcomeInfo && (
          <div className="mt-6 mb-4 px-4">
            <div className={`border-2 ${outcomeInfo.color.replace('text-', 'border-')} p-4 ${outcomeInfo.color.replace('text-', 'bg-')}/10`}>
              <div className={`${outcomeInfo.color} text-lg md:text-xl font-bold uppercase tracking-widest mb-2`}>
                {outcomeInfo.title}
              </div>
              <div className="text-term-green/80 text-sm md:text-base">
                {outcomeInfo.message}
              </div>
            </div>
          </div>
        )}

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
