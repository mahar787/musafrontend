/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // ✅ Increase to 10MB (adjust as needed)
    },
  },
  images: {
    domains: ["res.cloudinary.com"], // ✅ Cloudinary images allow karna
  },
};

export default nextConfig;
