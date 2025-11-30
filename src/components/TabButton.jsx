export default function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-2 text-center text-sm md:text-base font-bold uppercase tracking-widest transition-all duration-200
        border-t-2 border-x-2 relative overflow-hidden group
        ${isActive
          ? 'bg-term-green/10 text-term-green border-term-green shadow-[0_-5px_10px_rgba(163,230,170,0.1)]'
          : 'bg-black/40 text-term-dim border-term-dim/40 hover:text-term-green/70 hover:bg-term-green/5'}
      `}
    >
      {/* Active Indicator Top */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-term-green shadow-[0_0_5px_#a3e6aa]"></div>
      )}

      <span className="relative z-10">{label}</span>

      {/* Diagonal Scanlines for background */}
      {isActive && (
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,#a3e6aa_25%,#a3e6aa_50%,transparent_50%,transparent_75%,#a3e6aa_75%,#a3e6aa_100%)] bg-[length:4px_4px]"></div>
      )}
    </button>
  );
}
