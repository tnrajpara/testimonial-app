/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.ibb.co"],
  },
  // env: {
  //   NEXT_PUBLIC_AUTH0_BASE_URL: process.env.VERCEL_URL
  //     ? `https://${process.env.VERCEL_URL}`
  //     : "http://localhost:3000",
  // },
};

export default nextConfig;
