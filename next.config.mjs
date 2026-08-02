/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingExcludes: {
      "**/temp-ui-package/**": ["**/*"],
    },
  },
};

export default nextConfig;
