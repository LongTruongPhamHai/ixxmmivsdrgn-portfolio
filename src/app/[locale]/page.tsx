import { HeroSection } from '@/components/organisms/HeroSection'
import { ExperienceSection } from '@/components/organisms/ExperienceSection'
import { ProjectsSection } from '@/components/organisms/ProjectsSection'
import { EducationSection } from '@/components/organisms/EducationSection'
import { SkillsSection } from '@/components/organisms/SkillsSection'
import { ContactSection } from '@/components/organisms/ContactSection'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary } from '@/i18n/dictionaries'

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const { locale } = params
  const payload = await getPayload({ config: configPromise })

  // Fetch real data from PayloadCMS with locale
  const profile = await payload.findGlobal({ slug: 'profile', locale: locale as any })
  const educationRes = await payload.find({
    collection: 'education',
    sort: '-endDate',
    locale: locale as any,
  })
  const skillsRes = await payload.find({ collection: 'skills', locale: locale as any })
  const experienceRes = await payload.find({
    collection: 'experience',
    sort: '-startDate',
    locale: locale as any,
  })
  const projectsRes = await payload.find({
    collection: 'projects',
    sort: '-completionDate',
    locale: locale as any,
  })

  const objective = profile.objective || 'NONE'
  const fullName = profile.fullName || null
  const dateOfBirth = profile.dateOfBirth
    ? new Date(profile.dateOfBirth).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US')
    : null
  const address = profile.address || null
  const phone = profile.phone || null
  const email = profile.email || null
  const educations = educationRes.docs
  const skills = skillsRes.docs
  const technicalSkills = skills.filter((s) => s.category === 'Technical')
  const languageSkills = skills.filter((s) => s.category === 'Language')
  const otherSkills = skills.filter((s) => s.category === 'Other')
  const experiences = experienceRes.docs
  const personalProjects = projectsRes.docs

  const t = getDictionary(locale)

  return (
    <div className="space-y-20 relative z-10">
      {/* Hero / Objective Section */}
      <HeroSection
        objective={objective}
        fullName={fullName}
        dateOfBirth={dateOfBirth}
        address={address}
        translations={t}
      />

      {/* Experience Section */}
      <ExperienceSection experiences={experiences} translations={t} />

      {/* Projects Section */}
      <ProjectsSection projects={personalProjects} translations={t} />

      {/* Education + Skills Section */}
      <section
        id="education"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 scroll-mt-20"
      >
        <EducationSection educations={educations} translations={t} />
        <SkillsSection
          technicalSkills={technicalSkills}
          languageSkills={languageSkills}
          otherSkills={otherSkills}
          translations={t}
        />
      </section>

      {/* CTA Section */}
      <ContactSection phone={phone} email={email} translations={t} />
    </div>
  )
}
