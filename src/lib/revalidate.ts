import { revalidatePath } from 'next/cache'
import type { CollectionConfig, GlobalConfig } from 'payload'

/**
 * Public pages are cached (ISR). When content changes in the admin, drop the cache of every
 * page under the root layout so visitors see the edit right away.
 * Outside a Next.js request (seed scripts, migrations) revalidatePath throws – ignore that.
 */
const revalidateSite = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // not running inside Next.js
  }
}

export const withRevalidate = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  hooks: {
    ...c.hooks,
    afterChange: [...(c.hooks?.afterChange ?? []), () => revalidateSite()],
    afterDelete: [...(c.hooks?.afterDelete ?? []), () => revalidateSite()],
  },
})

export const withRevalidateGlobal = (g: GlobalConfig): GlobalConfig => ({
  ...g,
  hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), () => revalidateSite()] },
})
