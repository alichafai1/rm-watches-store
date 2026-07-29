import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local DNS/VPN tools (e.g. Clash fake-ip) can map supabase.co to
    // 198.18.x.x. Next.js blocks those as private IPs unless allowed.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        hostname: "jolmyqqzsqvyapoixnqh.supabase.co",
        pathname: "/storage/v1/object/public/website-media/**",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
