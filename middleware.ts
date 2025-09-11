import { getUserFromSession } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Skip middleware for public routes
  if (
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get("session_token")?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  const user = await getUserFromSession(sessionToken)

  if (!user) {
    const response = NextResponse.redirect(new URL("/auth/login", request.url))
    response.cookies.delete("session_token")
    return response
  }

  // Add user info to headers for use in components
  const response = NextResponse.next()
  response.headers.set("x-user-id", user.id)
  response.headers.set("x-user-role", user.role)
  response.headers.set("x-user-username", user.username)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
