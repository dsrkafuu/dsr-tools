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
      {/* Google Analytics */}
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
      {/* Crisp Chat */}
      <Script strategy='afterInteractive'>
        {`window.$crisp=[];window.CRISP_WEBSITE_ID="d3750a6b-c763-4252-8ec7-bce6050774f6";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
      </Script>
      <GlobalHead />
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
