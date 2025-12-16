// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false, // Disabled to prevent duplicate API calls during development
//   swcMinify: true,
//   images: {
//     domains: ['localhost'],
//   },
// }

// module.exports = nextConfig

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["localhost"],
  },
  webpack: (config) => {
    // Alias for absolute imports
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  experimental: {
    webpackBuildWorker: true, // Enables faster builds and fixes some alias issues
  },
};

module.exports = nextConfig;
