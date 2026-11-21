import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Category, Post, Tag } from '@/payload-types'
import type { DisplayType } from '@/lib/blog'

const COLOR: Record<string, string> = {
  amber: 'text-accent-amber border-accent-amber/40 bg-accent-amber/5',
  lime: 'text-accent-lime border-accent-lime/40 bg-accent-lime/5',
  neutral: 'text-text-secondary border-border-default bg-bg-elevated',
  danger: 'text-accent-danger border-accent-danger/40 bg-accent-danger/5',
}

/** Small uppercase category badge; links to the filtered blog list */
export function CategoryBadge({ category, locale }: { category: Category; locale: string }) {
  return (
    <Link
      href={`/${locale}/blog?category=${category.slug}`}
      className={`relative z-10 inline-block font-mono text-[10px] uppercase tracking-widest border px-1.5 py-0.5 hover:brightness-125 transition ${
        COLOR[category.color ?? 'neutral'] ?? COLOR.neutral
      }`}
    >
      {category.name}
    </Link>
  )
}

export function TagList({ tags, locale }: { tags: Tag[]; locale: string }) {
  if (!tags.length) return null
  return (
    <div className="relative z-10 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
      {tags.map((t) => (
        <Link
          key={t.id}
          href={`/${locale}/blog?tag=${t.slug}`}
          className="text-text-secondary hover:text-accent-lime transition-colors"
        >
          #{t.name}
        </Link>
      ))}
    </div>
  )
}

/**
 * Post body rendered according to the category's display type:
 * - article: normal rich text
 * - verse:   centered, keeps line breaks, stanza spacing
 * - quote:   large text
 */
export function PostBody({
  post,
  displayType,
  size = 'full',
}: {
  post: Post
  displayType: DisplayType
  size?: 'card' | 'full'
}) {
  if (!post.content) return null
  const variant =
    displayType === 'verse'
      ? 'post-verse'
      : displayType === 'quote'
        ? size === 'card'
          ? 'post-quote post-quote--card'
          : 'post-quote'
        : 'post-article'
  return <RichText data={post.content} className={`post-body ${variant}`} />
}

/** "— Author" line used by verse and quote posts */
export function Attribution({ author }: { author?: string | null }) {
  if (!author) return null
  return <p className="font-mono text-sm text-text-secondary">— {author}</p>
}
