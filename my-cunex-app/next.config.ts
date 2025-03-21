import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'cunex-portfolio.s3.ap-southeast-2.amazonaws.com',
      'via.placeholder.com',
      'cdn-icons-png.flaticon.com'
    ],
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      // Disable linting during production build
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          emitError: false,
        },
        enforce: 'pre',
      });
    }
    return config;
  },
  /* other config options here */
};

export default nextConfig;
