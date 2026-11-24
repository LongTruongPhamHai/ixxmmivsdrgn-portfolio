'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import type { Task } from '@/payload-types'
import type { DayView, Review } from '@/lib/dailyLog'
import { addDays, daysBetween } from '@/lib/date'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import * as actions from '@/app/log/actions'
import { logStrings, type LogLang, type LogStrings } from './strings'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function LogApp({ initial, lang }: { initial: DayView; lang: LogLang }) {
  const t = logStrings[lang]
  const router = useRouter()
  const [view, setView] = useState(initial)
  const [save, setSave] = useState<SaveState>('idle')
  const taskInput = useRef<HTMLInputElement>(null)
  const logInput = useRef<HTMLInputElement>(null)

  const isPast = view.date < view.today
  const isFuture = view.date > view.today
  const editable = !isPast

  /** Optimistic update, then the server's version replaces it */
  const run = useCallback(
    async (optimistic: ((v: DayView) => DayView) | null, action: () => Promise<DayView>) => {
      const before = view
      if (optimistic) setView(optimistic(view))
      setSave('saving')
      try {
        setView(await action())
        setSave('saved')
      } catch {
        setView(before)
        setSave('error')
      }
    },
    [view],
  )

  const patchTask = (id: number, patch: Partial<Task>) =>
    run(
      (v) => ({ ...v, tasks: v.tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
      () => actions.updateTask(view.date, id, patch),
    )

  // Keyboard shortcuts: N = new task, L = log (when not typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey)
        return
      if (e.key === 'n' && editable) {
        e.preventDefault()
        taskInput.current?.focus()
      } else if (e.key === 'l' && view.isToday) {
        e.preventDefault()
        logInput.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editable, view.isToday])

  const goTo = (day: string) => router.push(day === view.today ? '/log' : `/log?d=${day}`)

  const doneCount = view.tasks.filter((x) => x.status === 'done').length
  const activeCount = view.tasks.filter((x) => x.status !== 'dropped').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between gap-3 font-mono text-xs">
          <span className="text-accent-amber uppercase tracking-widest">{t.title}</span>
          <div className="flex items-center gap-4 text-text-secondary">
            <SaveIndicator state={save} t={t} />
            <Link href="/" className="hover:text-text-primary">
              {t.site}
            </Link>
            <Link href="/admin" className="hover:text-text-primary">
              {t.admin}
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(addDays(view.date, -1))}
            className="p-2 border border-border-default hover:border-accent-lime"
            aria-label={t.prevDay}
            title={t.prevDay}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight capitalize truncate">
              {formatLongDate(view.date, lang)}
            </h1>
            <p className="font-mono text-xs text-text-secondary mt-1">
              {view.isToday ? t.today : isPast ? t.readOnly : t.future}
              {activeCount > 0 && <> · {t.progress(doneCount, activeCount)}</>}
            </p>
          </div>
          {!view.isToday && (
            <button
              type="button"
              onClick={() => goTo(view.today)}
              className="font-mono text-xs px-3 py-2 border border-accent-lime text-accent-lime"
            >
              {t.backToToday}
            </button>
          )}
          <button
            type="button"
            onClick={() => goTo(addDays(view.date, 1))}
            className="p-2 border border-border-default hover:border-accent-lime"
            aria-label={t.nextDay}
            title={t.nextDay}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        {activeCount > 0 && (
          <div className="h-1 bg-border-default/40">
            <div
              className="h-full bg-accent-lime transition-all duration-300"
              style={{ width: `${(doneCount / activeCount) * 100}%` }}
            />
          </div>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 items-start">
        {/* Tasks */}
        <section className="space-y-3">
          <SectionTitle>{t.tasks}</SectionTitle>
          {editable && (
            <QuickInput
              inputRef={taskInput}
              placeholder={t.addTask}
              onSubmit={(title) =>
                run(
                  (v) => ({
                    ...v,
                    tasks: [
                      ...v.tasks,
                      {
                        id: -Date.now(),
                        title,
                        status: 'todo',
                        plannedFor: v.date,
                        originalDate: v.date,
                        carryCount: 0,
                        order: 1e9,
                        updatedAt: '',
                        createdAt: '',
                      } as Task,
                    ],
                  }),
                  () => actions.addTask(view.date, title),
                )
              }
            />
          )}
          {view.tasks.length === 0 ? (
            <p className="font-mono text-sm text-text-secondary py-4">{t.noTasks}</p>
          ) : (
            <ul className="divide-y divide-border-default border-y border-border-default">
              {view.tasks.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  t={t}
                  editable={editable && task.id > 0}
                  onToggle={() =>
                    patchTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })
                  }
                  onRename={(title) => patchTask(task.id, { title })}
                  onPatch={(p) => patchTask(task.id, p)}
                  onMove={(dir) => {
                    const other = view.tasks[i + dir]
                    if (other && other.status !== 'done' && other.status !== 'dropped')
                      run(null, () => actions.swapTasks(view.date, task, other))
                  }}
                  onTomorrow={() =>
                    run(
                      (v) => ({ ...v, tasks: v.tasks.filter((x) => x.id !== task.id) }),
                      () => actions.moveTaskToTomorrow(view.date, task.id),
                    )
                  }
                  onDelete={() => {
                    if (window.confirm(t.confirmDelete))
                      run(
                        (v) => ({ ...v, tasks: v.tasks.filter((x) => x.id !== task.id) }),
                        () => actions.deleteTask(view.date, task.id),
                      )
                  }}
                />
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-8">
          {/* Log */}
          {!isFuture && (
            <section className="space-y-3">
              <SectionTitle>{t.log}</SectionTitle>
              {(view.log.entries ?? []).length === 0 ? (
                <p className="font-mono text-sm text-text-secondary">{t.noLog}</p>
              ) : (
                <ol className="space-y-2 border-l border-border-default pl-4">
                  {(view.log.entries ?? []).map((e) => (
                    <li key={e.id ?? `${e.time}-${e.text}`} className="relative text-sm">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-accent-amber" />
                      <span className="font-mono text-xs text-accent-amber mr-2">{e.time}</span>
                      <span className="whitespace-pre-line">{e.text}</span>
                    </li>
                  ))}
                </ol>
              )}
              {view.isToday && (
                <QuickInput
                  inputRef={logInput}
                  placeholder={t.addLog}
                  onSubmit={(text) => run(null, () => actions.addLogEntry(view.date, text))}
                />
              )}
            </section>
          )}

          {/* Review */}
          {!isFuture && (
            <ReviewForm
              key={view.date}
              review={view.log.review ?? {}}
              t={t}
              readOnly={isPast}
              onSave={(patch) => run(null, () => actions.updateReview(view.date, patch))}
            />
          )}
        </div>
      </div>

      {editable && (
        <p className="hidden md:block font-mono text-[11px] text-text-secondary/60">
          {t.shortcuts}
        </p>
      )}
    </div>
  )
}

/* ---------------------------------------------------------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-widest text-text-secondary flex items-center gap-3">
      {children}
      <span className="h-px flex-1 bg-border-default" />
    </h2>
  )
}

function SaveIndicator({ state, t }: { state: SaveState; t: LogStrings }) {
  if (state === 'idle') return null
  const text = state === 'saving' ? t.saving : state === 'saved' ? t.saved : t.error
  const color =
    state === 'error' ? 'text-accent-danger' : state === 'saved' ? 'text-accent-lime' : ''
  return <span className={color}>{text}</span>
}

function QuickInput({
  placeholder,
  onSubmit,
  inputRef,
}: {
  placeholder: string
  onSubmit: (value: string) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
}) {
  const [value, setValue] = useState('')
  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing && value.trim()) {
          onSubmit(value.trim())
          setValue('')
        }
        if (e.key === 'Escape') (e.target as HTMLInputElement).blur()
      }}
      placeholder={placeholder}
      className="w-full bg-bg-secondary border border-border-default focus:border-accent-lime outline-none px-3 py-2.5 text-sm font-mono placeholder:text-text-secondary/60"
    />
  )
}

function TaskRow({
  task,
  t,
  editable,
  onToggle,
  onRename,
  onPatch,
  onMove,
  onTomorrow,
  onDelete,
}: {
  task: Task
  t: LogStrings
  editable: boolean
  onToggle: () => void
  onRename: (title: string) => void
  onPatch: (patch: Partial<Task>) => void
  onMove: (dir: -1 | 1) => void
  onTomorrow: () => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [menu, setMenu] = useState(false)
  const done = task.status === 'done'
  const dropped = task.status === 'dropped'
  const open = !done && !dropped
  const lateDays =
    task.originalDate && task.plannedFor && open
      ? daysBetween(task.originalDate, task.plannedFor)
      : 0

  return (
    <li className={`group flex items-start gap-3 py-2.5 ${dropped ? 'opacity-50' : ''}`}>
      <input
        type="checkbox"
        checked={done}
        disabled={!editable || dropped}
        onChange={onToggle}
        className="mt-1 w-4 h-4 shrink-0 accent-[var(--color-accent-lime)] cursor-pointer disabled:cursor-default"
        aria-label={task.title}
      />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            defaultValue={task.title}
            onBlur={(e) => {
              setEditing(false)
              const v = e.target.value.trim()
              if (v && v !== task.title) onRename(v)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              if (e.key === 'Escape') setEditing(false)
            }}
            className="w-full bg-bg-secondary border border-accent-lime outline-none px-2 py-0.5 text-sm"
          />
        ) : (
          <button
            type="button"
            disabled={!editable}
            onClick={() => editable && setEditing(true)}
            className={`text-left text-sm w-full break-words ${done || dropped ? 'line-through text-text-secondary' : ''} ${
              editable ? 'cursor-text' : 'cursor-default'
            }`}
          >
            {task.priority === 'high' && open && (
              <span className="text-accent-danger mr-1" title={t.priorityHigh}>
                !
              </span>
            )}
            {task.status === 'doing' && <span className="text-accent-amber mr-1">▶</span>}
            {task.title}
          </button>
        )}
        <div className="flex flex-wrap gap-x-3 font-mono text-[11px] text-text-secondary">
          {lateDays > 0 && <span className="text-accent-amber">{t.carried(lateDays)}</span>}
          {done && task.completedAt && (
            <span>
              {t.doneAt} {formatTime(task.completedAt)}
            </span>
          )}
        </div>
      </div>

      {editable && (
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            className="p-1 text-text-secondary hover:text-text-primary md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label={t.menu}
            title={t.menu}
          >
            <MoreHorizontal size={16} />
          </button>
          {menu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
              <div className="absolute right-0 top-full z-20 w-52 bg-bg-elevated border border-border-default shadow-lg py-1 font-mono text-xs">
                {(
                  [
                    open && [
                      task.status === 'doing' ? t.markTodo : t.markDoing,
                      () => onPatch({ status: task.status === 'doing' ? 'todo' : 'doing' }),
                    ],
                    open &&
                      task.priority !== 'high' && [t.high, () => onPatch({ priority: 'high' })],
                    open &&
                      task.priority !== 'normal' && [
                        t.normal,
                        () => onPatch({ priority: 'normal' }),
                      ],
                    open && task.priority !== 'low' && [t.low, () => onPatch({ priority: 'low' })],
                    open && [t.moveUp, () => onMove(-1)],
                    open && [t.moveDown, () => onMove(1)],
                    open && [t.moveTomorrow, onTomorrow],
                    open && [t.drop, () => onPatch({ status: 'dropped' })],
                    dropped && [t.restore, () => onPatch({ status: 'todo' })],
                    [t.delete, onDelete],
                  ].filter(Boolean) as [string, () => void][]
                ).map(([label, fn]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setMenu(false)
                      fn()
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-bg-secondary ${
                      label === t.delete ? 'text-accent-danger' : ''
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </li>
  )
}

const REVIEW_FIELDS = ['wins', 'blockers', 'lessons', 'tomorrow'] as const

function ReviewForm({
  review,
  t,
  readOnly,
  onSave,
}: {
  review: Review
  t: LogStrings
  readOnly: boolean
  onSave: (patch: Partial<Review>) => void
}) {
  const [draft, setDraft] = useState<Review>(review)
  const timer = useRef<number | undefined>(undefined)
  const pending = useRef<Partial<Review>>({})

  // autosave ~1s after the last keystroke
  const change = (patch: Partial<Review>, immediate = false) => {
    setDraft((d) => ({ ...d, ...patch }))
    pending.current = { ...pending.current, ...patch }
    window.clearTimeout(timer.current)
    const flush = () => {
      const p = pending.current
      pending.current = {}
      onSave(p)
    }
    if (immediate) flush()
    else timer.current = window.setTimeout(flush, 1000)
  }

  return (
    <section className="space-y-3">
      <SectionTitle>{t.review}</SectionTitle>
      <div className="flex items-center gap-3 font-mono text-xs">
        <span className="text-text-secondary">{t.energy}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              onClick={() => change({ energy: draft.energy === n ? null : n }, true)}
              className={`w-6 h-6 rounded-full border transition-colors ${
                (draft.energy ?? 0) >= n
                  ? 'bg-accent-lime border-accent-lime'
                  : 'border-border-default'
              } ${readOnly ? 'cursor-default' : 'hover:border-accent-lime'}`}
              aria-label={`${t.energy} ${n}`}
              title={`${n}/5`}
            />
          ))}
        </div>
      </div>
      {REVIEW_FIELDS.map((key) => (
        <label key={key} className="block space-y-1">
          <span className="font-mono text-xs text-accent-amber">{t[key]}</span>
          <textarea
            value={draft[key] ?? ''}
            readOnly={readOnly}
            onChange={(e) => change({ [key]: e.target.value })}
            rows={2}
            className="w-full bg-bg-secondary border border-border-default focus:border-accent-lime outline-none px-3 py-2 text-sm resize-y read-only:opacity-80"
          />
        </label>
      ))}
    </section>
  )
}

/* ---------------------------------------------------------------- */

function formatLongDate(day: string, lang: LogLang) {
  return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${day}T00:00:00Z`))
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
