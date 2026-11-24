import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary, isLocale } from '@/i18n/dictionaries'
import { getBlogIndex } from '@/lib/blog'
import { PostCard } from '@/components/blog/PostCard'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    category?: string
    tag?: string
    series?: string
    page?: string
    archive?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = getDictionary(locale)
  return { title: `${t.blogTitle} · IXXMMIVSDRGN`, description: t.blogIntro }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const { category, tag, series, page: pageParam, archive: archiveParam } = await searchParams
  const archive = archiveParam === '1'
  const page = Math.max(1, Number(pageParam) || 1)
  const t = getDictionary(locale)

  const { posts, categories, tags } = await getBlogIndex({
    locale,
    category,
    tag,
    series,
    archive,
    page,
  })

  /** Build a list URL keeping the other filters */
  const href = (next: {
    category?: string | null
    tag?: string | null
    page?: number
    archive?: boolean
  }) => {
    const q = new URLSearchParams()
    const c = next.category === undefined ? category : next.category
    const tg = next.tag === undefined ? tag : next.tag
    if (c) q.set('category', c)
    if (tg) q.set('tag', tg)
    if (series) q.set('series', series)
    if (next.archive ?? archive) q.set('archive', '1')
    if (next.page && next.page > 1) q.set('page', String(next.page))
    const s = q.toString()
    return `/${locale}/blog${s ? `?${s}` : ''}`
  }

  const activeCategory = categories.find((c) => c.slug === category)
  const activeTag = tags.find((x) => x.slug === tag)
  const hasFilters = Boolean(category || tag || series || archive)

  const chip = (active: boolean) =>
    `shrink-0 px-3 py-1.5 border font-mono text-xs transition-colors whitespace-nowrap ${
      active
        ? 'border-accent-lime text-accent-lime bg-accent-lime/5'
        : 'border-border-default text-text-secondary hover:text-text-primary hover:border-border-active'
    }`

  return (
    <div className="py-10 md:py-14 space-y-8">
      {/* Heading */}
      <header className="space-y-3">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">{t.blogTitle}</h1>
        <p className="font-mono text-text-secondary">
          {activeCategory?.description || t.blogIntro}
        </p>
      </header>

      {/* Category tabs */}
      <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        <Link href={href({ category: null, page: 1 })} className={chip(!category)}>
          {t.blogAll}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={href({ category: c.slug, page: 1 })}
            className={chip(c.slug === category)}
          >
            {c.name}
          </Link>
        ))}
        {/* archived posts: a separate list, combinable with the category/tag filters */}
        <Link
          href={href({ archive: !archive, page: 1 })}
          aria-pressed={archive}
          className={`${chip(archive)} ml-auto border-dashed`}
        >
          {t.blogArchive}
        </Link>
      </nav>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
          <span className="text-text-secondary/60 uppercase tracking-widest">{t.blogTags}:</span>
          {tags.map((x) => (
            <Link
              key={x.id}
              href={href({ tag: x.slug === tag ? null : x.slug, page: 1 })}
              className={
                x.slug === tag ? 'text-accent-lime' : 'text-text-secondary hover:text-accent-lime'
              }
            >
              #{x.name}
            </Link>
          ))}
        </div>
      )}

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-secondary border-l-2 border-accent-amber pl-3">
          {archive && <span>{t.blogArchive}</span>}
          {activeCategory && <span>{activeCategory.name}</span>}
          {activeTag && <span>#{activeTag.name}</span>}
          {series && (
            <span>
              {t.blogSeries}: {series}
            </span>
          )}
          <span>· {posts.totalDocs}</span>
          <Link href={`/${locale}/blog`} className="text-accent-amber hover:underline">
            {t.blogClearFilters} ✕
          </Link>
        </div>
      )}

      {/* Posts – masonry so short quotes and long poems pack nicely */}
      {posts.docs.length > 0 ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {posts.docs.map((post) => (
            <PostCard key={post.id} post={post} locale={locale} t={t} />
          ))}
        </div>
      ) : (
        <p className="font-mono text-text-secondary py-16 text-center">{t.blogEmpty}</p>
      )}

      {/* Pagination */}
      {posts.totalPages > 1 && (
        <nav className="flex justify-between font-mono text-sm">
          {posts.hasPrevPage ? (
            <Link href={href({ page: page - 1 })} className="text-accent-amber hover:underline">
              ← {t.blogPrev}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-text-secondary">
            {page} / {posts.totalPages}
          </span>
          {posts.hasNextPage ? (
            <Link href={href({ page: page + 1 })} className="text-accent-amber hover:underline">
              {t.blogNext} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  )
}
