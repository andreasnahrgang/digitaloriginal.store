const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-elasticsearch": false,
      "tap": false,
      "why-is-node-running": false,
    };
    return config;
  },
};

export default nextConfig;
