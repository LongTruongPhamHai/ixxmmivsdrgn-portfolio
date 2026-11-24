'use client'

import { useEffect, useRef, useState } from 'react'

export type DayPoint = { date: string; visits: number }

/**
 * Daily visits – single-series bar chart (no legend: the heading names it).
 * Thin bars with a 2px gap, rounded data-end, square on the baseline; recessive grid;
 * hover/focus tooltip per bar with a hit area taller than the bar.
 */
export function VisitsChart({
  data,
  locale,
  label,
}: {
  data: DayPoint[]
  locale: string
  label: string
}) {
  const [active, setActive] = useState<number | null>(null)
  // draw at the real pixel width so text keeps its size on small screens
  const box = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(720)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) =>
      setW(Math.max(260, Math.round(entry.contentRect.width))),
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const H = W < 500 ? 200 : 240
  const labelEvery = W < 500 ? 7 : 5
  const PAD = { top: 12, right: 8, bottom: 26, left: 32 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const max = Math.max(1, ...data.map((d) => d.visits))
  const step = niceStep(max)
  const top = Math.ceil(max / step) * step
  const ticks = Array.from({ length: Math.floor(top / step) + 1 }, (_, i) => i * step)
  const slot = innerW / data.length
  const GAP = 2
  const barW = Math.max(2, slot - GAP)
  const y = (v: number) => PAD.top + innerH - (v / top) * innerH
  const fmtDay = (d: string, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-GB', {
      ...opts,
      timeZone: 'UTC',
    }).format(new Date(`${d}T00:00:00Z`))
  const nf = new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US')

  const a = active != null ? data[active] : null

  return (
    <div ref={box} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        className="block overflow-visible"
        role="img"
        aria-label={label}
        onMouseLeave={() => setActive(null)}
      >
        {/* grid + y labels (recessive) */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-border-default"
              strokeWidth={t === 0 ? 1 : 0.5}
              strokeDasharray={t === 0 ? undefined : '2 4'}
            />
            <text
              x={PAD.left - 6}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-text-secondary font-mono"
              fontSize={10}
            >
              {nf.format(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const x = PAD.left + i * slot + GAP / 2
          const h = PAD.top + innerH - y(d.visits)
          const isActive = active === i
          return (
            <g key={d.date}>
              {d.visits > 0 && (
                <path
                  d={roundedTopBar(x, y(d.visits), barW, h, Math.min(4, barW / 2, h))}
                  className={isActive ? 'fill-accent-amber' : 'fill-accent-lime'}
                />
              )}
              {/* x labels: every 5th/7th day + the last one (skip one that would collide with it) */}
              {((i % labelEvery === 0 && data.length - 1 - i >= 3) || i === data.length - 1) && (
                <text
                  x={x + barW / 2}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-text-secondary font-mono"
                  fontSize={10}
                >
                  {fmtDay(d.date, { day: '2-digit', month: '2-digit' })}
                </text>
              )}
              {/* hit area: full column height, wider than the bar */}
              <rect
                x={PAD.left + i * slot}
                y={PAD.top}
                width={slot}
                height={innerH}
                fill="transparent"
                tabIndex={0}
                aria-label={`${fmtDay(d.date, { day: '2-digit', month: '2-digit', year: 'numeric' })}: ${nf.format(d.visits)}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="outline-none cursor-default"
              />
            </g>
          )
        })}
      </svg>

      {/* tooltip */}
      {a && active != null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none bg-bg-elevated border border-border-default px-2.5 py-1.5 font-mono text-xs shadow-lg whitespace-nowrap"
          style={{
            left: `${((PAD.left + active * slot + slot / 2) / W) * 100}%`,
            top: `${(y(a.visits) / H) * 100}%`,
            marginTop: -8,
          }}
        >
          <div className="text-text-secondary">
            {fmtDay(a.date, {
              weekday: 'short',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </div>
          <div className="text-text-primary font-bold tabular-nums">{nf.format(a.visits)}</div>
        </div>
      )}
    </div>
  )
}

/** Bar path: rounded data-end (top), square on the baseline */
function roundedTopBar(x: number, yTop: number, w: number, h: number, r: number) {
  const b = yTop + h
  return `M${x},${b} V${yTop + r} Q${x},${yTop} ${x + r},${yTop} H${x + w - r} Q${x + w},${yTop} ${x + w},${yTop + r} V${b} Z`
}

/** 1, 2, 5 × 10^n step giving ~4 gridlines */
function niceStep(max: number) {
  const raw = max / 4
  const pow = 10 ** Math.floor(Math.log10(raw || 1))
  const n = raw / pow
  return Math.max(1, (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow)
}
