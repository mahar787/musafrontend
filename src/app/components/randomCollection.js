import React from "react";
import getReq from "../utilities/getReq";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "200" });
const RandomCollection = async () => {
  let result = await getReq(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getRandomCollection`
  );
  const products = result.response.products;

  return (
    <>
      <main className="min-h-screen mt-10 p-4">
        <h1 className="text-3xl my-5 font-bold">
          {result.response.collection?.name}
        </h1>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 ${inter.className}`}
        >
          {Array.isArray(products) &&
            products.length > 0 &&
            products.map((product) => (
              <a
                href={`/viewProduct/${product._id}`}
                key={product._id}
                className="shadow-md cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-103 hover:shadow-lg"
              >
                <img
                  src={product.images[0].url}
                  alt={product?.name}
                  className="w-full h-[400px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{product?.name}</h3>
                  <p className="text-gray-600 font-semibold text-lg">
                    Rs. {product.price}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </main>
    </>
  );
};

export default RandomCollection;
