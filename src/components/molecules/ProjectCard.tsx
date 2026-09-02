import Link from 'next/link'
import { StatusPill } from '../atoms/StatusPill'

interface ProjectCardProps {
  title: string
  slug: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  summary: string
  index: number
}

export function ProjectCard({ title, slug, status, summary, index }: ProjectCardProps) {
  const formattedIndex = index.toString().padStart(3, '0')
  
  return (
    <Link href={`/projects/${slug}`} className="group block relative p-6 bg-bg-secondary border border-border-default hover:border-border-active transition-all duration-300">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-transparent group-hover:border-accent-amber transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-accent-amber transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-accent-amber transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-transparent group-hover:border-accent-amber transition-colors" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="text-font-mono text-text-secondary text-xs">
          N° {formattedIndex}
        </div>
        <StatusPill status={status} />
      </div>
      
      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-amber transition-colors">
        {title}
      </h3>
      
      <p className="text-text-secondary text-sm line-clamp-3">
        {summary}
      </p>
    </Link>
  )
}
