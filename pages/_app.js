import 'bootstrap/dist/css/bootstrap.css'
import '../styles/custom.css'

import PublicTheme from '../components/layouts/PublicTheme'
import AppTheme from '../components/layouts/AppTheme'
import AdminTheme from '../components/layouts/AdminTheme'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'


function MyApp({ Component, pageProps }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    useEffect(() => {
        //     import("bootstrap/dist/js/bootstrap.bundle.min");
        if(window && window.sessionStorage) {
            const user = window.sessionStorage.getItem('user')
            if(user) {
                setUser(JSON.parse(user))
            }
            const isLoggedIn = window.sessionStorage.getItem('isLoggedIn')
            if(isLoggedIn) {
                setIsLoggedIn(isLoggedIn)
            }
        }
    }, [])
    console.log('isLoggedIn', isLoggedIn)
    console.log('user', user)
    const Layout = isLoggedIn ? ((user && user?.type == "admin") ? AdminTheme : AppTheme) : PublicTheme
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Script src="/js/bootstrap.bundle.min.js" />

            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp