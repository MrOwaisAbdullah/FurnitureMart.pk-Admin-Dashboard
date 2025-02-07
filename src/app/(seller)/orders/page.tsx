"use client"
import { useEffect, useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import OrderTable from "@/components/Tables/OrdersTable";
import { useUser } from "@clerk/nextjs";

const Orders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/seller/orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/seller/update-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status.");
      }

      // Re-fetch orders to reflect the updated status
      const updatedOrders = await fetch(`/api/seller/orders`);
      if (!updatedOrders.ok) {
        throw new Error("Failed to fetch updated orders.");
      }
      const data = await updatedOrders.json();
      setOrders(data);
    } catch (error) {
      console.error(`Failed to update order ${orderId}:`, error);
    }
  };

  return (
    <DefaultLayout>
      <h1 className="text-2xl font-bold text-center mb-4">Your Orders</h1>
      <OrderTable
        orders={orders}
        onUpdateStatus={handleStatusChange}
      />
    </DefaultLayout>
  );
};

export default Orders;