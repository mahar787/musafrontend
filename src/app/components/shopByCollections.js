"use client";
import React, { useEffect, useState } from "react";
import getReq from "../utilities/getReq";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "500" });

const ShopByCollections = () => {
  const [collections, setCollections] = useState([]);
  async function getCollections() {
    let result = await getReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getCollections`
    );
    setCollections(result.response.data);
  }
  useEffect(() => {
    getCollections();
  }, []);
  return (
    <main className="h-auto border-t-2 border-gray-300">
      <h1 className={`text-2xl font-bold mx-5 my-10 ${inter.className}`}>
        Shop By Collections
      </h1>
      <div className="grid p-4 sm:p-6 md:p-8 grid-cols-1 sm:grid-cols-2">
        {Array.isArray(collections) &&
          collections.length > 0 &&
          collections.map((collection) => (
            <a
              href={`/products/${collection._id}`}
              key={collection._id}
              className="relative group"
            >
              {/* ✅ Background Image */}
              <img
                src={collection.image} // ✅ Cloudinary Image
                alt={collection?.name}
                className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-101"
              />

              {/* ✅ Overlay and Text */}
              <div className="absolute inset-0 flex justify-center items-center ">
                <h1 className="text-white text-2xl font-semibold">
                  {collection?.name}
                </h1>
              </div>
            </a>
          ))}
      </div>
    </main>
  );
};

export default ShopByCollections;
