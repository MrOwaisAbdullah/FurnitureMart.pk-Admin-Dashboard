"use client";
import { Eye, Trash2 } from "lucide-react";

const orderData = [
  {
    orderId: "#12345",
    customerName: "John Doe",
    orderDate: "Jan 13, 2023",
    status: "Pending",
    total: 99.0,
  },
  {
    orderId: "#12346",
    customerName: "Jane Smith",
    orderDate: "Jan 14, 2023",
    status: "Shipped",
    total: 59.0,
  },
  {
    orderId: "#12347",
    customerName: "Alice Johnson",
    orderDate: "Jan 15, 2023",
    status: "Delivered",
    total: 199.0,
  },
];

const OrderTable = () => {
  const handleStatusChange = (orderId: string, newStatus: string) => {
    // Implement logic to update order status in Sanity
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Order ID
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Customer Name
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
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{order.orderId}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.customerName}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {order.orderDate}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.orderId, e.target.value)
                    }
                    className={`rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                      order.status === "Pending"
                        ? "bg-warning text-warning"
                        : order.status === "Shipped"
                        ? "bg-success text-success"
                        : order.status === "Delivered"
                        ? "bg-primary text-primary"
                        : "bg-danger text-danger"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">${order.total}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      {/* View Details Icon */}
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="hover:text-danger">
                      {/* Cancel Order Icon */}
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;