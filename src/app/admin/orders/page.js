"use client";
import getReq from "@/app/utilities/getReq";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const res = await getReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getOrders?page=${page}`
      );
      if (res.statusCode === 200) {
        setOrders(res.response.orders);
        setTotalPages(res.response.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Orders</h1>
      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-600 p-2">Order ID</th>
                <th className="border border-gray-600 p-2">Name</th>
                <th className="border border-gray-600 p-2">Payment</th>
                <th className="border border-gray-600 p-2">Status</th>
                <th className="border border-gray-600 p-2">Total</th>
                <th className="border border-gray-600 p-2">Date</th>
                <th className="border border-gray-600 p-2">More Details</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) &&
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-center cursor-pointer hover:bg-gray-200"
                  >
                    <td className="border border-gray-600 p-2">{order._id}</td>
                    <td className="border border-gray-600 p-2">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {order.paymentMethod}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {order.orderStatus}
                    </td>
                    <td className="border border-gray-600 p-2">
                      {order.totalPrice} ./Rs
                    </td>
                    <td className="border border-gray-600 p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      onClick={() => {
                        router.push(`/admin/orders/${order._id}`);
                      }}
                      className="border bg-black text-white  p-2"
                    >
                      More Details
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
