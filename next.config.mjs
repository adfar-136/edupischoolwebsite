/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["mongodb"],
  experimental: {
    turbo: {
      resolveExtensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "kysely": false,
      "@better-auth/kysely-adapter": false,
    };
    return config;
  },
};

export default nextConfig;
