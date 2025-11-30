import React, { useState } from 'react';
import TerminalFrame from './components/TerminalFrame';
import Panel from './components/Panel';
import DataRow from './components/DataRow';
import TabButton from './components/TabButton';
import { CaseData, Tab } from './types';

// Mock Data matching the screenshot
const MOCK_CASE: CaseData = {
  id: "1764471130054",
  status: "AWAITING JUDGMENT",
  accused: {
    name: "Celestine Knox",
    age: 34,
    role: "Communications Tech"
  },
  charges: {
    crime: "Tampering with Antenna Array Alignment",
    severity: "Misalignment disrupts long-range beaconing, blocking urgent distress signals and cargo manifests for 300 residents.",
  },
  evidence: [
    "Security Log 442: Access terminal override detected.",
    "Witness Statement: Tech officer J. Doe observed subject near array.",
    "Tool Mark Analysis: Matches standard issue wrench found in quarters."
  ],
  verdict: null
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CHARGES);

  return (
    <TerminalFrame headerText="Judicial Terminal - Station Authority">
      
      <div className="flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto">
        
        {/* Status Section */}
        <Panel className="w-full">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-baseline mb-1">
                    <h2 className="text-lg md:text-xl font-bold text-term-green/90 uppercase tracking-wider">
                        <span className="text-term-dim mr-2">CASE #{MOCK_CASE.id}</span>
                        <span className="text-term-dim mx-2">|</span>
                        <span className="text-white drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">{MOCK_CASE.status}</span>
                    </h2>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-4 bg-term-dim/20 border border-term-dim/40 p-0.5 relative">
                    <div className="h-full w-3/4 bg-term-green/60 shadow-[0_0_10px_rgba(163,230,170,0.4)] relative overflow-hidden">
                        {/* Animated stripes on progress bar */}
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>
        </Panel>

        {/* Identity Section */}
        <Panel title="Accused Identity">
            <div className="flex flex-col border border-term-dim/30 bg-black/20">
                <DataRow label="Name" value={MOCK_CASE.accused.name} />
                <DataRow label="Age" value={MOCK_CASE.accused.age} />
                <DataRow label="Station Role" value={MOCK_CASE.accused.role} />
            </div>
        </Panel>

        {/* Tabs & Content */}
        <div className="flex flex-col">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-0 relative z-10 px-1">
                <TabButton 
                    label="Charges" 
                    isActive={activeTab === Tab.CHARGES} 
                    onClick={() => setActiveTab(Tab.CHARGES)} 
                />
                <TabButton 
                    label="Evidence" 
                    isActive={activeTab === Tab.EVIDENCE} 
                    onClick={() => setActiveTab(Tab.EVIDENCE)} 
                />
                <TabButton 
                    label="Verdict" 
                    isActive={activeTab === Tab.VERDICT} 
                    onClick={() => setActiveTab(Tab.VERDICT)} 
                />
            </div>

            {/* Tab Content Panel */}
            <Panel className="min-h-[250px] border-t-0">
                <div className="h-full flex flex-col justify-between">
                    
                    {activeTab === Tab.CHARGES && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-2">Accused Crime:</h3>
                                <div className="text-white text-lg md:text-xl tracking-wide leading-relaxed border-l-2 border-term-green pl-4 bg-gradient-to-r from-term-green/5 to-transparent py-2">
                                    {MOCK_CASE.charges.crime}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-2">Severity Assessment:</h3>
                                <div className="text-term-green/80 text-base md:text-lg leading-relaxed border-l-2 border-term-dim pl-4">
                                    {MOCK_CASE.charges.severity}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === Tab.EVIDENCE && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-2">Evidence Log:</h3>
                            <ul className="space-y-2">
                                {MOCK_CASE.evidence.map((item, idx) => (
                                    <li key={idx} className="flex gap-3 items-start text-term-green/80">
                                        <span className="text-term-dim mt-1">[{idx + 1}]</span>
                                        <span className="border-b border-term-dim/20 pb-1 w-full">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === Tab.VERDICT && (
                        <div className="flex items-center justify-center h-full min-h-[180px] animate-in fade-in duration-300">
                            <div className="text-center p-6 border-2 border-term-dim/30 bg-black/40">
                                <h3 className="text-term-dim font-bold text-sm uppercase tracking-wide mb-4">Pending Judicial Review</h3>
                                <button className="bg-term-green/10 hover:bg-term-green/20 text-term-green border border-term-green px-8 py-3 uppercase tracking-widest text-sm font-bold transition-all shadow-[0_0_15px_rgba(163,230,170,0.1)] hover:shadow-[0_0_20px_rgba(163,230,170,0.3)]">
                                    Input Verdict
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Decorative Bottom Right Element (Diamond) */}
                    <div className="absolute bottom-4 right-4 opacity-50">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-term-dim">
                            <path d="M12 2L2 12L12 22L22 12L12 2Z" />
                        </svg>
                    </div>

                    {/* Side decorative bars inside the content panel */}
                     <div className="absolute right-2 top-4 bottom-12 w-1 flex flex-col gap-1 opacity-30">
                         {Array.from({ length: 10 }).map((_, i) => (
                             <div key={i} className="w-full bg-term-green h-full" style={{ opacity: 1 - (i * 0.1) }}></div>
                         ))}
                     </div>
                </div>
            </Panel>
        </div>

      </div>
    </TerminalFrame>
  );
};

export default App;