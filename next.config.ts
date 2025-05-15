import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 env: {
   NEXT_USE_PROD: process.env.NEXT_USE_PROD || "false"
 }
};

export default nextConfig;


