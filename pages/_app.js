import 'bootstrap/dist/css/bootstrap.css'

import PublicTheme from '../components/layouts/PublicTheme'
import AppTheme from '../components/layouts/AppTheme'
import { useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'


function MyApp({ Component, pageProps }) {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const Layout = isLoggedIn ? AppTheme : PublicTheme
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Script src="/js/bootstrap.bundle.min.js"/>

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp