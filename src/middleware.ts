import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { client } from "./sanity/lib/client";

export default clerkMiddleware(async (auth, req) => {
  const publicRoutes = ["/", "/api/seller-status", "/sign-in", "/sign-up", "/api/create-seller", "/pending-verification"]
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
    // Fetch seller verification status from Sanity
    const seller = await client.fetch(`*[_type == "seller" && clerkId == $userId][0]`, { userId });

    if (!seller || !seller.isApproved) {
      return NextResponse.redirect("/pending-verification"); // Redirect if seller is not found or not verified
    }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except static files
    "/(api|trpc)(.*)",        // Match API routes
  ],
};
