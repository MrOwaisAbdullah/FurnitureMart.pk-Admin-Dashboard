// // app/api/assign-role/route.ts
// import { headers } from "next/headers";
// import { Webhook } from "svix";
// import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// if (!WEBHOOK_SECRET) {
//   throw new Error("CLERK_WEBHOOK_SECRET is not set in the environment variables.");
// }

// export async function POST(request: Request) {
//   const headerPayload = headers();
//   const svixId = headerPayload.get("svix-id");
//   const svixTimestamp = headerPayload.get("svix-timestamp");
//   const svixSignature = headerPayload.get("svix-signature");

//   // Validate Svix headers
//   if (!svixId || !svixTimestamp || !svixSignature) {
//     return new Response("Error: Missing Svix headers", {
//       status: 400,
//     });
//   }

//   const payload = await request.json();
//   const body = JSON.stringify(payload);

//   const wh = new Webhook(WEBHOOK_SECRET);

//   let evt: WebhookEvent;

//   try {
//     evt = wh.verify(body, {
//       "svix-id": svixId,
//       "svix-timestamp": svixTimestamp,
//       "svix-signature": svixSignature,
//     }) as WebhookEvent;
//   } catch (err) {
//     console.error("Error verifying webhook:", err);
//     return new Response("Error: Invalid webhook signature", {
//       status: 400,
//     });
//   }

//   const { type, data } = evt;

//   if (type === "user.created") {
//     const userId = data.id;

//     // Assign the default role (seller)
//     clerkClient.users.updateUserMetadata(userId, {
//       publicMetadata: { role: "seller" },
//     });

//     console.log(`Role assigned to user ${userId}: seller`);
//   }

//   return NextResponse.json({ success: true }, { status: 200 });
// }