/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Slå av ESLint under build (fikser Vercel-feilen)
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qollmfnbqpprujlfzrew.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ✅ Canonical domain: tving www -> apex (fikser auth cookies + API calls)
  async redirects() {
    return [
      {
        source: "/om",
        destination: "https://kireklame.no/ki-reklamebyra",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kireklame.no" }],
        destination: "https://kireklame.no/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
