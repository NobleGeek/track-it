import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const token = req.nextauth.token
      if (!token?.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }

      // Clone the request headers and add the user ID
      const requestHeaders = new Headers(req.headers)
      requestHeaders.set('x-user-id', token.id.toString())

      return NextResponse.next({
        headers: requestHeaders,
      })
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*", "/api/(budgets|transactions)/:path*"],
}