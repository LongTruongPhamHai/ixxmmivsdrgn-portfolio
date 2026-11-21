import { StatusPill } from '../atoms/StatusPill'
import { formatMonthYear } from '@/lib/date'

interface ProjectCardProps {
  title: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  summary?: string | null
  index: number
  locale: string
  completionDate?: string | null
  demoUrl?: string | null
  repoUrl?: string | null
  translations: {
    statusLabel: string
    statuses: Record<ProjectCardProps['status'], string>
    viewDemo: string
    viewSource: string
  }
}

const cornerClass = 'absolute w-2 h-2 border-transparent group-hover:border-accent-amber transition-colors'

export function ProjectCard({
  title,
  completionDate,
  status,
  summary,
  index,
  locale,
  demoUrl,
  repoUrl,
  translations,
}: ProjectCardProps) {
  const displayDate = formatMonthYear(completionDate, locale) || `/${String(index).padStart(2, '0')}`

  return (
    <article className="group relative p-6 bg-bg-secondary border border-border-default hover:border-border-active transition-all duration-300 flex flex-col justify-between h-full">
      {/* Corner Brackets */}
      <div className={`${cornerClass} top-0 left-0 border-t border-l`} />
      <div className={`${cornerClass} top-0 right-0 border-t border-r`} />
      <div className={`${cornerClass} bottom-0 left-0 border-b border-l`} />
      <div className={`${cornerClass} bottom-0 right-0 border-b border-r`} />

      <div>
        {/* Row 1: completion date & status */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="font-mono text-xs text-text-secondary whitespace-nowrap">{displayDate}</span>
          <StatusPill status={status} translations={translations} />
        </div>

        {/* Row 2: title (links to source code if available) + demo link */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-amber transition-colors line-clamp-2 flex-1">
            {repoUrl ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={translations.viewSource}
                className="hover:underline decoration-dotted"
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 p-1.5 text-text-secondary hover:text-accent-lime border border-border-default hover:border-accent-lime transition-colors"
              title={translations.viewDemo}
              aria-label={translations.viewDemo}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Row 3: summary */}
        {summary && <p className="text-text-secondary text-sm line-clamp-3 text-justify">{summary}</p>}
      </div>
    </article>
  )
}
