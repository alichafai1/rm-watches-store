import type { NextConfig } from "next";
import path from "node:path";

/** Slim polyfill: drop legacy APIs already native in modern browsers. */
const modernPolyfill = path.join(__dirname, "src/lib/modern-polyfill.js");

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
      { source: "/shop/men", destination: "/shop", permanent: true },
      { source: "/shop/women", destination: "/shop", permanent: true },
    ];
  },
  images: {
    // Local DNS/VPN tools (e.g. Clash fake-ip) can map supabase.co to
    // 198.18.x.x. Next.js blocks those as private IPs unless allowed.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    // Mostly unused for Supabase media (StorefrontImage sets `unoptimized`).
    // Kept for any remaining local next/image optimization paths.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        hostname: "jolmyqqzsqvyapoixnqh.supabase.co",
        pathname: "/storage/v1/object/public/website-media/**",
        protocol: "https",
      },
      // Supabase Image Transformations (used with `unoptimized` StorefrontImage).
      {
        hostname: "jolmyqqzsqvyapoixnqh.supabase.co",
        pathname: "/storage/v1/render/image/public/website-media/**",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: true,
  // Inline critical CSS to cut render-blocking stylesheet delay (helps LCP
  // element render delay for above-the-fold text).
  experimental: {
    inlineCss: true,
  },
  // Next.js always imports polyfill-module into the client bundle; browserslist
  // alone does not strip it. Alias to a modern-only stub for Turbopack builds.
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./src/lib/modern-polyfill.js",
    },
  },
  // Same alias for webpack (e.g. `next build --webpack`).
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../build/polyfills/polyfill-module": modernPolyfill,
      "next/dist/build/polyfills/polyfill-module": modernPolyfill,
    };
    return config;
  },
};

export default nextConfig;
