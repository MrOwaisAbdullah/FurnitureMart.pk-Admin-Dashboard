import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const headers = Object.fromEntries(request.headers.entries());

    console.log("Webhook Payload:", JSON.stringify(payload, null, 2)); // Debugging
    console.log("Webhook Headers:", JSON.stringify(headers, null, 2)); // Debugging

    // Verify the webhook signature
    if (WEBHOOK_SECRET) {
      const wh = new Webhook(WEBHOOK_SECRET);
      const verifiedPayload = wh.verify(JSON.stringify(payload), headers);
      console.log("Verified Payload:", JSON.stringify(verifiedPayload, null, 2)); // Debugging
    }

    const { data } = payload;
    const userId = data.id;
    const email = data.email_addresses[0]?.email_address || "";
    const phone = data.phone_numbers[0]?.phone_number || "";
    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
    const { businessType, address } = data.unsafe_metadata || {};

    console.log("Creating seller with data:", {
      userId,
      email,
      phone,
      name,
      businessType,
      address,
    }); // Debugging

    // Create a new seller document in Sanity
    const seller = await client.create({
        _type: "seller",
        clerkId: userId,
        shopName: name || "New Seller",
        email,
        phone,
        address: address || "",
        businessType: businessType || "showroom",
        isApproved: false,
      });

    console.log("Seller created:", JSON.stringify(seller, null, 2)); // Debugging

    return NextResponse.json(seller, { status: 200 });
  } catch (error: any) {
    console.error("Error creating seller:", error); // Debugging
    return NextResponse.json(
      { error: "Failed to create seller", details: error.message },
      { status: 500 }
    );
  }
}