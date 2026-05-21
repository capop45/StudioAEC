import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/trilhas',
        destination: '/treinamentos',
        permanent: true,
      },
      {
        source: '/trilhas/:slug',
        destination: '/treinamentos/:slug',
        permanent: true,
      },
      {
        source: '/quem-sou',
        destination: '/quem-somos',
        permanent: true,
      },
      {
        source: '/portifolio',
        destination: '/portfolio',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
