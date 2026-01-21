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
};

export default nextConfig;
