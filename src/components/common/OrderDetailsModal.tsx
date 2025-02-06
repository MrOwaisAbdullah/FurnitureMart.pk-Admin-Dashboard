"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

// console.log("Slug:", order.products[0]?.product?.slug.current);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Order Details</h2>
        <p>
          <strong>Order ID:</strong> {order.orderId}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total:</strong> ${order.total.toFixed(2)}
        </p>
        <p>
          <strong>Shipping Address:</strong>{" "}
          {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
        </p>
        <h3 className="mt-4 font-semibold">Products:</h3>
        <div className="space-y-2">
          {order.products.map((product: any, index: number) => {
            // Ensure product.slug exists and is a valid string
            const productSlug = product?.product?.slug?.current;
            const productHref = productSlug
              ? `${process.env.NEXT_PUBLIC_FURNITURE_MART_URL}/product/${productSlug}`
              : "#"; // Fallback href (e.g., "#" or a placeholder)

            return (
              <div key={index} className="flex items-center space-x-4">
                <Link href={productHref} className="hover:text-primary" target="_blank">
                  <Image
                    src={product.product.image.url}
                    alt={product.product.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded object-cover"
                  />
                </Link>
                <div>
                <Link href={productHref} className="hover:text-primary" target="_blank">
                  <p>{product.product.title}</p>
                  </Link>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ${product.product.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="hover:bg-accent mt-4 rounded bg-primary px-4 py-2 text-white transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;