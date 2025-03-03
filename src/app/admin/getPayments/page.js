"use client";
import { useEffect, useState } from "react";

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getAllPayments?page=${currentPage}`
        );
        const data = await res.json();
        setPayments(data.payments);

        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
    fetchPayments();
  }, [currentPage]); // Fetch data when page changes

  return (
    <div className="min-h-screen p-6 flex flex-col items-center ">
      <h1 className="text-3xl font-bold mb-6">Payment Proofs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(payments) &&
          payments.map((payment) => (
            <div
              key={payment?._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <p className="text-lg font-semibold">
                Order ID: {payment?.orderId}
              </p>
              <img
                src={payment?.image}
                alt="Payment Proof"
                className="w-full h-48 object-cover mt-3 rounded-lg cursor-pointer hover:opacity-80"
                onClick={() => setSelectedImage(payment?.image)}
              />
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-800 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged Payment Proof"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
