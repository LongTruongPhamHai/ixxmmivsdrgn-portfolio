import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // Only redirect the root path to the default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/vi', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
