import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();

    console.log("userid:", userId)
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const seller = await client.fetch(
      `*[_type == "seller" && clerkId == $userId][0] {
        isApproved
      }`,
      { userId }
    );

    console.log("seller:", seller)
    if (!seller) {
      return NextResponse.json({ isApproved: false }, { status: 200 });
    }
   
    return NextResponse.json({ isApproved: seller.isApproved });
  } catch (error) {
    console.error("Error fetching seller status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}