'use client'

import { ProjectCard } from '@/components/molecules/ProjectCard'

interface ProjectsSectionProps {
  projects: any[]
  translations: any
}

export function ProjectsSection({ projects, translations: t }: ProjectsSectionProps) {
  return (
    <section id="projects" className="scroll-mt-20">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-bold font-sans">{t.personalProjectsLabel}</h2>
        <div className="h-[1px] flex-1 bg-border-default"></div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any, idx) => (
            <ProjectCard
              key={project.slug || idx}
              title={project.title}
              slug={project.slug}
              status={project.status || 'COMPLETED'}
              summary={project.summary}
              index={idx + 1}
              completionDate={project.completionDate}
              demoUrl={project.links?.demo}
              translations={t}
            />
          ))}
        </div>
      ) : (
        <div className="font-mono text-text-secondary">NONE</div>
      )}
    </section>
  )
}
