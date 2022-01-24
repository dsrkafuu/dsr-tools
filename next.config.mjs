/**
 * https://nextjs.org/docs/basic-features/typescript#type-checking-nextconfigjs
 * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#extend-nextjs-configuration
 */

import { withSentryConfig } from '@sentry/nextjs';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  // migration
  async redirects() {
    return [
      {
        source: '/game/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/about/info',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about/changelog',
        destination: '/changelog',
        permanent: true,
      },
    ];
  },

  // allowed optimization domains
  images: {
    domains: ['cdn.jsdelivr.net', 'lain.bgm.tv'],
  },

  // add global variables
  sassOptions: {
    additionalData: `@import './styles/variables.scss';`,
  },

  // no optimizations which causes render issue
  // https://github.com/vercel/next.js/issues/24640
  optimizeFonts: false,

  webpack(config) {
    // inline svg
    config.module.rules.push({
      test: /\.svg$/,
      loader: '@svgr/webpack',
      options: {
        typescript: true,
        svgProps: {
          className: 'svgr',
        },
      },
    });
    return config;
  },
};

export default withSentryConfig(nextConfig, { silent: true });
