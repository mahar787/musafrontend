"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import postReq from "../utilities/postReq";
import { useRouter } from "next/navigation";
const CheckoutPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState("credit");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState("");

  async function getCartItemsFullDetails(cart) {
    let ids = cart.map((item) => item.id);
    let result = await postReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getProductsByIds`,
      { ids }
    );
    setProducts(result.response.data);
  }

  const totalAmount = products.reduce((total, item) => {
    let cartItem = cartItems.find((cart) => cart.id === item._id);
    return total + (cartItem?.quantity || 0) * item.price;
  }, 0);
  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
    getCartItemsFullDetails(cart);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const orderData = {
      ...data,
      paymentMethod: selectedPayment,
      cartItems,
      totalAmount,
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create-payment-intent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: orderData }),
      }
    );

    const session = await res.json();
    if (session.cash) {
      window.alert(session.message);
      localStorage.removeItem("cart");
      router.push("/");
      setLoading(false);
    }
    if (session.card) {
      router.push(`/checkout/uploadScreenshot?orderId=${session.id}`);
    }
    // Redirect user to Stripe Checkout
    setLoading(false);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: Address & Payment */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Contact</h2>
          <input
            {...register("contact", {
              required: "Please Enter Your Contact Details!",
            })}
            type="text"
            placeholder="Email or phone number"
            className="w-full border px-3 py-2 mb-4"
          />
          {errors.contact && (
            <p className="text-red-600">{errors.contact.message}</p>
          )}
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <select
            {...register("country")}
            className="w-full border px-3 py-2 mb-4"
          >
            <option value="Pakistan">Pakistan</option>
            <option value="UAE">United Arab Emirates</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("firstName", {
                required: "Please Enter Your Name!",
              })}
              type="text"
              placeholder="First name"
              className="w-full border px-3 py-2"
            />
            {errors.firstName && (
              <p className="text-red-600">{errors.firstName.message}</p>
            )}
            <input
              {...register("lastName")}
              type="text"
              placeholder="Last name"
              className="w-full border px-3 py-2"
            />
          </div>

          <input
            {...register("address", { required: "Please Enter Your Address!" })}
            type="text"
            placeholder="Address"
            className="w-full border px-3 py-2 my-4"
          />
          {errors.address && (
            <p className="text-red-600">{errors.address.message}</p>
          )}
          <input
            {...register("apartment")}
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full border px-3 py-2 mb-4"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              {...register("city", { required: "Please Enter Your City!" })}
              type="text"
              placeholder="City"
              className="w-full border px-3 py-2"
            />
            {errors.city && (
              <p className="text-red-600">{errors.city.message}</p>
            )}
            <input
              {...register("postalCode")}
              type="text"
              placeholder="Postal code (optional)"
              className="w-full border px-3 py-2"
            />
          </div>

          {/* Payment Selection */}
          <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={selectedPayment === "credit"}
                onChange={() => setSelectedPayment("credit")}
              />
              Credit / Debit Card
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={selectedPayment === "cash"}
                onChange={() => setSelectedPayment("cash")}
              />
              Cash on Delivery
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-black cursor-pointer text-white py-3 hover:bg-gray-900"
          >
            {loading ? "Placing" : "Place Order"}
          </button>
        </form>

        {/* Right Section: Cart Summary */}
        <div className="bg-gray-100 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          {products.map((item) => {
            let cartItem = cartItems.find((cart) => cart.id === item._id);
            return (
              <div
                key={item._id}
                className="flex items-center gap-4 border-b pb-4 mb-4"
              >
                <img
                  src={item.images[0].url}
                  alt="Product"
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <p className="font-semibold">{item?.name}</p>
                  <p className="text-gray-600 text-sm">
                    X {cartItem?.quantity}
                  </p>
                </div>
                <p className="ml-auto font-semibold">
                  Rs {item.price * cartItem?.quantity}
                </p>
              </div>
            );
          })}

          {/* Total Calculation */}
          <div className="flex justify-between font-semibold text-lg mt-4">
            <p>Subtotal</p>
            <p>Rs {totalAmount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between my-1 text-gray-600 text-sm">
            <p>Shipping</p>
            <p>FREE</p>
          </div>
          <div className="flex justify-between font-bold text-xl mt-4">
            <p>Total</p>
            <p>Rs {totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
