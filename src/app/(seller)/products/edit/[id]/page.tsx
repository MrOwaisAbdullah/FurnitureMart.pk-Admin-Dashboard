import ProductUploadForm from "@/components/FormElements/ProductForm";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";

const EditProductPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    notFound();
  }

  const product = await client.fetch(
    `*[_type == "products" && _id == $productId][0] {
      _id,
      title,
      slug,
      description,
      price,
      priceWithoutDiscount,
      isDiscounted,
      "image": image.asset->url,
      "imageGallery": imageGallery[].asset->url,
      category->{_id, title},
      inventory,
      tags,
      isNew,
      seller->{_id, name}
    }`,
    { productId: params.id }
  );

  if (!product) {
    notFound();
  }
  console.log("Product ID edit page:", params.id);
console.log("Product Data edit page:", product);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <ProductUploadForm sellerId={product.seller._id} product={product} />
      </div>
    </div>
  );
};

export default EditProductPage;