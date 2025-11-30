import React from 'react';

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  active?: boolean;
}

const Panel: React.FC<PanelProps> = ({ children, title, className = "", active = false }) => {
  return (
    <div className={`relative bg-term-panel/50 border border-term-dim/40 p-1 ${className}`}>
      {/* Outer Glow/Border effect */}
      <div className={`absolute inset-0 border ${active ? 'border-term-green/40 shadow-[0_0_10px_rgba(163,230,170,0.1)]' : 'border-transparent'} pointer-events-none transition-all duration-300`}></div>

      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-term-green"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-term-green"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-term-green"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-term-green"></div>

      <div className="bg-term-panel/80 w-full h-full p-4 relative overflow-hidden">
        {title && (
            <div className="absolute top-0 left-0 bg-term-dim/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-term-green/70">
                {title}
            </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Panel;