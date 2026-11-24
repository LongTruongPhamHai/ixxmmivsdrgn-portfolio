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
  TagList,
  Translation,
} from '@/components/blog/PostParts'
import { lexicalToText } from '@/collections/Posts'

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

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = await getPostBySlug(decodeURIComponent(slug), locale)
  if (!post) notFound()

  const t = getDictionary(locale)
  const category = categoryOf(post)
  const displayType = category?.displayType ?? 'article'
  const centered = displayType !== 'article'
  const cover = post.coverImage && typeof post.coverImage === 'object' ? post.coverImage : null

  return (
    <article className="py-10 md:py-14 max-w-3xl mx-auto space-y-8">
      <Link
        href={`/${locale}/blog`}
        className="font-mono text-sm text-text-secondary hover:text-accent-amber"
      >
        ← {t.blogBack}
      </Link>

      {/* Meta */}
      <header className={`space-y-4 ${centered ? 'text-center' : ''}`}>
        <div
          className={`flex flex-wrap items-center gap-3 font-mono text-xs text-text-secondary ${centered ? 'justify-center' : ''}`}
        >
          {category && <CategoryBadge category={category} locale={locale} />}
          <time>{formatFullDate(post.publishedAt, locale)}</time>
          {displayType === 'article' && (
            <span>
              · {post.readingTime} {t.blogReadingTime}
            </span>
          )}
          {post.series && (
            <Link
              href={`/${locale}/blog?series=${encodeURIComponent(post.series)}`}
              className="text-accent-amber hover:underline"
            >
              · {t.blogSeries}: {post.series}
            </Link>
          )}
        </div>
        {displayType !== 'quote' && (
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
        )}
      </header>

      {cover?.url && (
        // eslint-disable-next-line @next/next/no-img-element -- CMS media URL
        <img
          src={cover.url}
          alt={cover.alt ?? ''}
          className="w-full border border-border-default"
        />
      )}

      {/* Body */}
      <div className={centered ? 'text-center' : ''}>
        <PostBody post={post} displayType={displayType} />
      </div>

      {centered && (
        <div className="text-center">
          <Attribution author={post.author} />
        </div>
      )}
      {!centered && post.author && <Attribution author={post.author} />}

      {/* reference translation: shown on the English site, folded away on the Vietnamese one */}
      {post.translation?.trim() &&
        (locale === 'en' ? (
          <section className="space-y-3 border-t border-border-default pt-6">
            <h2
              className={`font-mono text-xs uppercase tracking-widest text-accent-amber ${centered ? 'text-center' : ''}`}
            >
              {t.blogTranslation}
            </h2>
            <Translation text={post.translation} centered={centered} />
          </section>
        ) : (
          <details className="border-t border-border-default pt-4">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-accent-amber select-none">
              {t.blogTranslation}
            </summary>
            <div className="mt-3">
              <Translation text={post.translation} centered={centered} />
            </div>
          </details>
        ))}

      {hasRichText(post.meaning) && (
        <section className="border-l-2 border-accent-amber bg-bg-secondary p-4 md:p-6 space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-accent-amber">
            {t.blogMeaning}
          </h2>
          <Meaning value={post.meaning} />
        </section>
      )}

      <footer className="border-t border-border-default pt-6">
        <TagList tags={tagsOf(post)} locale={locale} />
      </footer>
    </article>
  )
}
