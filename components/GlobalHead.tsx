import Head from 'next/head';

/**
 * 全局的 head 内容
 */
function GlobalHead() {
  return (
    <Head>
      <meta charSet='UTF-8' />
      <meta content='IE=edge' httpEquiv='X-UA-Compatible' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='author' content='DSRKafuU' />

      <link rel='preconnect' href='https://cdn.jsdelivr.net' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      {/* prettier-ignore */}
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
      {/* prettier-ignore */}
      <link rel='stylesheet' href='https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@400;500&family=Noto+Sans+SC:wght@400;500&family=Noto+Sans+JP:wght@400;500&family=Fira+Code:wght@400;500' />

      {/* prettier-ignore */}
      <link rel='apple-touch-icon' sizes='180x180' href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@1.0.0/favicon/apple-touch-icon.png' />
      {/* prettier-ignore */}
      <link rel='icon' type='image/png' sizes='32x32' href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@1.0.0/favicon/favicon-32x32.png' />
      {/* prettier-ignore */}
      <link rel='icon'  type='image/png' sizes='16x16' href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@1.0.0/favicon/favicon-16x16.png' />
      {/* prettier-ignore */}
      <link rel='shortcut icon' href='https://cdn.jsdelivr.net/gh/dsrkafuu/dsr-assets@1.0.0/favicon/favicon.ico' />
      <link rel='manifest' href='/site.webmanifest' />
    </Head>
  );
}

export default GlobalHead;
