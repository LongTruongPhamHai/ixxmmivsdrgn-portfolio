import { getPayload, type Where } from 'payload'
import configPromise from '@payload-config'
import type { Category, Post, Tag } from '@/payload-types'
import type { Locale } from '@/i18n/dictionaries'

export const POSTS_PER_PAGE = 24

export type DisplayType = Category['displayType']

/** Category of a post (populated relationship) */
export const categoryOf = (post: Post): Category | null =>
  post.category && typeof post.category === 'object' ? post.category : null

export const tagsOf = (post: Post): Tag[] =>
  (post.tags ?? []).filter((t): t is Tag => typeof t === 'object' && t !== null)

export async function getBlogIndex({
  locale,
  category,
  tag,
  series,
  page = 1,
}: {
  locale: Locale
  category?: string
  tag?: string
  series?: string
  page?: number
}) {
  const payload = await getPayload({ config: configPromise })

  const and: Where[] = [{ _status: { equals: 'published' } }]
  if (category) and.push({ 'category.slug': { equals: category } })
  if (tag) and.push({ 'tags.slug': { equals: tag } })
  if (series) and.push({ series: { equals: series } })

  const [posts, categories, tags] = await Promise.all([
    payload.find({
      collection: 'posts',
      locale,
      where: { and },
      sort: ['-featured', '-publishedAt'],
      limit: POSTS_PER_PAGE,
      page,
      depth: 1,
    }),
    payload.find({ collection: 'categories', locale, sort: 'name', pagination: false }),
    payload.find({ collection: 'tags', sort: 'name', pagination: false }),
  ])

  return { posts, categories: categories.docs, tags: tags.docs }
}

export async function getPostBySlug(slug: string, locale: Locale) {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'posts',
    locale,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
}
