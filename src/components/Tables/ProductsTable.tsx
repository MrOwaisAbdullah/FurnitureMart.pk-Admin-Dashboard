"use client";
import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Product } from "@/types/product";
import { client } from "@/sanity/lib/client";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import ConfirmationModal from "@/components/common/ConfirmationModal"; // Import the modal

const ProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const { userId: clerkUserId } = useAuth(); // Get Clerk user ID

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Fetch Seller by Clerk ID
  const fetchSellerByClerkId = async (clerkId: string) => {
    try {
      const seller = await client.fetch(
        `*[_type == "seller" && clerkId == $clerkId][0] {
          _id
        }`,
        { clerkId }
      );
      return seller;
    } catch (err) {
      setError("Failed to fetch seller");
      return null;
    }
  };

  // Fetch Products by Seller ID
  const fetchProductsBySellerId = async (sellerId: string) => {
    try {
      const query = `*[_type == "products" && seller._ref == $sellerId] | order(_createdAt desc) [$start...$end] {
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
      }`;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const products = await client.fetch(query, { sellerId, start, end });
      setProducts(products);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!clerkUserId) return;
      // Fetch seller by Clerk ID
      const seller = await fetchSellerByClerkId(clerkUserId);
      if (!seller) {
        setError("Seller not found");
        setLoading(false);
        return;
      }
      // Fetch products by seller ID
      await fetchProductsBySellerId(seller._id);
    };
    fetchData();
  }, [clerkUserId, page]);

  const handleEdit = (productId: string) => {
    // Redirect to the edit page
    router.push(`/products/edit/${productId}`);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await client.delete(productToDelete);
      setProducts((prev) => prev.filter((product) => product._id !== productToDelete));
      setIsModalOpen(false); // Close the modal after deletion
      setProductToDelete(null); // Reset the product to delete
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setProductToDelete(null);
        }}
      />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark min-h-screen">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Your Products
          </h4>
        </div>
        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Price</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Inventory</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Actions</p>
          </div>
        </div>
        {products.map((product) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={product._id}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-12.5 w-15 rounded-md">
                  <Image
                    src={product.image || "/images/product_placeholder.webp"}
                    alt="Product"
                    className="h-full w-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <p className="text-sm text-black dark:text-white">
                  {product.title}
                </p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product.category.title}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                ${product.price}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {product.inventory}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <div className="flex items-center space-x-3.5">
                <button
                  onClick={() => handleEdit(product._id)}
                  className="hover:text-primary"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setProductToDelete(product._id);
                  }}
                  className="hover:text-danger"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={products.length < itemsPerPage}
            className="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductTable;