interface SkillsSectionProps {
  technicalSkills: any[]
  languageSkills: any[]
  otherSkills: any[]
  translations: any
}

export function SkillsSection({ 
  technicalSkills, 
  languageSkills, 
  otherSkills,
  translations: t 
}: SkillsSectionProps) {
  const hasSkills = technicalSkills.length > 0 || languageSkills.length > 0 || otherSkills.length > 0

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-sans">{t.skillsLabel}</h2>
        <div className="h-[1px] flex-1 bg-border-default"></div>
      </div>
      
      {hasSkills ? (
        <div className="space-y-6">
          {technicalSkills.length > 0 && (
            <div>
              <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3">{t.technical}</h4>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((skill: any, idx) => (
                  skill.docsUrl ? (
                    <a 
                      key={idx} 
                      href={skill.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono hover:border-accent-amber hover:text-accent-amber transition-colors"
                    >
                      {skill.name}
                    </a>
                  ) : (
                    <span key={idx} className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono">{skill.name}</span>
                  )
                ))}
              </div>
            </div>
          )}
          
          {languageSkills.length > 0 && (
            <div>
              <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3 mt-6">{t.language}</h4>
              <div className="flex flex-wrap gap-2">
                {languageSkills.map((skill: any, idx) => (
                  skill.docsUrl ? (
                    <a 
                      key={idx} 
                      href={skill.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono text-accent-amber hover:border-accent-amber hover:brightness-125 transition-all"
                    >
                      {skill.name}
                    </a>
                  ) : (
                    <span key={idx} className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono text-accent-amber">{skill.name}</span>
                  )
                ))}
              </div>
            </div>
          )}
          
          {otherSkills.length > 0 && (
            <div>
              <h4 className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-3 mt-6">{t.other}</h4>
              <div className="flex flex-wrap gap-2">
                {otherSkills.map((skill: any, idx) => (
                  skill.docsUrl ? (
                    <a 
                      key={idx} 
                      href={skill.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono hover:border-accent-amber hover:text-accent-amber transition-colors"
                    >
                      {skill.name}
                    </a>
                  ) : (
                    <span key={idx} className="px-3 py-1 bg-bg-elevated border border-border-default text-sm font-mono">{skill.name}</span>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="font-mono text-text-secondary">{t.none}</div>
      )}
    </div>
  )
}
