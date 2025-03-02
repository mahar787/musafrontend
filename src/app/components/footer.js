import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <h2 className="text-white text-xl font-bold">SUITS BY MUSA</h2>
            <p className="mt-2 text-sm">
              Premium quality fabrics for your everyday and special occasions.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>

              <li>
                <a href="/about" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold">Policies</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Free Delivery Nationwide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Quality
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Social Links */}
          <div>
            <h3 className="text-white font-semibold">Subscribe</h3>
            <p className="text-sm mt-2">Get special offers and updates.</p>

            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center border-t border-gray-700 pt-4 text-sm">
          &copy; 2025 SUITS BY MUSA.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
