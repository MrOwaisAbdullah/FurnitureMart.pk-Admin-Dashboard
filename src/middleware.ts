import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/create-seller"];
  const { userId, sessionId } = await auth();

  // Allow public routes
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users
  if (!userId || !sessionId) {
    console.log("Redirecting to sign-in");
    return NextResponse.redirect(
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except static files
    "/(api|trpc)(.*)",        // Match API routes
  ],
};
