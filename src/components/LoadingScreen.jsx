import { useState, useEffect } from 'react';
import TerminalFrame from './TerminalFrame';
import Panel from './Panel';

const CASE_LOADING_STEPS = [
  'ACCESSING STATION ARCHIVES',
  'RETRIEVING PRISONER RECORDS',
  'DECRYPTING EVIDENCE FILES',
  'VALIDATING CHAIN OF CUSTODY',
  'COMPILING WITNESS STATEMENTS',
  'CROSS-REFERENCING ALIBIS',
  'ANALYZING SECURITY LOGS',
  'CALCULATING SEVERITY METRICS',
  'PREPARING CASE SUMMARY',
];

const RETIREMENT_LOADING_STEPS = [
  'ACCESSING CAREER RECORDS',
  'ANALYZING CASE OUTCOMES',
  'CROSS-REFERENCING HISTORICAL DATA',
  'COMPILING STATISTICAL SUMMARY',
  'GENERATING CONSEQUENCE VIGNETTES',
  'CALCULATING LEGACY METRICS',
  'FINALIZING EPITAPH',
];

export default function LoadingScreen({ message = 'LOADING CASE DATA', duration = null }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const isRetirement = message.includes('CAREER');
  const steps = isRetirement ? RETIREMENT_LOADING_STEPS : CASE_LOADING_STEPS;

  useEffect(() => {
    // For case loading: 1500ms total, for retirement: cycle continuously
    const actualDuration = duration || (isRetirement ? null : 1500);

    if (actualDuration) {
      // Fixed duration: divide time evenly among steps
      const stepDuration = actualDuration / steps.length;
      const progressIncrement = 100 / (actualDuration / 50); // Update every 50ms

      // Step through at calculated intervals
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          return next >= steps.length ? steps.length - 1 : next;
        });
      }, stepDuration);

      // Smooth progress bar
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + progressIncrement;
          return next > 100 ? 100 : next;
        });
      }, 50);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    } else {
      // No duration: cycle continuously (for retirement)
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 400);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 2;
          return next > 100 ? 0 : next;
        });
      }, 50);

      return () => {
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    }
  }, [steps.length, duration, isRetirement]);

  return (
    <TerminalFrame year="--">
      <Panel title="[PROCESSING]" active={true} className="mt-8">
        <div className="mt-6 space-y-2 px-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 py-1 text-sm transition-all duration-300 ${
                index === currentStep
                  ? 'text-term-green'
                  : index < currentStep
                  ? 'text-term-green/50'
                  : 'text-term-dim/30'
              }`}
            >
              <span className="text-xs font-bold w-4">
                {index < currentStep ? '✓' : index === currentStep ? '›' : '·'}
              </span>
              <span className="uppercase tracking-wider">{step}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 px-4">
          <div className="h-2 bg-black border border-term-dim/40 relative overflow-hidden">
            <div
              className="h-full bg-term-green/40 border-r-2 border-term-green transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-xs text-term-dim uppercase tracking-wider mt-3">
            {message}
          </div>
        </div>
      </Panel>
    </TerminalFrame>
  );
}
