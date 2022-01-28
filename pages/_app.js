import '../styles/globals.css'
import '../styles/bootstrap.min.css'
import '../styles/styles.css'
import '../styles/line-icons.css'
import '../styles/flaticon.css'
import Script from 'next/script'
import Head from 'next/head'
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return <> 
  <Head>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/all.css" />
  </Head>
  <Component {...pageProps} />
  <Script
        id="jquery-js"
        src="https://code.jquery.com/jquery-3.6.0.min.js"
        strategy="beforeInteractive"
      />
      <Script
        id="popper-js"
        src="/js/popper.min.js"
        strategy="beforeInteractive"
      />
  <Script
        id="bootstrap-js"
        src="/js/bootstrap.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('bootstrap')
        }}
      />
  
  </>
}

export default MyApp
