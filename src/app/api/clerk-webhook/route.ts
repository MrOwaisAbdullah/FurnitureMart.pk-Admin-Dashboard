import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  const payload = await req.json();
  if (!payload || !payload.data) {
    console.error("Invalid payload:", payload);
    return new Response("Invalid payload", { status: 400 });
  }

  const { id, email_addresses, unsafe_metadata } = payload.data;

  // Check if seller already exists in Sanity
  const existingSeller = await client.fetch(
    `*[_type == "seller" && clerkId == $clerkId][0]`,
    { clerkId: id }
  );

  if (existingSeller) {
    console.log("Seller already exists:", existingSeller);
    return new Response("Seller already exists", { status: 200 });
  }

  // ✅ Save seller data to Sanity
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
    isApproved: false,
  });

  return new Response("OK", { status: 200 });
}
