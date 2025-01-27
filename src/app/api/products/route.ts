import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const priceWithoutDiscount = parseFloat(
      formData.get("priceWithoutDiscount") as string,
    );
    const category = formData.get("category") as string;
    const inventory = parseInt(formData.get("inventory") as string);
    const tags = JSON.parse(formData.get("tags") as string);
    const seller = formData.get("seller") as string; // This should be the clerkId
    const image = formData.get("image") as File;
    const imageGallery = formData.getAll("imageGallery") as File[];

    // Fetch the seller document by clerkId
    const sellerDoc = await client.fetch(
      `*[_type == "seller" && clerkId == $clerkId][0]`,
      { clerkId: seller },
    );

    if (!sellerDoc) {
      return NextResponse.json(
        { error: "Seller not found" },
        { status: 404 },
      );
    }

    // Use the seller's _id for the reference
    const sellerRef = sellerDoc._id;

    // Generate a slug from the title
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let slugExists = true;
    let counter = 1;

    // Check if the slug already exists and make it unique
    while (slugExists) {
      const existingProduct = await client.fetch(
        `*[_type == "products" && slug.current == $slug][0]`,
        { slug },
      );

      if (!existingProduct) {
        slugExists = false;
      } else {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Upload the featured image to Sanity
    const imageAsset = await client.assets.upload("image", image);

    // Upload the image gallery to Sanity (if provided)
    const imageGalleryAssets = imageGallery.length
      ? await Promise.all(
          imageGallery.map(async (file) => {
            return await client.assets.upload("image", file);
          }),
        )
      : [];

    // Create the product document in Sanity
    const product = await client.create({
      _type: "products",
      title,
      description,
      price,
      ...(priceWithoutDiscount && { priceWithoutDiscount }),
      slug: {
        _type: "slug",
        current: slug,
      },
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      },
      ...(imageGalleryAssets.length > 0 && {
        imageGallery: imageGalleryAssets.map((asset) => ({
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        })),
      }),
      category: {
        _type: "reference",
        _ref: category,
      },
      ...(inventory && { inventory }),
      ...(tags && tags.length > 0 && { tags }),
      seller: {
        _type: "reference",
        _ref: sellerRef, // Use the seller's _id here
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { error: "Failed to upload product", details: error.message },
      { status: 500 },
    );
  }
}