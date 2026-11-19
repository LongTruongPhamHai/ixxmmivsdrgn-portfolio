import Link from 'next/link'
import { StatusPill } from '../atoms/StatusPill'

interface ProjectCardProps {
  title: string
  slug: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  summary: string
  index: number
  completionDate?: string
  demoUrl?: string
  translations: {
    statusLabel: string
    statuses: Record<ProjectCardProps['status'], string>
    viewDemo: string
  }
}

export function ProjectCard({
  title,
  slug,
  completionDate,
  status,
  summary,
  index,
  demoUrl,
  translations,
}: ProjectCardProps) {
  const formattedIndex = String(index).padStart(2, '0')

  // Hàm format thời gian an toàn
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }) // Kết quả: "Jan 2026"
    } catch {
      return dateStr
    }
  }

  const displayDate = formatDate(completionDate) || `/${formattedIndex}`

  return (
    <Link
      href={`/projects/${slug}`}
      className="group block relative p-6 bg-bg-secondary border border-border-default hover:border-border-active transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-amber transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-amber transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-amber transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-amber transition-colors" />

      <div>
        {/* Hàng 1: completionDate (đã format) & StatusPill */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="font-mono text-xs text-text-secondary whitespace-nowrap">
            {displayDate}
          </span>
          <StatusPill status={status} translations={translations} />
        </div>

        {/* Hàng 2: Title with Demo Link */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-amber transition-colors line-clamp-2 flex-1">
            {title}
          </h3>
          {demoUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(demoUrl, '_blank', 'noopener,noreferrer')
              }}
              className="flex-shrink-0 p-1.5 text-text-secondary hover:text-accent-lime border border-border-default hover:border-accent-lime transition-colors"
              title={translations.viewDemo}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </button>
          )}
        </div>

        {/* Hàng 3: Summary */}
        <p className="text-text-secondary text-sm line-clamp-3 text-justify">{summary}</p>
      </div>
    </Link>
  )
}
