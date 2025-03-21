import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cunex-portfolio.s3.ap-southeast-2.amazonaws.com',
      'via.placeholder.com',
      'cdn-icons-png.flaticon.com'
    ],
  },
  /* other config options here */
};

export default nextConfig;
