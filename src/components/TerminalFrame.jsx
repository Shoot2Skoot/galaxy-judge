import { Bank } from '@phosphor-icons/react';

export default function TerminalFrame({ children, year }) {
  return (
    <div className="h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-mono select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]"></div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl bg-term-dark border border-term-dim shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col h-full min-h-0 z-10">

        {/* Exterior Industrial Decorative Elements */}
        <div className="absolute -left-3 top-20 bottom-20 w-1 bg-term-dim/30 rounded-full hidden md:block"></div>
        <div className="absolute -right-3 top-20 bottom-20 w-1 bg-term-dim/30 rounded-full hidden md:block"></div>

        {/* Header Bar */}
        <div className="bg-term-header border-b border-term-dim p-3 text-xs md:text-sm tracking-widest text-term-green/80 uppercase">
          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center">
            <span>Magistrate</span>
            <span className="text-term-dim">|</span>
            <span className="flex items-center gap-2">
              Judicial Terminal - Station Authority
              <Bank size={16} weight="duotone" />
            </span>
            <span className="text-term-dim">|</span>
            <span>Year {year}</span>
          </div>

          {/* Mobile Layout */}
          <div className="flex sm:hidden justify-between items-start">
            <div className="flex flex-col leading-tight">
              <span>Magistrate</span>
              <span>Year {year}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col text-right leading-tight gap-1">
                <span>Judicial Terminal</span>
                <span>Station Authority</span>
              </div>
              <Bank size={32} weight="duotone" className="flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-8 relative flex-1 min-h-0 flex flex-col">
          {children}
        </div>

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 scanlines opacity-30 z-50 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/20 z-40"></div>
      </div>
    </div>
  );
}
