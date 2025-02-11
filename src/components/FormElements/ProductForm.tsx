"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import MultiSelect from "@/components/FormElements/MultiSelect";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import ImageCropModal from "./ImageCropModal";
import { Product } from "@/types/product";
import LoadingOverlay from "../common/Loader/LoadingOverlay";

// Zod schema for form validation
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  priceWithoutDiscount: z
    .number()
    .min(0, "Old price must be a positive number")
    .nullable()
    .optional()
    .refine((val) => {
      if (val === undefined || val === null) return true;
      return true;
    }, "Old price must be greater than the current price"),
  image: z.instanceof(File, { message: "Featured image is required" }).optional(),
  imageGallery: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images allowed")
    .optional(),
  category: z.string().min(1, "Category is required"),
  inventory: z
    .number()
    .min(0, "Inventory must be a positive number")
    .nullable()
    .optional(),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductUploadForm = ({ sellerId, product }: { sellerId: string; product?: Product }) => {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      priceWithoutDiscount: product?.priceWithoutDiscount || null,
      inventory: product?.inventory || null,
      tags: product?.tags || [],
      category: product?.category._id || "",
      image: undefined, 
      imageGallery: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);
  const [predefinedTags, setPredefinedTags] = useState<{ value: string; label: string }[]>([]);
  const [tags, setTags] = useState<string[]>(product?.tags || []);

  // Fetch tags from Sanity
  useEffect(() => {
    const fetchTags = async () => {
      const products = await client.fetch(
        `*[_type == "products"] {
          tags
        }`,
      );

      const allTags = products
        .map((product: { tags?: string[] }) => product.tags || [])
        .flat()
        .filter(
          (tag: string, index: number, self: string[]) =>
            self.indexOf(tag) === index,
        );

      const tagOptions = allTags.map((tag: string) => ({
        value: tag,
        label: tag,
      }));

      setPredefinedTags(tagOptions);
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (product?.tags) {
      setTags(product.tags);
    }
  }, [product]);

  // Fetch categories from Sanity
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await client.fetch(
        `*[_type == "categories"] {
          _id,
          title
        }`
      );
      setCategories(categories);
  
      // Set category only after fetching categories to avoid undefined issues
      if (product?.category) {
        setValue("category", product.category._id);
      }
    };
  
    fetchCategories();
  }, [product, setValue]);
  

  useEffect(() => {
    if (product) {
      // Set featured image preview
      if (product.image) {
        setPreviewUrls((prev) => ({ ...prev, featured: product.image }));
      }
  
      // Set gallery image previews
      if (product.imageGallery && product.imageGallery.length > 0) {
        setPreviewUrls((prev) => ({ ...prev, gallery: product.imageGallery || [] }));
      }
    }
  }, [product]);

  useEffect(() => {
    if (product?.category) {
      setValue("category", product.category._id);
    }
  }, [product, setValue]);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    console.log("Form Data:", data); // Log the form data
  
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
  
    if (data.priceWithoutDiscount) {
      formData.append("priceWithoutDiscount", data.priceWithoutDiscount.toString());
    }
    formData.append("category", data.category);
    if (data.inventory) {
      formData.append("inventory", data.inventory.toString());
    }
    if (data.tags && data.tags.length > 0) {
      formData.append("tags", JSON.stringify(data.tags));
    }
    formData.append("seller", sellerId);
  
    if (data.image) {
      formData.append("image", data.image);
    }
  
    if (data.imageGallery && data.imageGallery.length > 0) {
      data.imageGallery.forEach((file, index) => {
        formData.append(`imageGallery[${index}]`, file);
      });
    }

    // console.log("Product ID upload form:", product?._id);
    // console.log("Form Data upload form:", formData);
    try {
      setIsLoading(true);
      const endpoint = product ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${product._id}` : `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`;
      const method = product ? "PATCH" : "POST";
  
      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      if (response.ok) {
        addNotification(product ? "Product updated successfully!" : "Product uploaded successfully!", "success");
        router.refresh();
        // Reset the form fields after successful submission
        reset({
          title: "",
          description: "",
          price: 0,
          priceWithoutDiscount: null,
          inventory: null,
          tags: [],
          category: "",
          image: undefined,
          imageGallery: [],
        });

        // Clear image previews
        setPreviewUrls({
          featured: null,
          gallery: [],
        });

        // Clear tags
        setTags([]);

     // Redirect after successful update
      router.push("/products/list");

      } else {
        const errorData = await response.json();
        addNotification(
          `Failed to ${product ? "update" : "upload"} product: ${errorData.error}`,
          "error",
        );
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      addNotification(
        `An error occurred while ${product ? "updating" : "uploading"} the product.`,
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSelection = (selectedTags: string[]) => {
    setTags(selectedTags);
    setValue("tags", selectedTags);
  };

  // states for image cropping
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<{
    url: string;
    type: "featured" | "gallery";
    index?: number;
  } | null>(null);
  const [tempImages, setTempImages] = useState<File[]>([]);

  // Add state for preview URLs
  const [previewUrls, setPreviewUrls] = useState<{
    featured: string | null;
    gallery: string[];
  }>({
    featured: null,
    gallery: [],
  });

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      if (previewUrls.featured) URL.revokeObjectURL(previewUrls.featured);
      previewUrls.gallery.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls.featured, previewUrls.gallery]);

  // Handle featured image selection
  const handleFeaturedImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurrentImage({
        url: URL.createObjectURL(file),
        type: "featured",
      });
      setCropModalOpen(true);
    }
  };

  // Handle gallery image selection
  const handleGalleryImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setTempImages(files);
      setCurrentImage({
        url: URL.createObjectURL(files[0]),
        type: "gallery",
        index: 0,
      });
      setCropModalOpen(true);
    }
  };

    // Handle crop completion with preview
    const handleCropComplete = (croppedBlob: Blob) => {
      const croppedFile = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg'
      });
  
      if (currentImage?.type === 'featured') {
        // Cleanup previous preview URL
        if (previewUrls.featured) URL.revokeObjectURL(previewUrls.featured);
        
        // Create new preview URL
        const previewUrl = URL.createObjectURL(croppedBlob);
        setPreviewUrls(prev => ({ ...prev, featured: previewUrl }));
        
        // Set form value
        setValue('image', croppedFile);
      } else if (currentImage?.type === 'gallery' && currentImage.index !== undefined) {
        const newGallery = [...(watch('imageGallery') || [])];
        newGallery[currentImage.index] = croppedFile;
        setValue('imageGallery', newGallery);
  
        // Update gallery preview URLs
        const newPreviewUrls = [...previewUrls.gallery];
        if (newPreviewUrls[currentImage.index]) {
          URL.revokeObjectURL(newPreviewUrls[currentImage.index]);
        }
        newPreviewUrls[currentImage.index] = URL.createObjectURL(croppedBlob);
        setPreviewUrls(prev => ({ ...prev, gallery: newPreviewUrls }));
  
        // Move to next image if there are more in temp images
        if (currentImage.index < tempImages.length - 1) {
          setCurrentImage({
            url: URL.createObjectURL(tempImages[currentImage.index + 1]),
            type: 'gallery',
            index: currentImage.index + 1
          });
          return;
        }
      }
  
      setCropModalOpen(false);
      setCurrentImage(null);
      setTempImages([]);
    };

    
  return (
    <>
          {isLoading && <LoadingOverlay />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Product Title
          </label>
          <input
            type="text"
            placeholder="Enter product title"
            {...register("title")}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Product Description
          </label>
          <textarea
            rows={6}
            placeholder="Enter product description"
            {...register("description")}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Price
          </label>
          <input
            type="number"
            placeholder="Enter price"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Price Without Discount */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Old Price (Optional)
          </label>
          <input
            type="number"
            placeholder="Enter old price"
            {...register("priceWithoutDiscount", {
              setValueAs: (v) => (v === "" ? null : parseFloat(v)),
              valueAsNumber: true,
            })}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors.priceWithoutDiscount && (
            <p className="mt-1 text-sm text-red-500">
              {errors.priceWithoutDiscount.message}
            </p>
          )}
        </div>

        {/* Featured Image */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageSelect}
            className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm focus:border-primary file:focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
          )}
          {/* Featured Image Preview */}
          {previewUrls.featured && (
            <div className="mt-4">
              <Image
                src={previewUrls.featured}
                alt="Featured Image Preview"
                className="h-32 w-32 rounded object-cover"
                width={128}
                height={128}
              />
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Image Gallery (Optional, max 5 images)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryImageSelect}
            className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:px-2.5 file:py-1 file:text-sm focus:border-primary file:focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
          />
          {errors.imageGallery && (
            <p className="mt-1 text-sm text-red-500">
              {errors.imageGallery.message}
            </p>
          )}
          
        {/* Gallery Preview */}
        {previewUrls.gallery.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {previewUrls.gallery.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Gallery Image ${index + 1}`}
                className="h-24 w-24 rounded object-cover"
                width={96}
                height={96}
              />
            ))}
          </div>
        )}
        </div>

        {/* Category */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Tags (Optional)
          </label>
          <MultiSelect
            id="tags"
            options={predefinedTags}
            selectedValues={tags}
            onChange={handleTagSelection}
          />
        </div>

        {/* Inventory */}
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Inventory (Optional)
          </label>
          <input
            type="number"
            placeholder="Enter inventory count"
            {...register("inventory", {
              setValueAs: (v) => (v === "" ? null : parseFloat(v)),
              valueAsNumber: true,
            })}
            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
        </div>

        {/* Submit Button */}
        <div>
        <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center rounded bg-primary px-6 py-3 text-white hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? "Updating..." : "Uploading..."}
              </>
            ) : (
              <>
                <Save className="mr-2" size={16} />
                {product ? "Update Product" : "Upload Product"}
              </>
            )}
          </button>
        </div>
      </form>
      {/* Crop Modal */}
      {cropModalOpen && currentImage && (
        <ImageCropModal
          imageUrl={currentImage.url}
          aspect={currentImage.type === 'featured' ? 1 : undefined}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropModalOpen(false);
            setCurrentImage(null);
            setTempImages([]);
          }}
        />
      )}
    </>
  );
};

export default ProductUploadForm;
