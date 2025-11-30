export default function Panel({ children, title, className = "", active = false, accentColor = null, showTopLeft = true, showTopRight = true, allowOverflow = false }) {
  // Use custom accent color if provided, otherwise default to term-green
  const borderColor = accentColor || '#a3e6aa';
  const titleColor = accentColor ? `${accentColor}bb` : '#a3e6aa';
  const dimBorderColor = accentColor ? `${accentColor}40` : 'rgba(163, 230, 170, 0.4)';

  return (
    <div className={`relative bg-term-panel/50 border p-1 ${allowOverflow ? 'flex flex-col' : ''} ${className}`} style={{ borderColor: dimBorderColor }}>
      {/* Outer Glow/Border effect */}
      <div className={`absolute inset-0 border pointer-events-none transition-all duration-300`} style={{ borderColor: active ? dimBorderColor : 'transparent', boxShadow: active ? `0 0 10px ${accentColor || '#a3e6aa'}1a` : 'none' }}></div>

      {/* Corner Brackets */}
      {showTopLeft && <div className="absolute top-0 left-0 w-3 h-3 border-l-2" style={{ borderColor }}></div>}
      {showTopRight && <div className="absolute top-0 right-0 w-3 h-3 border-r-2" style={{ borderColor }}></div>}
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2" style={{ borderColor }}></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2" style={{ borderColor }}></div>

      <div className={`bg-term-panel/80 w-full ${allowOverflow ? 'flex-1 min-h-0 overflow-auto' : 'h-full overflow-hidden'} ${title ? 'pt-6' : 'pt-4'} px-2 sm:px-3 pb-2 relative`}>
        {title && (
          <div className="absolute top-0 left-0 bg-term-dim/20 px-2 py-0.5 text-[10px] uppercase tracking-wider" style={{ color: titleColor }}>
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
