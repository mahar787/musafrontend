"use client";
import postReq from "@/app/utilities/postReq";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState("");
  const [message, setMessage] = useState("");

  async function addOrder() {
    try {
      let result = await postReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/addOrder`,
        {
          orderId,
        }
      );

      setOrder(result.response.data);
      localStorage.removeItem("cart");
      setMessage(result.response.message);
    } catch (error) {
      console.log("Error in adding order", error);
    }
  }

  useEffect(() => {
    addOrder();
  }, []);

  return (
    <div className="container mx-auto text-center py-10">
      <h1 className="text-3xl font-bold">Your Order Id is {order?._id}</h1>
      <p className="text-2xl">{message || ""}.</p>
      <p className="text-xl">Please Take Screenshot</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<p className="text-center text-2xl">Loading...</p>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
