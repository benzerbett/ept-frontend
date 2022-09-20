import 'bootstrap/dist/css/bootstrap.css'
import '../styles/custom.css'

import PublicTheme from '../components/layouts/PublicTheme'
import AppTheme from '../components/layouts/AppTheme'
import AdminTheme from '../components/layouts/AdminTheme'
import { useState, useEffect, createContext } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { simulateGetSession } from '../utilities'


function MyApp({ Component, pageProps }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    // auth context
    const AuthContext = createContext({
        isLoggedIn: false,
        user: null,
        session: null,
        setIsLoggedIn: (isLoggedIn) => setIsLoggedIn(isLoggedIn),
        setUser: (user) => setUser(user),
        setSession: (session) => setSession(session),
    })

    useEffect(() => {
        let mtd = true
        if (mtd) {
            // import("bootstrap/dist/js/bootstrap.bundle.min");
            const session = simulateGetSession();
            if (session) {
                setIsLoggedIn(session.isLoggedIn)
                setUser(session.user)
                setSession(session)
                pageProps.session = session
            }
            setLoading(false)
        }
        return () => {
            mtd = false
        }
    }, [])

    const Layout = isLoggedIn ? ((user && user?.type == "admin") ? AdminTheme : AppTheme) : PublicTheme

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Script src="/js/bootstrap.bundle.min.js" />

            <Layout session={session}>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp