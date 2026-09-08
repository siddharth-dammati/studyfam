export function PriceSection() {
  return (
    <section className="py-40 bg-[linear-gradient(to_bottom,var(--background-subtle),#FFFFFF)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMzcsOTksMjM1LDAuMDQpIi8+PC9zdmc+')] opacity-50" />
      
      <div className="relative z-10 max-w-[800px] mx-auto px-4 text-center">
        <div className="text-[clamp(6rem,20vw,14rem)] font-bold text-[var(--foreground)] leading-none tracking-tighter mb-12">
          ₹27
        </div>
        
        <div className="space-y-4 mb-16">
          <p className="text-2xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">ONE MOCK.</p>
          <p className="text-2xl md:text-4xl font-bold text-[var(--foreground-secondary)] tracking-tight">REALISTIC PERCENTILE.</p>
          <p className="text-2xl md:text-4xl font-bold text-[var(--foreground-muted)] tracking-tight">THOUSANDS OF ASPIRANTS.</p>
        </div>

        <p className="text-lg text-[var(--foreground-secondary)] font-medium max-w-lg mx-auto">
          Keeping the entry fee low means more serious aspirants can participate.
        </p>
      </div>
    </section>
  );
}
