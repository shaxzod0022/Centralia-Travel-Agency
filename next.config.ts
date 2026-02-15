import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.centraliatours.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.centraliatours.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-406fc0c3aa28495eb3c2c56d34f5b576.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);