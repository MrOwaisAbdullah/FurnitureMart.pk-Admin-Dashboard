"use client";
import React, { useEffect, useState } from "react";
import LoadingOverlay from "../common/Loader/LoadingOverlay";
import ChartOne from "../Charts/ChartOne";
import CardDataStats from "../CardDataStats";
import ChartTwo from "../Charts/ChartTwo";
import ChartThree from "../Charts/ChartThree";

const SellerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/seller/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Total Orders
  const totalOrders = orders.length;

  // Calculate total sales
  const totalSales = orders
    .reduce((sum, order) => sum + (order.total || 0), 0)
    .toFixed(2);

  // Filter completed orders
  const completedOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "delivered",
  ).length;

  // Filter pending orders
  const pendingOrders = totalOrders - completedOrders;

  // Calculate order status distribution
  const getOrderStatusDistribution = (orders: any[]) => {
    const statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((order) => {
      const status = order.status as keyof typeof statusCounts;
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      }
    });
    return Object.values(statusCounts);
  };

//   console.log("Pending Orders:", pendingOrders);
//   console.log("Completed Orders:", completedOrders);
//   console.log("Total Orders:", totalOrders);

  if (loading) {
    return <LoadingOverlay />;
  }

  const statusDistribution = getOrderStatusDistribution(orders);

  return (
    <>
      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CardDataStats
          title="Total Sales"
          total={`$${totalSales.toString()}`}
        />
        <CardDataStats
          title="Pending Orders"
          total={pendingOrders.toString()}
        />
        <CardDataStats
          title="Completed Orders"
          total={completedOrders.toString()}
        />
        <CardDataStats title="Total Orders" total={totalOrders.toString()} />
      </div>

      {/* Charts */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartOne orders={orders} />
        <ChartTwo orders={orders} />
      </div>

      {/* Order Status Distribution */}
      <ChartThree series={statusDistribution} />
    </>
  );
};

export default SellerDashboard;
