import React from 'react';

interface TerminalFrameProps {
  children: React.ReactNode;
  headerText: string;
}

const TerminalFrame: React.FC<TerminalFrameProps> = ({ children, headerText }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-mono select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>
      
      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-term-dark border border-term-dim shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col z-10">
        
        {/* Exterior Industrial Decorative Elements */}
        <div className="absolute -left-3 top-20 bottom-20 w-1 bg-term-dim/30 rounded-full hidden md:block"></div>
        <div className="absolute -right-3 top-20 bottom-20 w-1 bg-term-dim/30 rounded-full hidden md:block"></div>
        
        {/* Header Bar */}
        <div className="bg-black/40 border-b border-term-dim p-3 flex justify-between items-center text-xs md:text-sm tracking-widest text-term-green/80 uppercase">
            <span>Magistrate</span>
            <span className="hidden sm:inline text-term-dim">|</span>
            <span>{headerText}</span>
            <span className="hidden sm:inline text-term-dim">|</span>
            <span>Year 2</span>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 relative">
          {children}
        </div>

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 scanlines opacity-30 z-50 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20 z-40"></div>
      </div>
    </div>
  );
};

export default TerminalFrame;