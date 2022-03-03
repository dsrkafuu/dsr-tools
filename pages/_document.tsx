/**
 * https://nextjs.org/docs/advanced-features/custom-document
 */

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='preconnect' href='https://cdn.jsdelivr.net' />
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            rel='preconnect'
            href='https://fonts.gstatic.com'
            crossOrigin=''
          />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500&family=Noto+Sans+SC:wght@400;500&family=Noto+Sans+JP:wght@400;500&family=Fira+Code:wght@400;500'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@3.0.0/favicon/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@3.0.0/favicon/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@3.0.0/favicon/favicon-16x16.png'
          />
          <link
            rel='shortcut icon'
            href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@3.0.0/favicon/favicon.ico'
          />
          <link rel='manifest' href='/site.webmanifest' />
        </Head>
        <body>
          <div
            id='message'
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          ></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
