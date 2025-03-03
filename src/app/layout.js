import { Inter } from "next/font/google";
import "./globals.css";
import FreeShipping from "./components/freeShipping";
import Header from "./components/header";
import Footer from "./components/footer";
import FeaturesSection from "./components/FeaturesSection";

// ✅ Importing Inter font with all weight variants
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // ✅ All weights included
});

export const metadata = {
  title: "SUITS BY MUSA",
  description: "A Clothing Brand",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <FreeShipping />
        <Header />

        {children}
        <FeaturesSection />
        <Footer />
      </body>
    </html>
  );
}
