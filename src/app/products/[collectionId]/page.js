"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "200" });

const ProductsPage = () => {
  const { collectionId } = useParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce function to delay API calls
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const fetchProducts = async () => {
    if (!collectionId) return;
    const queryParams = new URLSearchParams({
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
      ...(sortBy && { sortBy }),
      ...(order && { order }),
    }).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getProducts/${collectionId}?${queryParams}`
    );
    const data = await res.json();
    setProducts(data);
  };

  // Debounced API call
  useEffect(() => {
    const debouncedFetch = debounce(fetchProducts, 500);
    debouncedFetch();
  }, [collectionId, minPrice, maxPrice, sortBy, order]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Filters & Sorting */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="border px-4 py-2 rounded-md shadow-md"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="bg-gray-100 p-4 rounded-md mb-4 flex gap-4 flex-wrap">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-3 py-2 rounded-md w-32"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-3 py-2 rounded-md w-32"
          />
        </div>
      )}

      {/* Product Grid */}
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 ${inter.className}`}
      >
        {Array.isArray(products) &&
          products.length > 0 &&
          products.map((product) => (
            <a
              href={`/viewProduct/${product._id}`}
              key={product._id}
              className="shadow-md cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-102 hover:shadow-lg"
            >
              <img
                src={product.images[0].url}
                alt={product?.name}
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
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
    </div>
  );
};

export default ProductsPage;
