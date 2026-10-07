import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/admin', '/api/admin'];
const publicRoutes = ['/admin/login', '/api/admin/login'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route));

  if (isProtectedRoute && !isPublicRoute) {
    const session = req.cookies.get('session')?.value;
    const payload = await decrypt(session);

    if (!session || !payload) {
      if (path.startsWith('/api')) {
        return NextResponse.json({ success: false, error: "Unauthorized. Please log in." }, { status: 401 });
      } else {
        return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
      }
    }
  }

  // Set security headers
  const res = NextResponse.next();
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
