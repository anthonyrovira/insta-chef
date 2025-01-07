import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.spoonacular.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", port: "", pathname: "/**" },
    ],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/node-fetch\/lib\/index\.js/ },
      { module: /node_modules\/punycode\/punycode\.js/ },
    ];
    return config;
  },
};

export default nextConfig;
