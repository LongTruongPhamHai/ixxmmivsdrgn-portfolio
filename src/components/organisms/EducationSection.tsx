import { formatYear } from '@/lib/date'

interface EducationSectionProps {
  educations: any[]
  translations: any
}

export function EducationSection({ educations, translations: t }: EducationSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold font-sans">{t.education}</h2>
        <div className="h-[1px] flex-1 bg-border-default"></div>
      </div>
      
      {educations.length > 0 ? (
        <div className="space-y-6">
          {educations.map((edu: any, idx) => (
            <div key={idx} className="bg-bg-secondary border border-border-default p-6">
              {edu.schoolUrl ? (
                <a 
                  href={edu.schoolUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-text-primary mb-1 hover:text-accent-amber transition-colors underline decoration-dotted inline-block"
                >
                  {edu.school}
                </a>
              ) : (
                <h3 className="text-lg font-bold text-text-primary mb-1">{edu.school}</h3>
              )}
              <div className="font-mono text-sm text-accent-lime mb-3">{edu.major}</div>
              <div className="flex justify-between items-center text-sm text-text-secondary font-mono">
                <span>{formatYear(edu.startDate)} - {edu.endDate ? formatYear(edu.endDate) : t.present}</span>
                {edu.gpa && <span>GPA: {edu.gpa} {edu.graduationType ? `(${t.graduation[edu.graduationType as string] || edu.graduationType})` : ''}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="font-mono text-text-secondary">{t.none}</div>
      )}
    </div>
  )
}
