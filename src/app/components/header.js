"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import mainlogo from "../../../public/2.png";
import searchIcon from "../../../public/searchIcon.svg";
import cart from "../../../public/cart.png";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getReq from "../utilities/getReq";
import menu from "../../../public/menu.svg";
const inter = Inter({ subsets: ["latin"], weight: "300" });
const Header = () => {
  const router = useRouter();
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Cart state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const [showCollections, setShowCollections] = useState(false);
  const cartRef = useRef(null);
  const [collections, setCollections] = useState([]);

  async function getCollections() {
    try {
      let result = await getReq(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/getCollections`
      );
      setCollections(result.response.data);
    } catch (error) {
      console.log("error in fetching collections", error);
    }
  }
  useEffect(() => {
    getCollections();
  }, []);

  const displayCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  };
  function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter((item) => item?.name !== productName); // Selected item delete kar do

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  }
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/search?query=${searchTerm}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <header className="flex px-6 text-white justify-between items-center bg-black">
        {/* Search Button */}
        {/* Search Container (Icon + Box) */}
        <button
          className="cursor-pointer block md:hidden"
          onClick={() => setShowCollections(!showCollections)}
        >
          <Image src={menu} height={30} width={30} alt="Menu Icon" />
        </button>
        <div className="relative">
          {/* Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="cursor-pointer hidden md:block"
          >
            <Image src={searchIcon} height={30} width={30} alt="Search Icon" />
          </button>

          {/* Search Box & Suggestions */}
          {isSearchOpen && (
            <div
              ref={searchRef}
              className="absolute top-full left-0 mt-1 w-[300px] bg-white shadow-lg rounded-md p-2 z-50"
            >
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none text-black"
                placeholder="Search products..."
                value={query}
                onChange={handleInputChange}
              />
              {suggestions.length > 0 && (
                <ul className="mt-2 bg-white border rounded-md shadow-lg">
                  {suggestions.map((item) => (
                    <li
                      key={item._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => {
                        router.push(`/viewProduct/${item._id}`);
                        setIsSearchOpen(false);
                      }}
                    >
                      {item?.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div>
          <Image
            src={mainlogo}
            height={150}
            width={150}
            alt="Musa Fabrics's Icon"
          />
        </div>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="cursor-pointer block md:hidden"
        >
          <Image src={searchIcon} height={30} width={30} alt="Search Icon" />
        </button>
        <button
          onClick={() => {
            setShowCart(!showCart);

            displayCart();
          }}
          className="cursor-pointer"
        >
          <Image src={cart} height={30} width={30} alt="cart icon" />
        </button>

        {showCart && (
          <div
            ref={cartRef}
            className={`w-full sm:w-[90%] md:min-w-[520px] transition-all max-w-[620px] overflow-auto z-10 h-[90vh] absolute top-14 right-0  mx-auto sm:right-2 p-4 rounded-md shadow-lg border bg-white ${inter.className}`}
          >
            <section>
              <div className="flex justify-between  items-center mb-4">
                <h2 className="text-2xl font-semibold text-black">🛒 Cart</h2>
                <button
                  className="py-1 px-3 rounded-sm font-bold text-lg text-white bg-black hover:bg-white hover:text-black transition duration-200"
                  onClick={() => setShowCart(!showCart)}
                >
                  X
                </button>
              </div>

              {cartItems.length === 0 ? (
                <p className="mt-4 text-lg text-[#333333]">
                  🛒 Your cart is empty!
                </p>
              ) : (
                <div className="mt-4">
                  <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-center">Price</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                        <th className="px-4 py-2 text-center">Total</th>
                        <th className="px-4 py-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className={`${inter.className} text-lg`}>
                      {cartItems.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-300 transition duration-200"
                        >
                          <td className="px-4 py-2 text-sm font-semibold text-[#333333]">
                            {item?.name}
                          </td>
                          <td className="px-4 py-2 text-center text-sm font-medium text-[#333333]">
                            {item.price} PKR
                          </td>
                          <td className="px-4 py-2 text-center text-sm text-[#333333]">
                            {item.quantity}
                          </td>
                          <td
                            className={`px-4 py-2 text-center font-semibold text-[#333333] ${inter.className}`}
                          >
                            {item.price * item.quantity} PKR
                          </td>
                          <td
                            onClick={() => {
                              removeFromCart(item?.name);
                            }}
                            className="text-center font-semibold text-[#333333]"
                          >
                            <button className="bg-white cursor-pointer px-2 py-1">
                              X
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Cart Summary */}
                  <div
                    className={`flex justify-between text-white mt-4 bg-black p-3 ${inter.className}`}
                  >
                    <p className="text-lg font-semibold ">Total:</p>
                    <p className="text-lg font-semibold ">
                      {cartItems.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )}{" "}
                      PKR
                    </p>
                  </div>
                  <div className="flex justify-center text-black">
                    <p>
                      Shipping, taxes, and discount codes calculated at
                      checkout.
                    </p>
                  </div>
                  {/* Checkout Button */}
                  <div className="mt-6 mb-0 flex justify-center">
                    <button
                      onClick={() => {
                        router.push("/checkout");
                        setShowCart(false);
                      }}
                      className="bg-black text-white px-8 py-3 cursor-pointer hover:bg-white hover:text-black hover:font-bold transition duration-400"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </header>
      {/* collection for mobile devices */}
      {showCollections && (
        <div
          className={`fixed top-0 left-0 h-full w-1/2 bg-black text-white py-5 px-6 md:hidden 
                transform transition-transform duration-300 ease-in-out ${
                  showCollections ? "translate-x-0" : "-translate-x-full"
                } z-50 shadow-lg`}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-xl text-white"
            onClick={() => setShowCollections(false)}
          >
            X
          </button>

          <div className="flex flex-col mt-10 gap-4 text-lg">
            <Link
              href="/"
              className="hover:text-gray-300"
              onClick={() => setShowCollections(false)}
            >
              Home
            </Link>
            {Array.isArray(collections) &&
              collections.map((collection) => (
                <a
                  key={collection._id}
                  href={`/products/${collection._id}`}
                  className="hover:text-gray-300"
                  onClick={() => setShowCollections(false)}
                >
                  {collection?.name}
                </a>
              ))}
            <a
              href="/about"
              className="hover:text-gray-300"
              onClick={() => setShowCollections(false)}
            >
              About
            </a>
            <a
              href="/contact"
              className="hover:text-gray-300"
              onClick={() => setShowCollections(false)}
            >
              Contact Us
            </a>
          </div>
        </div>
      )}

      {/* collection for mobile devices */}
      <div
        className={`px-10 hidden sm:px-12 md:px-14 overflow-x-auto bg-black text-white py-3 md:flex items-center overflow-y-hidden ${inter.className} gap-12 text-base sm:text-lg md:text-xl font-extralight min-w-[screen] whitespace-nowrap py-3`}
      >
        <Link
          href="/"
          className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0
                 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                 hover:after:w-full"
        >
          Home
        </Link>
        {Array.isArray(collections) &&
          collections.map((collection) => {
            return (
              <a
                className="relative cursor-pointer after:content-[''] after:absolute after:left-0 after:bottom-0
                 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                 hover:after:w-full"
                key={collection._id}
                href={`/products/${collection._id}`}
              >
                {collection?.name}
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
    </>
  );
};

export default Header;
