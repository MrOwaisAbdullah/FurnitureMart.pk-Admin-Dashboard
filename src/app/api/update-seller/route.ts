import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  try {
    const formData = await request.formData();
    const _id = formData.get("_id") as string;
    const ownerName = formData.get("ownerName") as string;
    const shopName = formData.get("shopName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const businessType = formData.get("businessType") as string;
    const logoFile = formData.get("logo") as File | null;
    
    let logoAsset;
    if (logoFile) {
      logoAsset = await client.assets.upload("image", logoFile);
    }

    // Update the seller document in Sanity
    const updateData: any = {
      ownerName,
      shopName,
      email,
      phone,
      address,
      businessType,
    };

    if (logoAsset) {
      updateData.logo = { _type: "image", asset: { _ref: logoAsset._id } };
    }

    await client.patch(_id).set(updateData).commit();


    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating seller:", error);
    return NextResponse.json(
      { error: "Failed to update seller", details: error.message },
      { status: 500 }
    );
  }
}