import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Ensure dynamic execution (Fix #2)

export async function GET(request: Request) {
  try {
    // Get Clerk Authentication (Fix #1)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User is not authenticated." },
        { status: 401 }
      );
    }

    console.log("User ID:", userId);

    // Fetch seller from Sanity
    const seller = await client.fetch(
      `*[_type == "seller" && clerkId == $userId][0] {
        isApproved
      }`,
      { userId }
    );

    console.log("seller:", seller)

    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }
   
    return NextResponse.json({ isApproved: seller.isApproved });
  } catch (error) {
    console.error("Error fetching seller status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
