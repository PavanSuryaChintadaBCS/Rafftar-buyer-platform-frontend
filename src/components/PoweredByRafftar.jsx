/**
 * Brand lockup per #RAFTTAAR.ai spec: # and . use foreground; RAFTTAAR = primary orange; ai = red.
 */
export function PoweredByRafftar({ className = "" }) {
  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-x-1 text-[10px] sm:text-xs ${className}`.trim()}
    >
      <span className="font-medium text-muted-foreground">powered by</span>
      <span className="font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <span className="text-foreground">#</span>
        <span className="text-primary">RAFTTAAR</span>
        <span className="text-foreground">.</span>
        <span className="lowercase text-[hsl(var(--raftaar-ai))]">ai</span>
      </span>
    </span>
  );
}
