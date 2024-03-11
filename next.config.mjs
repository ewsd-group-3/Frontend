/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
  }
}

export default nextConfig
