import { NextRequest, NextResponse } from 'next/server'

// Define protected and public routes
const protectedRoutes = ['/dashboard', '/transactions', '/goals', '/budgets', '/income']
const publicRoutes = ['/login', '/register', '/']

export default async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  // Check for guest mode
  const guestMode = req.cookies.get('guestMode')?.value === 'true'
  
  // Check for Supabase session
  const supabaseSession = req.cookies.get('sb-access-token')?.value || 
                         req.cookies.get('sb-refresh-token')?.value

  const isAuthenticated = guestMode || !!supabaseSession

  // Redirect to /login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to /dashboard if trying to access public route while authenticated
  if (isPublicRoute && isAuthenticated && !req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Configure which routes middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
