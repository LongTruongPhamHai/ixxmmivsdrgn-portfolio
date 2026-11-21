import Link from 'next/link'
import type { Post } from '@/payload-types'
import { categoryOf, tagsOf } from '@/lib/blog'
import { lexicalToText } from '@/collections/Posts'
import { formatFullDate } from '@/lib/date'
import { Attribution, CategoryBadge, PostBody, TagList } from './PostParts'

interface PostCardProps {
  post: Post
  locale: string
  t: {
    blogReadingTime: string
    blogMeaning: string
    blogFeatured: string
    blogReadMore: string
  }
}

/** One card in the blog list; its layout follows the category's display type */
export function PostCard({ post, locale, t }: PostCardProps) {
  const category = categoryOf(post)
  const displayType = category?.displayType ?? 'article'
  const href = `/${locale}/blog/${post.slug}`
  const date = formatFullDate(post.publishedAt, locale)
  // long poems are cut off in the card with a fade; short ones are shown whole
  const longVerse = displayType === 'verse' && lexicalToText(post.content).split('\n').length > 10

  return (
    <article className="group relative break-inside-avoid mb-6 bg-bg-secondary border border-border-default hover:border-border-active transition-colors p-6 space-y-4">
      {/* whole card is clickable (badge/tag links sit above it with z-10) */}
      <Link href={href} className="absolute inset-0" aria-label={post.title ?? ''} />

      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {category && <CategoryBadge category={category} locale={locale} />}
          {post.featured && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-lime">
              ★ {t.blogFeatured}
            </span>
          )}
        </div>
        <time className="font-mono text-xs text-text-secondary whitespace-nowrap">{date}</time>
      </header>

      {displayType === 'article' && (
        <>
          <h2 className="text-xl font-bold text-text-primary group-hover:text-accent-amber transition-colors">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="text-sm text-text-secondary line-clamp-4">{post.excerpt}</p>
          ) : (
            <div className="line-clamp-4 text-sm">
              <PostBody post={post} displayType="article" size="card" />
            </div>
          )}
          <div className="font-mono text-xs text-text-secondary">
            {post.readingTime} {t.blogReadingTime} · <span className="text-accent-amber">{t.blogReadMore} →</span>
          </div>
        </>
      )}

      {displayType === 'verse' && (
        <>
          {post.title && (
            <h2 className="text-lg font-bold text-center text-text-primary group-hover:text-accent-amber transition-colors">
              {post.title}
            </h2>
          )}
          <div
            className={
              longVerse ? 'max-h-80 overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)]' : ''
            }
          >
            <PostBody post={post} displayType="verse" size="card" />
          </div>
          <div className="text-center">
            <Attribution author={post.author} />
          </div>
        </>
      )}

      {displayType === 'quote' && (
        <>
          <PostBody post={post} displayType="quote" size="card" />
          <Attribution author={post.author} />
          {post.meaning && (
            <details className="relative z-10 font-mono text-sm">
              <summary className="cursor-pointer text-accent-amber select-none">{t.blogMeaning}</summary>
              <p className="mt-2 text-text-secondary whitespace-pre-line">{post.meaning}</p>
            </details>
          )}
        </>
      )}

      <TagList tags={tagsOf(post)} locale={locale} />
    </article>
  )
}
