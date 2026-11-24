import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { categoryOf, getPostBySlug, tagsOf } from '@/lib/blog'
import { formatFullDate } from '@/lib/date'
import {
  Attribution,
  CategoryBadge,
  hasRichText,
  Meaning,
  PostBody,
  Sources,
  TagList,
  Translation,
} from '@/components/blog/PostParts'
import { lexicalToText } from '@/collections/Posts'
import { EditPostLink } from '@/components/blog/EditPostLink'

/** cached (ISR); admin edits refresh it immediately via revalidatePath */
export const revalidate = 300

/** posts render on first request, then cache */
export function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}
  return {
    title: `${post.title} · IXXMMIVSDRGN`,
    description: post.excerpt || lexicalToText(post.meaning).slice(0, 200) || undefined,
  }
}

const label = 'font-mono text-xs uppercase tracking-widest text-accent-amber'

/**
 * Post page: magazine-style header (cover image as background when present), then the body and
 * the extras (meaning / translation / sources) side by side 50/50 on large screens, stacked below.
 */
export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = await getPostBySlug(decodeURIComponent(slug), locale)
  if (!post) notFound()

  const t = getDictionary(locale)
  const category = categoryOf(post)
  const tags = tagsOf(post)
  const displayType = category?.displayType ?? 'article'
  const centered = displayType !== 'article'
  const cover = post.coverImage && typeof post.coverImage === 'object' ? post.coverImage : null
  const hasTranslation = Boolean(post.translation?.trim())
  const hasMeaning = hasRichText(post.meaning)
  const hasSources = Boolean(post.sources?.length)
  const hasExtras = hasTranslation || hasMeaning || hasSources

  const body = (
    <div className={centered ? 'text-center lg:px-6' : ''}>
      <PostBody post={post} displayType={displayType} />
      {post.author && (
        <div className="mt-5">
          <Attribution author={post.author} />
        </div>
      )}
    </div>
  )

  return (
    <article className="pb-8 space-y-8">
      <header
        className="relative -mx-4 overflow-hidden border-b border-border-default bg-bg-secondary"
        style={
          cover?.url
            ? {
                backgroundImage: `url(${cover.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {cover?.url && <div className="absolute inset-0 bg-bg-primary/75" />}
        <div className="relative px-4 py-6 md:py-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/${locale}/blog`}
              className="font-mono text-sm text-text-secondary hover:text-accent-amber"
            >
              ← {t.blogBack}
            </Link>
            <EditPostLink id={post.id} label={t.blogEdit} variant="page" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.95] break-words">
              {post.title}
            </h1>
            <div className="flex flex-wrap lg:flex-col lg:items-end gap-x-3 gap-y-1.5 font-mono text-xs text-text-secondary">
              {category && <CategoryBadge category={category} locale={locale} />}
              <time>{formatFullDate(post.publishedAt, locale)}</time>
              {post.author && <span>{post.author}</span>}
              {displayType === 'article' && (
                <span>
                  {post.readingTime} {t.blogReadingTime}
                </span>
              )}
              {post.series && (
                <Link
                  href={`/${locale}/blog?series=${encodeURIComponent(post.series)}`}
                  className="text-accent-amber hover:underline"
                >
                  {t.blogSeries}: {post.series}
                </Link>
              )}
              {post.visibility === 'archived' && (
                <span className="uppercase tracking-widest border border-dashed border-border-default px-1.5 py-0.5">
                  {t.blogArchived}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {hasExtras ? (
        <div className="grid gap-8 lg:gap-10 items-start lg:grid-cols-2">
          <div className="min-w-0">{body}</div>
          <div className="space-y-6 min-w-0 lg:border-l lg:border-border-default lg:pl-10">
            {hasMeaning && (
              <section className="border-l-2 border-accent-amber bg-bg-secondary p-4 md:p-5 space-y-3">
                <h2 className={label}>{t.blogMeaning}</h2>
                <Meaning value={post.meaning} />
              </section>
            )}
            {hasTranslation && (
              <details open={locale === 'en'}>
                <summary className={`${label} cursor-pointer select-none`}>
                  {t.blogTranslation}
                </summary>
                <div className="mt-3">
                  <Translation text={post.translation} />
                </div>
              </details>
            )}
            <Sources sources={post.sources} title={t.blogSources} />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">{body}</div>
      )}

      {tags.length > 0 && (
        <footer className="border-t border-border-default pt-5">
          <TagList tags={tags} locale={locale} />
        </footer>
      )}
    </article>
  )
}
