/**
 * https://nextjs.org/docs/advanced-features/custom-document
 */

import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='preconnect' href='https://cdn.dsrkafuu.net' />
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
            rel='icon'
            sizes='any'
            href='https://cdn.dsrkafuu.net/favicon/favicon.ico'
          />
          <link
            rel='icon'
            sizes='48x48'
            href='https://cdn.dsrkafuu.net/favicon/favicon-48x48.png'
          />
          <link
            rel='icon'
            sizes='96x96'
            href='https://cdn.dsrkafuu.net/favicon/favicon-96x96.png'
          />
          <link
            rel='icon'
            sizes='144x144'
            href='https://cdn.dsrkafuu.net/favicon/favicon-144x144.png'
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='https://cdn.dsrkafuu.net/favicon/apple-touch-icon.png'
          />
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
