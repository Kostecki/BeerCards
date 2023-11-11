/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.untappd.com",
      },
    ],
  },
};

module.exports = nextConfig;
