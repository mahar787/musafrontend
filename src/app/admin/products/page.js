"use client";
import Alert from "@/app/components/alert";
import getReq from "@/app/utilities/getReq";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchProducts(pageNumber, collectionId = "") {
    setLoading(true);
    try {
      const res = await getReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getAllProducts?page=${pageNumber}&collectionId=${collectionId}`
      );
      setProducts(res.response.products);
      setTotalPages(res.response.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCollections() {
    try {
      const res = await getReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getCollections`
      );
      setCollections(res.response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  useEffect(() => {
    fetchCollections();
    fetchProducts(page, selectedCollection);
  }, [page, selectedCollection]);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center my-6">Our Products</h1>

      <div className="mb-4 flex justify-center">
        <select
          className="p-2 border rounded-md"
          value={selectedCollection}
          onChange={(e) => {
            setSelectedCollection(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Collections</option>
          {collections.map((col) => (
            <option key={col._id} value={col._id}>
              {col.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <a
            href={`/admin/products/${product._id}`}
            key={product._id}
            className="bg-white p-4 cursor-pointer rounded-lg shadow-md hover:shadow-lg transition"
          >
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">Price: Rs {product.price}</p>
            <p className="text-sm text-gray-500">
              {product.descriptionPoints[0]}
            </p>
          </a>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 my-6">
        <button
          className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1 || loading}
        >
          Previous
        </button>

        <span className="text-lg font-semibold">
          Page {page} of {totalPages}
        </span>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
