/**
 * https://nextjs.org/docs/advanced-features/custom-app
 */

import '../styles/index.scss';
import type { AppProps } from 'next/app';
import GlobalHead from '../components/GlobalHead';
import GlobalLayout from '../components/GlobalLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalHead />
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
