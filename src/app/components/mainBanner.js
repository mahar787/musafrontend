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
    </main>
  );
};

export default MainBanner;
