import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    if (!WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret is missing" }, { status: 500 });
    }

    // Get raw request body for signature verification
    const rawBody = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    console.log("Webhook Headers:", JSON.stringify(headers, null, 2));

    const wh = new Webhook(WEBHOOK_SECRET);
    let verifiedPayload: any;

    try {
      verifiedPayload = wh.verify(rawBody, headers) as { data: any }; 
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    console.log("Verified Payload:", JSON.stringify(verifiedPayload, null, 2));

    // Extract user details
    const { data } = verifiedPayload;
    const userId = data.id;
    const email = data.email_addresses?.[0]?.email_address || "";
    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();

    console.log("Creating seller with data:", { userId, email, name });

    // Create a new seller document in Sanity
    const seller = await client.create({
      _type: "seller",
      clerkId: userId,
      shopName: name || "New Seller",
      email,
      phone: "", // Leave phone empty for now
      address: "", // Leave address empty for now
      businessType: "showroom", // Default business type
      role: "seller", // Default role
      isApproved: false, // Default to false for manual approval
    });

    console.log("Seller created successfully:", seller);

    return NextResponse.json({ success: true, seller }, { status: 200 });
  } catch (error) {
    console.error("Error creating seller:", error);
    return NextResponse.json({ error: "Failed to create seller" }, { status: 500 });
  }
}
