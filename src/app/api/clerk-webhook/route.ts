import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  const payload = await req.json();
  const { id, email_addresses, unsafe_metadata } = payload.data;

  // Save seller data to Sanity
  await client.create({
    _type: "seller",
    clerkId: id,
    email: email_addresses[0].email_address,
    name: unsafe_metadata.name || "",
    phone: unsafe_metadata.phone || "",
    address: unsafe_metadata.address || "",
    shopAddress: unsafe_metadata.shopAddress || "",
    hasShowroom: unsafe_metadata.hasShowroom || false,
    hasWorkshop: unsafe_metadata.hasWorkshop || false,
    isApproved: false, // Default to false for manual approval
  });

  return new Response("OK", { status: 200 });
}