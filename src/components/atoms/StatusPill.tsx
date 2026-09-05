import { cn } from '@/lib/utils'

interface StatusPillProps {
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  translations: {
    statusLabel: string
    statuses: Record<StatusPillProps['status'], string>
  }
  className?: string
}

export function StatusPill({ status, translations: t, className }: StatusPillProps) {
  const statusConfig = {
    ACTIVE: {
      color: 'bg-accent-lime',
    },
    COMPLETED: {
      color: 'bg-accent-amber',
    },
    ARCHIVED: {
      color: 'bg-text-secondary',
    },
  }

  const config = statusConfig[status]

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 border border-border-default px-2 py-1 bg-bg-secondary text-font-mono text-xs uppercase tracking-wider',
        className,
      )}
    >
      <span className={cn('w-2 h-2 rounded-full animate-pulse', config.color)} />
      <span className="text-text-secondary">{t.statusLabel}:</span>
      <span className="text-text-primary">{t.statuses[status]}</span>
    </div>
  )
}
