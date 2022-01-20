/**
 * https://nextjs.org/docs/basic-features/typescript#type-checking-nextconfigjs
 */

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,

  // allowed optimization domains
  images: {
    domains: ['cdn.jsdelivr.net'],
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

export default nextConfig;
