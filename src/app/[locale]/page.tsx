import { HeroSection } from '@/components/organisms/HeroSection'
import { ExperienceSection } from '@/components/organisms/ExperienceSection'
import { ProjectsSection } from '@/components/organisms/ProjectsSection'
import { EducationSection } from '@/components/organisms/EducationSection'
import { SkillsSection } from '@/components/organisms/SkillsSection'
import { ContactSection } from '@/components/organisms/ContactSection'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { formatFullDate } from '@/lib/date'

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  const payload = await getPayload({ config: configPromise })

  // Fetch everything in parallel; pagination: false so nothing is cut off at the default limit of 10
  const [profile, educationRes, skillsRes, experienceRes, projectsRes] = await Promise.all([
    payload.findGlobal({ slug: 'profile', locale }),
    payload.find({ collection: 'education', sort: '-endDate', locale, pagination: false }),
    payload.find({ collection: 'skills', locale, pagination: false }),
    payload.find({ collection: 'experience', sort: '-startDate', locale, pagination: false }),
    payload.find({ collection: 'projects', sort: '-completionDate', locale, pagination: false }),
  ])

  const objective = profile.objective || ''
  const fullName = profile.fullName || null
  const dateOfBirth = formatFullDate(profile.dateOfBirth, locale) || null
  const address = profile.address || null
  const phone = profile.phone || null
  const email = profile.email || null
  const avatar =
    profile.avatar && typeof profile.avatar === 'object' && profile.avatar.url
      ? { url: profile.avatar.url, alt: profile.avatar.alt || fullName || '' }
      : null
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
        avatar={avatar}
        dateOfBirth={dateOfBirth}
        address={address}
        translations={t}
      />

      {/* Experience Section */}
      <ExperienceSection experiences={experiences} translations={t} />

      {/* Projects Section */}
      <ProjectsSection projects={personalProjects} locale={locale} translations={t} />

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
