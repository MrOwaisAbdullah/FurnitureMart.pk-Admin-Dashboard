import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/"]; 
  const { userId, sessionId } = await auth();

  // Allow public routes to be accessed without authentication
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!userId || !sessionId) {
    console.log("Redirecting to /");
    return NextResponse.redirect("/");
  }

  console.log("Access granted to protected route");
  return NextResponse.next(); // Allow access if authenticated
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except static files and _next
    "/(api|trpc)(.*)",        // Match API routes
  ],
};
