/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com", "source.unsplash.com"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
