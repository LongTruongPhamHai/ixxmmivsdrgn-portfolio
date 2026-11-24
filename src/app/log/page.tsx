import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getDay } from '@/lib/dailyLog'
import { DAY_RE, todayVN } from '@/lib/date'
import { LogApp } from '@/components/log/LogApp'
import type { LogLang } from '@/components/log/strings'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ d?: string }> }

export default async function LogPage({ searchParams }: Props) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  const { d } = await searchParams

  // Private: log in through the Payload admin, then come back here
  if (!user) {
    const back = d ? `/log?d=${d}` : '/log'
    redirect(`/admin/login?redirect=${encodeURIComponent(back)}`)
  }

  const day = d && DAY_RE.test(d) ? d : todayVN()
  const view = await getDay({ payload, user }, day)

  // Same language as the admin panel (Payload stores it in the "payload-lng" cookie)
  const lang: LogLang = (await cookies()).get('payload-lng')?.value === 'en' ? 'en' : 'vi'

  // key: a new day remounts the app with fresh state
  return <LogApp key={view.date} initial={view} lang={lang} />
}
