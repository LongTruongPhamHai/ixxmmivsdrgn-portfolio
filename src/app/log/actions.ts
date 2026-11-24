'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Task } from '@/payload-types'
import { addEntry, assertDay, getDay, saveReview, type DayView, type Review } from '@/lib/dailyLog'
import { addDays } from '@/lib/date'

/** Every action re-checks the admin session (server actions are public endpoints) */
async function ctx() {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) throw new Error('Unauthorized')
  return { payload, user }
}

const as = (c: Awaited<ReturnType<typeof ctx>>) => ({
  user: c.user,
  overrideAccess: false as const,
})

export async function loadDay(day: string): Promise<DayView> {
  return getDay(await ctx(), assertDay(day))
}

export async function addTask(day: string, title: string): Promise<DayView> {
  const c = await ctx()
  const clean = title.trim()
  if (clean) {
    const current = await getDay(c, assertDay(day))
    const order = Math.max(0, ...current.tasks.map((t) => t.order ?? 0)) + 1
    await c.payload.create({
      collection: 'tasks',
      data: { title: clean, plannedFor: day, status: 'todo', order },
      ...as(c),
    })
  }
  return getDay(c, day)
}

type TaskPatch = Partial<Pick<Task, 'title' | 'status' | 'priority' | 'plannedFor' | 'order'>>

export async function updateTask(day: string, id: number, patch: TaskPatch): Promise<DayView> {
  const c = await ctx()
  if (patch.plannedFor) assertDay(patch.plannedFor)
  await c.payload.update({ collection: 'tasks', id, data: patch, ...as(c) })
  return getDay(c, assertDay(day))
}

export async function moveTaskToTomorrow(day: string, id: number): Promise<DayView> {
  return updateTask(day, id, { plannedFor: addDays(assertDay(day), 1) })
}

/** Swap the order of two tasks (move up / down) */
export async function swapTasks(day: string, a: Task, b: Task): Promise<DayView> {
  const c = await ctx()
  const orderA = a.order ?? 0
  const orderB = b.order ?? 0
  // equal orders: spread them so the swap is visible
  const [newA, newB] = orderA === orderB ? [orderB + 1, orderA] : [orderB, orderA]
  await c.payload.update({ collection: 'tasks', id: a.id, data: { order: newA }, ...as(c) })
  await c.payload.update({ collection: 'tasks', id: b.id, data: { order: newB }, ...as(c) })
  return getDay(c, assertDay(day))
}

export async function deleteTask(day: string, id: number): Promise<DayView> {
  const c = await ctx()
  await c.payload.delete({ collection: 'tasks', id, ...as(c) })
  return getDay(c, assertDay(day))
}

export async function addLogEntry(day: string, text: string): Promise<DayView> {
  const c = await ctx()
  if (text.trim()) await addEntry(c, text)
  return getDay(c, assertDay(day))
}

export async function updateReview(day: string, review: Partial<Review>): Promise<DayView> {
  const c = await ctx()
  if (review.energy != null && ![1, 2, 3, 4, 5].includes(Number(review.energy))) {
    throw new Error('Energy must be 1–5')
  }
  await saveReview(c, assertDay(day), review)
  return getDay(c, day)
}
