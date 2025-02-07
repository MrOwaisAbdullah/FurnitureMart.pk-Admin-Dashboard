import ProductUploadForm from "@/components/FormElements/ProductForm";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const ProductForm = async () => {
  const { userId } = await auth();
  return (
    <DefaultLayout>
      <ProductUploadForm sellerId={userId as string} />
    </DefaultLayout>
  );
};

export default ProductForm;
