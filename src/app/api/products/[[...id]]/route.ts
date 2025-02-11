import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import slugify from "slugify";

// ----- POST: Create a new product -----
export async function POST(
  request: Request,
  { params }: { params: { id?: string[] } }
) {
  // If an ID is provided in the URL, we don't allow POST (should use PATCH for update)
  if (params.id && params.id.length > 0) {
    return NextResponse.json(
      { error: "POST request should not include a product ID. Use PATCH for updates." },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();

    // Extract form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const priceWithoutDiscount = parseFloat(formData.get("priceWithoutDiscount") as string);
    const category = formData.get("category") as string;
    const inventory = parseInt(formData.get("inventory") as string);
    const tags = JSON.parse(formData.get("tags") as string);
    const seller = formData.get("seller") as string; // This is the clerkId
    const image = formData.get("image") as File;
    const imageGallery = formData.getAll("imageGallery") as File[];

    // Fetch the seller document by clerkId
    const sellerDoc = await client.fetch(
      `*[_type == "seller" && clerkId == $clerkId][0]`,
      { clerkId: seller }
    );
    if (!sellerDoc) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }
    const sellerRef = sellerDoc._id;

    // Generate a unique slug from the title
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let slugExists = true;
    let counter = 1;
    while (slugExists) {
      const existingProduct = await client.fetch(
        `*[_type == "products" && slug.current == $slug][0]`,
        { slug }
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
          imageGallery.map(async (file) => await client.assets.upload("image", file))
        )
      : [];

    // Create the product document in Sanity
    const product = await client.create({
      _type: "products",
      title,
      description,
      price,
      ...(priceWithoutDiscount && { priceWithoutDiscount }),
      slug: { _type: "slug", current: slug },
      image: { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } },
      ...(imageGalleryAssets.length > 0 && {
        imageGallery: imageGalleryAssets.map((asset) => ({
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        })),
      }),
      category: { _type: "reference", _ref: category },
      ...(inventory && { inventory }),
      ...(tags && tags.length > 0 && { tags }),
      seller: { _type: "reference", _ref: sellerRef },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { error: "Failed to upload product", details: error.message },
      { status: 500 }
    );
  }
}

// ----- PATCH: Update an existing product -----
export async function PATCH(
  request: Request,
  { params }: { params: { id?: string[] } }
) {
  // Ensure an ID is provided for updates
  if (!params.id || params.id.length === 0) {
    return NextResponse.json({ error: "Product ID is required for update." }, { status: 400 });
  }
  // Use the first segment as the product ID (assuming a single ID is provided)
  const productId = params.id[0];

  try {
    const formData = await request.formData();
    const updateData: any = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      category: { _type: "reference", _ref: formData.get("category") as string },
      inventory: formData.get("inventory")
        ? parseInt(formData.get("inventory") as string)
        : null,
      tags: JSON.parse(formData.get("tags") as string),
    };

    if (formData.get("priceWithoutDiscount")) {
      updateData.priceWithoutDiscount = parseFloat(formData.get("priceWithoutDiscount") as string);
    }

    if (formData.get("image")) {
      const imageFile = formData.get("image") as File;
      const imageAsset = await client.assets.upload("image", imageFile);
      updateData.image = { _type: "image", asset: { _type: "reference", _ref: imageAsset._id } };
    }

    // For image gallery, use getAll to capture multiple files
    const galleryFiles = formData.getAll("imageGallery") as File[];
    if (galleryFiles.length > 0) {
      const galleryAssets = await Promise.all(
        galleryFiles.map((file) => client.assets.upload("image", file))
      );
      updateData.imageGallery = galleryAssets.map((asset) => ({
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      }));
    }

    // Update the product document in Sanity
    await client.patch(productId).set(updateData).commit();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product", details: error.message },
      { status: 500 }
    );
  }
}

// ----- DELETE: Delete a product -----
export async function DELETE(
  request: Request,
  { params }: { params: { id: string[] } }
) {
  // Ensure an ID is provided for deletion
  if (!params.id || params.id.length === 0) {
    return NextResponse.json(
      { error: "Product ID is required for deletion." },
      { status: 400 }
    );
  }

  // Use the first segment as the product ID (assuming a single ID is provided)
  const productId = params.id[0];

  try {
    // Delete the product document in Sanity
    await client.delete(productId);
    return NextResponse.json(
      { success: true, message: "Product deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product", details: error.message },
      { status: 500 }
    );
  }
}
