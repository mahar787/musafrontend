"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    name: "Kamran Shabir",
    location: "Rawalpindi, Pakistan",
    review:
      "I have received my parcel by touching quality looks best and feel a softy touch. Delivery service is very fast. Keep it up.",
  },
  {
    name: "Zohaib Minahil",
    location: "Islamabad, Pakistan",
    review:
      "I received my parcel today, it&#39;s my 2nd purchase from Shaad Fabrics. Excellent quality, premium fabric as they claimed. Highly recommend and trustable platform.",
  },
  {
    name: "Arif Iqbal Soomro",
    location: "Karachi, Pakistan",
    review:
      "Very nice and super quality fabrics. Excellent finishing. Thank you Shaad Fabrics.",
  },
  {
    name: "Ahsan Javed",
    location: "Lahore, Pakistan",
    review:
      "Absolutely amazing fabric quality! This was my first order, and I&#39;m truly impressed. Delivery was on time, and packaging was premium.",
  },
  {
    name: "Sarah Khan",
    location: "Multan, Pakistan",
    review:
      "Ordered for the first time, and I must say the fabric is exactly as shown. The color, texture, and feel are premium. Will order again!",
  },
];

export default function ReviewSection() {
  return (
    <div className="py-16 px-4 md:px-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">REVIEWS</h2>
      <Swiper
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        spaceBetween={30}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        modules={[Pagination, Autoplay]}
        className="pb-10"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white p-6 rounded-xl shadow-md text-center mx-2">
              <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
              <p className="text-gray-600 italic">
                &quot;{review.review}&quot;
              </p>
              <h3 className="font-bold text-lg mt-4">{review.name}</h3>
              <p className="text-gray-500 text-sm">{review.location}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
