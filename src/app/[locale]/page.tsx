import { Button } from '@/components/atoms/Button'
import { ProjectCard } from '@/components/molecules/ProjectCard'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary } from '@/i18n/dictionaries'

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const { locale } = params;
  const payload = await getPayload({ config: configPromise })
  
  // Fetch real data from PayloadCMS with locale
  const profile = await payload.findGlobal({ slug: 'profile', locale: locale as any })
  const educationRes = await payload.find({ collection: 'education', sort: '-endDate', locale: locale as any })
  const skillsRes = await payload.find({ collection: 'skills', locale: locale as any })
  const experienceRes = await payload.find({ collection: 'experience', sort: '-startDate', locale: locale as any })
  const projectsRes = await payload.find({ collection: 'projects', sort: '-completionDate', locale: locale as any })

  const objective = profile.objective || "NONE"
  const educations = educationRes.docs
  const skills = skillsRes.docs
  const technicalSkills = skills.filter(s => s.category === 'Technical')
  const languageSkills = skills.filter(s => s.category === 'Language')
  const otherSkills = skills.filter(s => s.category === 'Other')
  const experiences = experienceRes.docs
  const personalProjects = projectsRes.docs

  const t = getDictionary(locale)

  return (
    <div className="space-y-32 relative z-10">
      {/* Hero / Objective Section */}
      <section className="pt-12 grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
        <div className="space-y-8 lg:col-span-3">
          <div className="inline-flex items-center gap-3 font-mono text-accent-lime text-xs tracking-widest border border-accent-lime/20 bg-accent-lime/5 px-3 py-1.5 uppercase">
            <span className="w-1.5 h-1.5 bg-accent-lime animate-pulse rounded-full"></span> 
            {t.available}
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-text-primary uppercase">
            IXXMMIVSDRGN <br />
            <span className="text-text-secondary font-mono tracking-tight">PORTFOLIO</span>
          </h1>
          <div className="h-[1px] w-32 bg-border-active"></div>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl leading-relaxed font-mono whitespace-pre-line">
            {objective}
          </p>
          <div className="flex gap-6 pt-6">
            <Button>{t.contact}</Button>
            <Button className="bg-transparent border-border-default text-text-secondary hover:text-text-primary hover:border-text-primary">
              {t.resume}
            </Button>
          </div>
        </div>
        
        {/* Photo Placeholder Space */}
        <div className="hidden lg:flex lg:col-span-2 justify-end relative">
          <div className="aspect-[3/4] relative w-full max-w-[320px] border border-border-default bg-bg-secondary p-3">
            {/* Tactical decoration */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent-amber"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent-amber"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent-amber"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent-amber"></div>
            
            {/* The Image Area */}
            <div className="w-full h-full bg-bg-elevated flex flex-col items-center justify-center text-center p-6 grayscale hover:grayscale-0 transition-all overflow-hidden relative group">
               <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
               <span className="font-mono text-text-secondary text-sm group-hover:text-text-primary transition-colors z-10">[ PROFILE_PHOTO ]</span>
               <span className="font-mono text-accent-lime text-xs mt-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">700x900</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section>
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
                  <span className="text-accent-lime">{exp.company}</span> • {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                </div>
                
                {exp.projects && exp.projects.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <div className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">{t.projectsLabel}</div>
                    {exp.projects.map((proj: any, pIdx: number) => (
                      <div key={pIdx} className="bg-bg-secondary border border-border-default p-4">
                        <div className="font-bold text-text-primary mb-1">{proj.projectName}</div>
                        <div className="font-mono text-xs text-accent-amber mb-2">{t.roleLabel} {proj.projectRole}</div>
                        <p className="text-sm text-text-secondary">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="font-mono text-text-secondary">NONE</div>
        )}
      </section>

      {/* Personal Projects Section */}
      <section>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-2xl font-bold font-sans">{t.personalProjectsLabel}</h2>
          <div className="h-[1px] flex-1 bg-border-default"></div>
        </div>
        
        {personalProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalProjects.map((project: any, idx) => (
              <ProjectCard 
                key={project.slug || idx}
                title={project.title}
                slug={project.slug}
                status={project.status || 'COMPLETED'}
                summary={project.summary}
                index={idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="font-mono text-text-secondary">NONE</div>
        )}
      </section>

      {/* Education & Skills Section (Two Columns) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Education */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold font-sans">{t.education}</h2>
            <div className="h-[1px] flex-1 bg-border-default"></div>
          </div>
          
          {educations.length > 0 ? (
            <div className="space-y-6">
              {educations.map((edu: any, idx) => (
                <div key={idx} className="bg-bg-secondary border border-border-default p-6">
                  <h3 className="text-lg font-bold text-text-primary mb-1">{edu.school}</h3>
                  <div className="font-mono text-sm text-accent-lime mb-3">{edu.major}</div>
                  <div className="flex justify-between items-center text-sm text-text-secondary font-mono">
                    <span>{edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ''}</span>
                    <span>GPA: {edu.gpa} {edu.graduationType ? `(${t.graduation[edu.graduationType as string] || edu.graduationType})` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono text-text-secondary">NONE</div>
          )}
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold font-sans">{t.skillsLabel}</h2>
            <div className="h-[1px] flex-1 bg-border-default"></div>
          </div>
          
          {skills.length > 0 ? (
            <div className="space-y-6">
              {technicalSkills.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3">{t.technical}</h4>
                  <div className="flex flex-wrap gap-2">
                    {technicalSkills.map((skill: any, idx) => (
                      <span key={idx} className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono">{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {languageSkills.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3 mt-6">{t.language}</h4>
                  <div className="flex flex-wrap gap-2">
                    {languageSkills.map((skill: any, idx) => (
                      <span key={idx} className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono text-accent-amber">{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {otherSkills.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3 mt-6">{t.other}</h4>
                  <div className="flex flex-wrap gap-2">
                    {otherSkills.map((skill: any, idx) => (
                      <span key={idx} className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono">{skill.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="font-mono text-text-secondary">NONE</div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-bg-elevated border border-border-default p-12 text-center relative overflow-hidden mt-32">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(var(--color-text-secondary) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold">{t.ctaTitle}</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            {t.ctaDesc}
          </p>
          <Button className="!border-accent-lime !text-accent-lime hover:!bg-accent-lime/10">{t.contact}</Button>
        </div>
      </section>
    </div>
  )
}
