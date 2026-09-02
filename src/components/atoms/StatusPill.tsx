import { cn } from "@/lib/utils"

interface StatusPillProps {
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const statusConfig = {
    ACTIVE: {
      color: 'bg-accent-lime',
      text: 'ACTIVE',
    },
    COMPLETED: {
      color: 'bg-accent-amber',
      text: 'COMPLETED',
    },
    ARCHIVED: {
      color: 'bg-text-secondary',
      text: 'ARCHIVED',
    },
  }

  const config = statusConfig[status]

  return (
    <div className={cn("inline-flex items-center gap-2 border border-border-default px-2 py-1 bg-bg-secondary text-font-mono text-xs uppercase tracking-wider", className)}>
      <span className={cn("w-2 h-2 rounded-full animate-pulse", config.color)} />
      <span className="text-text-secondary">STATUS:</span>
      <span className="text-text-primary">{config.text}</span>
    </div>
  )
}
