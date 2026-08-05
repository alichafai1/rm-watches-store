import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/shipping", destination: "/shipping-policy", permanent: true },
      {
        source: "/returns",
        destination: "/refund-return-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
    ];
  },
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
