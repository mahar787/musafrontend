import React from "react";
import Image from "next/image";
import bannerLarge from "../../../public/bannerrr.png";
import bannerSmall from "../../../public/smBanner.png"; // Replace with your small screen image

const MainBanner = () => {
  return (
    <main className="relative w-full h-screen">
      {/* Large screen image */}
      <Image
        src={bannerLarge}
        alt="Main Banner"
        layout="fill"
        objectFit="cover"
        objectPosition="top center"
        priority
        className="hidden md:block"
      />

      {/* Small screen image */}
      <Image
        src={bannerSmall}
        alt="Small Screen Banner"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
        className="block md:hidden"
      />
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <button className=" text-white px-6 cursor-pointer py-3 font-bold border-4 border-white shadow-md">
          Shop Now
        </button>
      </div>
    </main>
  );
};

export default MainBanner;
