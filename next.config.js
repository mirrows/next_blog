/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  "plugins": ["babel-plugin-styled-components"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'empty.t-n.top',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cn.bing.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'p.t-n.top',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
}

module.exports = nextConfig
