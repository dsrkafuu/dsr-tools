/**
 * https://nextjs.org/docs/advanced-features/custom-app
 */

import '../styles/index.scss';
import { useEffect } from 'react';
import Script from 'next/script';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import GlobalLayout from '../components/GlobalLayout';

import withDSRA from 'dsr-analytics';

function useDSRA() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    // dsra is a singleton instance
    const dsra = withDSRA('DEBUGXR8_Z', 'https://analytics.dsrkafuu.cn:8443/');
    // catch first page load
    dsra.sendView(router.asPath, document.title, document.referrer);
    // catch client side page change
    const handleRouteComplete = (url: string) => {
      dsra.sendView(url, document.title);
    };
    router.events.on('routeChangeComplete', handleRouteComplete);
    return () => {
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function MyApp({ Component, pageProps }: AppProps) {
  useDSRA();

  return (
    <>
      <Head>
        <meta charSet='UTF-8' />
        <meta content='IE=edge' httpEquiv='X-UA-Compatible' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='author' content='DSRKafuU' />
      </Head>
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
      <GlobalLayout>
        <Component {...pageProps} />
      </GlobalLayout>
    </>
  );
}

export default MyApp;
