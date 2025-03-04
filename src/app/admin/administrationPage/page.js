import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col items-start p-6 gap-5 h-screen w-screen">
      <Link className="p-2 bg-black text-white" href={"/admin/addCollection"}>
        Add Collection
      </Link>
      <Link className="p-2 bg-black text-white" href={"/admin/addProduct"}>
        Add Product
      </Link>
      <Link className="p-2 bg-black text-white" href={"/admin/getPayments"}>
        Payments
      </Link>
      <Link className="p-2 bg-black text-white" href={"/admin/orders"}>
        Orders
      </Link>
      <Link className="p-2 bg-black text-white" href={"/admin/products"}>
        Products
      </Link>
    </div>
  );
};

export default Page;
