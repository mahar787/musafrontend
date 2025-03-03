"use client";
import Alert from "@/app/components/alert";
import postReq from "@/app/utilities/postReq";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [product, setProduct] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState("");
  async function getProduct() {
    let result = await postReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getProductById`,
      {
        id,
      }
    );
    setProduct(result.response.data);
    setMainImage(result.response.data.images[0].url);
  }
  function addToCart(productId, productName, productPrice, quantity) {
    if (quantity <= 0) {
      setResError("Quantity must be at least 1!");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Cart ko get karo

    let existingItem = cart.find((item) => item?.name === productName);

    if (existingItem) {
      existingItem.quantity += quantity; // Agar item pehle se hai, toh quantity badhao
    } else {
      let product = {
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
      };
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // Cart ko save karo
    alert(`${quantity} x ${productName} added to cart!`);
  }

  const handleChoiceSubmit = async () => {
    if (quantity == 0) {
      setResError("Please Select At Least One Product");
      return;
    }
    if (quantity < 0) {
      setResError("Please Select At Least One Product");
      return;
    } else {
      setLoading(true);

      let Item = {
        quantity,
        itemPrice: product.price,
        itemId: product._id,
      };
      addToCart(Item.itemId, product?.name, Item.itemPrice, Item.quantity);
      setLoading(false);
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <section
        className="py-12 h-auto sm:py-16 w-screen text-gray-800"
        style={{ position: "relative" }}
      >
        <Alert message={resError} />
        <div className="" style={{ position: "relative" }}></div>
        <div className="container mx-auto px-4">
          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden ">
                    <img
                      className="h-full w-full max-w-full object-cover"
                      src={mainImage ? mainImage : "#"}
                      alt="Product Image"
                    />
                  </div>
                </div>
                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                  <div className="flex flex-row items-start lg:flex-col">
                    {Array.isArray(product.images) &&
                      product.images.map((item) => {
                        return (
                          <button
                            key={item._id}
                            type="button"
                            className="flex-1 aspect-square mb-3 h-20 overflow-hidden  border-2 border-gray-900 text-center"
                            onClick={() => {
                              setMainImage(item.url);
                            }}
                          >
                            <img
                              className="h-full w-full object-cover"
                              src={item.url}
                              alt="Product Image"
                            />
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <h1 className="sm: text-2xl font-bold text-black sm:text-3xl">
                {Array.isArray(product) &&
                  product.length > 0 &&
                  product.map((item) => {
                    return item?.name;
                  })}
              </h1>

              <div className="my-3">
                <label className="text-black font-bold">
                  {Array.isArray(product.materials) &&
                  product.materials.length > 0 ? (
                    <h3 className="text-lg">Material</h3>
                  ) : (
                    ""
                  )}
                </label>
              </div>
              <div className="flex gap-1 mt-3 flex-wrap">
                {Array.isArray(product.materials) &&
                  product.materials.length > 0 &&
                  product.materials.map((item, i) => {
                    return <span key={i}>{item}</span>;
                  })}
              </div>
              <div className="my-2">
                <div className="my-2">Quantity</div>
                <div className="flex gap-3 items-center justify-between w-40">
                  <button
                    onClick={() => {
                      setQuantity(quantity + 1);
                    }}
                    className="bg-black cursor-pointer text-white font-bold px-4  shadow-lg py-2"
                  >
                    +
                  </button>

                  <input
                    className="w-12"
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      setQuantity(quantity - 1);
                    }}
                    disabled={quantity == 0 ? true : false}
                    className="bg-black cursor-pointer text-white font-bold px-4  shadow-lg py-2"
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1 className="text-3xl font-bold text-black">
                    {product.price}
                  </h1>
                  <span className="text-base text-black">/RS</span>
                </div>

                <button
                  type="submit"
                  onClick={() => {
                    handleChoiceSubmit();
                  }}
                  className="inline-flex items-center justify-center  border-2 border-transparent bg-black bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-[white] hover:text-black cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0 mr-3 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {loading ? "Adding" : "Add to cart"}
                </button>
              </div>

              <ul className="mt-8 space-y-2">
                <li className="flex items-center text-left text-sm font-medium text-black">
                  <svg
                    className="mr-2 block h-5 w-5 align-middle text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      className=""
                    ></path>
                  </svg>
                  Provide Shipping All Over Pakistan
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <div className="mt-8 flow-root sm:mt-12">
                <h1 className="text-3xl text-black font-bold">
                  Fabric Description
                </h1>
                {Array.isArray(product?.descriptionPoints) &&
                  product.descriptionPoints.map((des, i) => {
                    return (
                      <li className=" text-lg mt-3" key={i}>
                        {des}
                      </li>
                    );
                  })}
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="mt-8 flow-root sm:mt-12">
                <h1 className="text-3xl text-black font-bold">
                  Choosing the Right Fabric Size for Your Shalwar Kameez
                </h1>
                {Array.isArray(product?.usageInstructions) &&
                  product.usageInstructions.map((des, i) => {
                    return (
                      <li className="text-lg mt-3" key={i}>
                        {des}
                      </li>
                    );
                  })}
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="mt-8 flow-root sm:mt-12">
                <h1 className="text-3xl text-black font-bold">
                  Fabric Care Instructions
                </h1>
                {Array.isArray(product?.caringInstructions) &&
                  product.caringInstructions.map((des, i) => {
                    return (
                      <li className="text-lg mt-3" key={i}>
                        {des}
                      </li>
                    );
                  })}
              </div>
            </div>
            <div className="lg:col-span-3">
              {product.youtubeVideo && (
                <div
                  className="relative w-full"
                  style={{ paddingTop: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={product.youtubeVideo}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section></section>
    </>
  );
};

export default Page;
