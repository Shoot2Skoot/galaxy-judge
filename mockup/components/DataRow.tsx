import React from 'react';

interface DataRowProps {
  label: string;
  value: string | number;
}

const DataRow: React.FC<DataRowProps> = ({ label, value }) => {
  return (
    <div className="flex border-b border-term-dim/30 last:border-0 h-10 group">
      <div className="w-1/3 bg-term-dim/10 flex items-center px-4 text-term-dim font-bold text-sm uppercase tracking-wide border-r border-term-dim/30">
        {label}:
      </div>
      <div className="w-2/3 flex items-center px-4 text-term-green text-lg tracking-wider relative">
        {value}
        
        {/* Decorative Data Readout Graphic */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-32 h-2 flex gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="h-full w-[2px] bg-term-green/20"></div>
            <div className="h-full w-1/3 bg-term-green/20"></div>
            <div className="h-full w-[2px] bg-term-green/20"></div>
            <div className="h-full w-1/4 bg-term-green/40"></div>
            <div className="h-full w-[2px] bg-term-green/20"></div>
            <div className="h-full flex-grow bg-term-dim/10 text-[6px] leading-[8px] overflow-hidden text-term-green/40 pl-1">
                 DATA READOUT
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataRow;