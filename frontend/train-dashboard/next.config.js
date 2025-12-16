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
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

module.exports = nextConfig;
