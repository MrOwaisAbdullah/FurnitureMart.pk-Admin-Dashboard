import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/"];
  const { userId, sessionId } = await auth();

  // Debugging
  console.log("Middleware Debug:");
  console.log("Request Path:", req.nextUrl.pathname);
  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);
  console.log("Request Host:", req.headers.get("host"));
  console.log("Request URL:", req.url);

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
