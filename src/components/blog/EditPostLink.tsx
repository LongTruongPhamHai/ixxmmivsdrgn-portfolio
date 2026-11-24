'use client'

import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'

/** One /api/users/me request per page load, shared by every EditPostLink on the page */
let loggedInPromise: Promise<boolean> | null = null
const isLoggedIn = () =>
  (loggedInPromise ??= fetch('/api/users/me', { credentials: 'include', cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => Boolean(d?.user))
    .catch(() => false))

/**
 * "Edit" shortcut to the post in the Payload admin – only rendered for logged-in editors.
 * Visitors never see it (and the admin route requires login anyway).
 */
export function EditPostLink({
  id,
  label,
  variant = 'card',
}: {
  id: number | string
  label: string
  variant?: 'card' | 'page'
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let alive = true
    isLoggedIn().then((ok) => alive && setShow(ok))
    return () => {
      alive = false
    }
  }, [])

  if (!show) return null

  return (
    <a
      href={`/admin/collections/posts/${id}`}
      title={label}
      aria-label={label}
      className={`relative z-20 inline-flex items-center gap-1.5 font-mono text-xs border border-border-default bg-bg-elevated text-text-secondary hover:text-accent-amber hover:border-accent-amber transition-colors ${
        variant === 'card' ? 'p-1.5' : 'px-2.5 py-1'
      }`}
    >
      <Pencil size={12} />
      {variant === 'page' && <span>{label}</span>}
    </a>
  )
}
