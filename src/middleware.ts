import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/"];
  const { userId, sessionId } = await auth();

  console.log("Middleware Debug:");
  console.log("Request Path:", req.nextUrl.pathname);
  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);

  try {
    // Allow access to public routes
    if (publicRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    // If user is not authenticated, redirect to sign-in
    if (!userId || !sessionId) {
      console.log("Redirecting to sign-in page");
      return NextResponse.redirect(
        process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"
      );
    }

    // Protected route logic
    console.log("User is authenticated, proceeding to route");
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return new NextResponse("Middleware failed", { status: 500 });
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except static files
    "/(api|trpc)(.*)",        // Match API routes
  ],
};
