/**
 * https://nextjs.org/docs/advanced-features/custom-app
 */

import '../styles/index.scss';
import Script from 'next/script';
import type { AppProps } from 'next/app';
import GlobalHead from '../components/GlobalHead';
import GlobalLayout from '../components/GlobalLayout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
      <GlobalHead />
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
