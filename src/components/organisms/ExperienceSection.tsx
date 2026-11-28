import { formatMonthNumeric } from '@/lib/date'

interface ExperienceSectionProps {
  experiences: any[]
  translations: any
}

export function ExperienceSection({ experiences, translations: t }: ExperienceSectionProps) {
  return (
    <section id="experience" className="scroll-mt-20">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-bold font-sans">{t.experience}</h2>
        <div className="h-[1px] flex-1 bg-border-default"></div>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-12 border-l border-border-default ml-2 pl-8">
          {experiences.map((exp: any, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-10 mt-1.5 w-4 h-4 bg-bg-primary border-2 border-accent-amber rounded-full"></div>
              <h3 className="text-xl font-bold text-text-primary">{exp.role}</h3>
              <div className="font-mono text-sm text-text-secondary mt-1 mb-4">
                {exp.url ? (
                  <a 
                    href={exp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent-lime hover:text-accent-amber transition-colors underline decoration-dotted"
                  >
                    {exp.company}
                  </a>
                ) : (
                  <span className="text-accent-lime">{exp.company}</span>
                )} •{' '}
                {formatMonthNumeric(exp.startDate)} - {exp.endDate ? formatMonthNumeric(exp.endDate) : t.present}
              </div>

              {exp.projects && exp.projects.length > 0 && (
                <div className="space-y-4 mt-6">
                  <div className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
                    {t.projectsLabel}
                  </div>
                  {exp.projects.map((proj: any, pIdx: number) => (
                    <div key={pIdx} className="border border-border-default bg-bg-secondary p-4">
                      <div className="flex items-start justify-between mb-2">
                        {proj.url ? (
                          <a 
                            href={proj.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-bold text-text-primary hover:text-accent-amber transition-colors underline decoration-dotted"
                          >
                            {proj.projectName}
                          </a>
                        ) : (
                          <h4 className="font-bold text-text-primary">{proj.projectName}</h4>
                        )}
                        {/* <div className="font-mono text-xs text-text-secondary">
                          {proj.startDate
                            ? new Date(proj.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : ''}{' '}
                          -{' '}
                          {proj.endDate
                            ? new Date(proj.endDate).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Present'}
                        </div> */}
                      </div>
                      <p className="text-sm text-text-secondary text-justify mb-3">
                        {proj.description}
                      </p>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {proj.technologies.map((tech: string, tIdx: number) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 bg-bg-elevated border border-border-default text-xs font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="font-mono text-text-secondary">{t.none}</div>
      )}
    </section>
  )
}
