import Link from 'next/link'
import { StatusPill } from '../atoms/StatusPill'

interface ProjectCardProps {
  title: string
  slug: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  summary: string
  index: number
  completionDate?: string
}

export function ProjectCard({
  title,
  slug,
  completionDate,
  status,
  summary,
  index,
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
          <StatusPill status={status} />
        </div>

        {/* Hàng 2: Title */}
        <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-amber transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Hàng 3: Summary */}
        <p className="text-text-secondary text-sm line-clamp-3 text-justify">{summary}</p>
      </div>
    </Link>
  )
}
