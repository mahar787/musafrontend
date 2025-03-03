"use client";
import React, { useEffect, useState } from "react";
import getReq from "../utilities/getReq";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "200" });
const RandomCollection = () => {
  const [data, setData] = useState([]);
  async function getRandomCollectionData() {
    let result = await getReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getRandomCollection`
    );
    setData(result.response.data);
  }
  useEffect(() => {
    getRandomCollectionData();
  }, []);

  return (
    <>
      <main className="min-h-screen mt-10 p-4">
        {Array.isArray(data) &&
          data.length > 0 &&
          data.map((item) => {
            return (
              <section
                className="py-5 border-t-2 border-gray-500"
                key={item.collection?._id}
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl my-5 font-bold">
                  {item.collection?.name}
                </h1>
                <div className={`grid grid-cols-3 gap-8 ${inter.className}`}>
                  {item.products.map((product) => {
                    return (
                      <a
                        href={`/viewProduct/${product._id}`}
                        key={product._id}
                        className="shadow-md cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-103 hover:shadow-lg"
                      >
                        <img
                          src={product.images[0].url}
                          alt={product?.name}
                          className="w-full h-[100px] sm:h-[200px] md:h-[300px] lg:h-[400px] object-cover"
                        />
                        <div className="p-2 sm:p-3 md:p-4">
                          <h3 className="text-sm sm:text-base md:text-xl font-semibold">
                            {product?.name}
                          </h3>
                          <p className="text-gray-600 font-semibold text-sm sm:text-base md:text-lg">
                            Rs. {product.price}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </main>
    </>
  );
};

export default RandomCollection;
