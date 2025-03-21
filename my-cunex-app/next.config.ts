import type { NextConfig } from "next";
import ESLintPlugin from "eslint-webpack-plugin";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cunex-portfolio.s3.ap-southeast-2.amazonaws.com',
      'via.placeholder.com',
      'cdn-icons-png.flaticon.com'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    config.plugins.push(new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }));
    return config;
  },
  /* other config options here */
};

export default nextConfig;
