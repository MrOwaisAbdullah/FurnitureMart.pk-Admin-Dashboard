"use client"

import { Edit, Trash2 } from "lucide-react"; // Using Lucide icons

const productData = [
  {
    _id: "1",
    title: "Modern Sofa",
    category: "Furniture",
    price: 499,
    inventory: 10,
    image: "/images/product/product-01.png",
  },
  {
    _id: "2",
    title: "Wooden Table",
    category: "Furniture",
    price: 299,
    inventory: 5,
    image: "/images/product/product-02.png",
  },
];

const ProductTable = () => {
  const handleEdit = (productId: string) => {
    // Implement logic to edit product
    console.log(`Editing product ${productId}`);
  };

  const handleDelete = (productId: string) => {
    // Implement logic to delete product
    console.log(`Deleting product ${productId}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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

      {productData.map((product, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                <img
                  src={product.image}
                  alt="Product"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm text-black dark:text-white">
                {product.title}
              </p>
            </div>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {product.category}
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
                onClick={() => handleDelete(product._id)}
                className="hover:text-danger"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;