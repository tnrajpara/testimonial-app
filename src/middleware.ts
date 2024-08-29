// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(request: NextRequest) {
  const res = new NextResponse();
  const session = await getSession(request, res);
  const isAuthenticated = !!session?.user;

  // List of paths that require authentication
  const protectedPaths = [
    "/create",
    "/profile",
    "/editspace",
    "/space",
    "/testimonial",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  console.log("isProtectedPath", isProtectedPath);
  console.log("isAuthenticated", isAuthenticated);

  if (isProtectedPath && !isAuthenticated) {
    console.log("Redirecting to home page");
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create/:path*",
    "/profile/:path*",
    "/editspace/:path*",
    "/space/:path*",
    "/testimonial/:path*",
  ],
};
