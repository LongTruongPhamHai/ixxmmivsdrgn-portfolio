import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { HomeIntro } from '@/components/organisms/HomeIntro'
import { PostCard } from '@/components/blog/PostCard'
import { visiblePosts } from '@/lib/blog'

/** cached (ISR); admin edits refresh it immediately via revalidatePath */
export const revalidate = 300

const POSTS_ON_HOME = 6

/** Home: short intro + basic info from the CV + latest/featured blog posts */
export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()

  const payload = await getPayload({ config: configPromise })
  const [profile, experienceRes, postsRes] = await Promise.all([
    payload.findGlobal({ slug: 'profile', locale }),
    payload.find({ collection: 'experience', sort: '-startDate', locale, limit: 1 }),
    payload.find({
      collection: 'posts',
      locale,
      where: visiblePosts(),
      sort: ['-featured', '-publishedAt'],
      limit: POSTS_ON_HOME,
      depth: 1,
    }),
  ])

  const t = getDictionary(locale)
  const latestJob = experienceRes.docs[0]
  const avatar =
    profile.avatar && typeof profile.avatar === 'object' && profile.avatar.url
      ? { url: profile.avatar.url, alt: profile.avatar.alt || profile.fullName || '' }
      : null

  return (
    <div className="space-y-20 relative z-10 pb-10">
      <HomeIntro
        locale={locale}
        fullName={profile.fullName ?? null}
        avatar={avatar}
        address={profile.address ?? null}
        email={profile.email ?? null}
        currentRole={
          latestJob && !latestJob.endDate
            ? { role: latestJob.role, company: latestJob.company }
            : null
        }
        t={t}
      />

      {postsRes.docs.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold font-sans">{t.homeLatestPosts}</h2>
            <div className="h-[1px] flex-1 bg-border-default"></div>
            <Link
              href={`/${locale}/blog`}
              className="font-mono text-sm text-accent-amber hover:underline whitespace-nowrap"
            >
              {t.homeAllPosts} →
            </Link>
          </div>
          {/*
            Masonry in reading order: post i goes to column i % n, so the newest posts run
            left → right across the top and every card keeps its natural height (no gaps).
            One layout per breakpoint (1 / 2 / 3 columns); the hidden ones use display:none.
          */}
          {(
            [
              [1, 'md:hidden'],
              [2, 'hidden md:grid lg:hidden'],
              [3, 'hidden lg:grid'],
            ] as const
          ).map(([n, visibility]) => (
            <div
              key={n}
              className={`${visibility} ${n === 1 ? '' : n === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 items-start`}
            >
              {Array.from({ length: n }, (_, col) => (
                <div key={col} className="min-w-0">
                  {postsRes.docs
                    .filter((_, i) => i % n === col)
                    .map((post) => (
                      <PostCard key={post.id} post={post} locale={locale} t={t} />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
