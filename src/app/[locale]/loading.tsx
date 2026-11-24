/** Shown instantly while the next page renders on the server */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="py-10 md:py-14 space-y-6 animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="h-3 w-32 bg-bg-secondary" />
      <div className="h-10 md:h-14 w-3/4 max-w-2xl bg-bg-secondary" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-4 bg-bg-secondary" style={{ width: `${90 - i * 8}%` }} />
          ))}
        </div>
        <div className="hidden md:block h-48 bg-bg-secondary" />
      </div>
    </div>
  )
}
