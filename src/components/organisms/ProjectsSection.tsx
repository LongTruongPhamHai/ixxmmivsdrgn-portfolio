import { ProjectCard } from '@/components/molecules/ProjectCard'
import type { Project } from '@/payload-types'

interface ProjectsSectionProps {
  projects: Project[]
  locale: string
  translations: any
}

export function ProjectsSection({ projects, locale, translations: t }: ProjectsSectionProps) {
  return (
    <section id="projects" className="scroll-mt-20">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-bold font-sans">{t.personalProjectsLabel}</h2>
        <div className="h-[1px] flex-1 bg-border-default"></div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              status="COMPLETED"
              summary={project.summary}
              index={idx + 1}
              locale={locale}
              completionDate={project.completionDate}
              demoUrl={project.links?.demo}
              repoUrl={project.links?.repo}
              translations={t}
            />
          ))}
        </div>
      ) : (
        <div className="font-mono text-text-secondary">{t.none}</div>
      )}
    </section>
  )
}
