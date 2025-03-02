import React from "react";
import getReq from "../utilities/getReq";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const Collections = async () => {
  let collections = await getCollections();
  return (
    <div
      className={`px-10 sm:px-12 md:px-14 overflow-x-auto bg-black text-white py-3 flex items-center overflow-y-hidden ${inter.className} gap-12 text-base sm:text-lg md:text-xl font-extralight min-w-[screen] whitespace-nowrap py-3`}
    >
      <Link
        href="/"
        className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0
                 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                 hover:after:w-full"
      >
        Home
      </Link>
      {collections?.map((collection) => {
        return (
          <a
            className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0
                 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                 hover:after:w-full"
            key={collection._id}
            href={`/products/${collection._id}`}
          >
            {collection.name}
          </a>
        );
      })}
      <a
        href="/about"
        className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0
                 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                 hover:after:w-full"
      >
        About
      </a>
      <a
        href="/contact"
        className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0
                 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                 hover:after:w-full"
      >
        Contact Us
      </a>
    </div>
  );
};

export default Collections;
async function getCollections() {
  try {
    let result = await getReq(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getCollections`
    );
    return result.response.data;
  } catch (error) {
    console.log("error in fetching collections", error);
  }
}
