import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/profile', '/history'] as const

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 仅保护指定路径
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get('token')?.value
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/history/:path*'],
}
