"use client";
import React, { useState } from "react";
import { Eye } from "lucide-react";
import OrderDetailsModal from "@/components/common/OrderDetailsModal";

// Props for the OrderTable component
interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, onUpdateStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // console.log(orders);

  // Open details modal
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 overflow-y-hidden">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Order ID
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Customer
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Order Date
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Total
              </th>
              <th className="px-4 py-4 text-center font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order: Order) => (
                <tr key={order._id}>
                  {/* Order ID */}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {order.orderId}
                    </p>
                  </td>

                  {/* Customer Name (for seller dashboard) or Seller Name (for customer dashboard) */}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {order.customer?.name || order.seller?.shopName || "N/A"}
                    </p>
                  </td>

                  {/* Order Date */}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {new Date(order._createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  {/* Status Dropdown */}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateStatus(order._id, e.target.value)
                      }
                      className={`rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                        order.status === "Pending"
                          ? "bg-warning text-warning"
                          : order.status === "Processing"
                            ? "bg-blue-400 text-blue-400"
                            : order.status === "Shipped"
                              ? "bg-primary text-primary"
                              : order.status === "Delivered"
                                ? "bg-success text-success"
                                : order.status === "Cancelled"
                                  ? "bg-danger text-danger"
                                  : ""
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Total Amount */}
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      ${order.total.toFixed(2)}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark">
                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="hover:text-primary"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default OrderTable;
