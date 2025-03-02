"use client";
import Alert from "@/app/components/alert";
import postReq from "@/app/utilities/postReq";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [order, setOrder] = useState("");
  const { orderId } = useParams();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  async function getOrderDetails() {
    let result = await postReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getSpecificOrder`,
      { orderId }
    );
    setOrder(result.response.order);
    console.log(result.response);
    setPaymentStatus(result.response.order.paymentStatus);
    setOrderStatus(result.response.order.orderStatus);
  }
  useEffect(() => {
    getOrderDetails();
  }, []);
  async function updateOrder(id) {
    setLoading(true);
    try {
      let result = await postReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/updateOrder`,
        {
          orderId: id,
          paymentStatus,
          orderStatus,
        }
      );
      if (result.statusCode === 200) {
        setApiResponse(result.response.message);
        getOrderDetails();
      }
      setLoading(false);
    } catch (error) {
      console.log("Error in updating order!", error);
    }
  }

  return (
    <div className="flex-col w-screen h-screen items-center">
      <Alert message={apiResponse} />
      {order && (
        <div className="w-full max-w-2xl  p-6 rounded-lg shadow-lg ">
          <button
            onClick={() => {
              updateOrder(order._id);
            }}
            className="bg-black cursor-pointer text-white px-3 py-2 my-4"
          >
            Upadte Order
          </button>
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Name:</strong> {order.firstName} {order.lastName}
          </p>
          <p>
            <strong>Contact:</strong> {order.contact}
          </p>
          <p>
            <strong>Address:</strong> {order.address}, {order.city},{" "}
            {order.country}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </p>
          <p>
            <strong>Total Price:</strong> {order.totalPrice} ./Rs
          </p>
          <p>
            <strong>Payment Status:</strong>
            <select
              className="text-black bg-white p-2 my-2"
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value={order.paymentStatus}>{order.paymentStatus}</option>
              <option
                value={order.paymentStatus === "pending" ? "paid" : "pending"}
              >
                {order.paymentStatus === "pending" ? "paid" : "pending"}
              </option>
            </select>
          </p>
          <p>
            <strong>Order Status:</strong>{" "}
            <select
              className="text-black bg-white p-2"
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value={order.orderStatus}>{order.orderStatus}</option>
              <option value={"pending"}>pending</option>
              <option value={"cancelled"}>cancelled</option>
              <option value={"delivered"}>delivered</option>
            </select>
          </p>
        </div>
      )}
      ;<h1 className="text-lg font-bold">Selected Items</h1>
      <table className="w-full border-collapse border border-gray-700">
        <thead>
          <tr className="bg-black text-white">
            <th className="border border-gray-600 p-2">Name</th>
            <th className="border border-gray-600 p-2">Colors</th>
            <th className="border border-gray-600 p-2">Sizes</th>
            <th className="border border-gray-600 p-2">Quantity</th>
            <th className="border border-gray-600 p-2">Total</th>
            <th className="border border-gray-600 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(order.items) &&
            order.items.map((item, i) => {
              return (
                <tr
                  key={i}
                  className="text-center cursor-pointer hover:bg-gray-200"
                >
                  <td className="border border-gray-600 p-2">{item?.name}</td>
                  <td className="border border-gray-600 p-2">
                    {item.selectedColors.map((color, i) => (
                      <span key={i}>{color},&nbsp;</span>
                    ))}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {item.selectedSizes.map((size, i) => (
                      <span key={i}>{size}, &nbsp;</span>
                    ))}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-600 p-2">
                    ${order.totalPrice}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
