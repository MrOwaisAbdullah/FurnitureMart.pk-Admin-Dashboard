import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/"];
  const { userId, sessionId } = await auth();

  // Allow public routes to be accessed without authentication
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to the login landing page
  if (!userId || !sessionId) {
    return NextResponse.redirect("/");
  }

  return NextResponse.next(); // Allow access to protected routes if authenticated
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Skip static files and _next internals
    "/(api|trpc)(.*)",        // Match API routes
  ],
};
