import Image from "next/image";
import delivery from "../../../public/delivery.jpg";
import exchange from "../../../public/exchange.jpg";
import quality from "../../../public/quality.jpg";
import Link from "next/link";
export default function FeaturesSection() {
  return (
    <section className="py-12 px-4 sm:px-8 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <Image
              src={delivery}
              alt="Free Delivery"
              className="w-full h-64 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-lg font-bold">Free delivery Nationwide</h3>
            <p className="text-gray-600">
              We offer free delivery for our customers throughout Pakistan
              regardless of the package size.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center">
            <Image
              src={quality}
              alt="Best Sellers"
              className="w-full h-64 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-lg font-bold">Best sellers</h3>
            <p className="text-gray-600">
              Shop our Best sellers for the season.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center">
            <Image
              src={exchange}
              alt="Hassle Free Returns"
              className="w-full h-64 object-cover rounded-lg"
            />
            <h3 className="mt-4 text-lg font-bold">
              Hassle Free Exchanges & Returns
            </h3>
            <p className="text-gray-600 mb-7">
              At Shaad we believe in ultimate customer satisfaction and provide
              a hassle-free returns & exchange policy.
            </p>
            <Link
              href={"/returnPolicy"}
              className="mt-7 px-4 py-2 border border-gray-700 rounded-md text-gray-700 hover:bg-gray-200 transition"
            >
              PROCEDURE TO RETURN
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
