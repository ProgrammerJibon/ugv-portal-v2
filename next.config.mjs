/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    experimental: {
        serverActions: {
            // Increase to 500mb or whatever max size you need
            bodySizeLimit: '500mb',
        },
    },
};

export default nextConfig;
