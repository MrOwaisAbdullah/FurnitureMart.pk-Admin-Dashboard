import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"; // Ensures the route runs dynamically

export async function GET(request: Request) {
  try {
    // Get the authenticated user's Clerk ID
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User is not authenticated." },
        { status: 401 },
      );
    }

    // Step 1: Find the seller document using the clerkId
    const sellerQuery = `*[_type == "seller" && clerkId == $userId][0]`;
    const seller = await client.fetch(sellerQuery, { userId });

    if (!seller?._id) {
      return NextResponse.json({ error: "Seller not found." }, { status: 404 });
    }

    // Step 2: Fetch orders where the seller's _id matches the reference
    const ordersQuery = `
  *[_type == "order" && references($sellerId)] | order(_createdAt desc) {
    _id,
    orderId,
    customer->{
      name
    },
    products[] {
    quantity,
    product->{
      _id,
      slug,
      title,
      price,
      "image": image.asset->{ url } 
      }
  },
    total,
    status,
    paymentStatus,
    shippingAddress,
    _createdAt
  }
`;
    const orders = await client.fetch(ordersQuery, { sellerId: seller._id });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 },
    );
  }
}
