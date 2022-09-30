import 'bootstrap/dist/css/bootstrap.css'
import '../styles/custom.css'

import PublicTheme from '../components/layouts/PublicTheme'
import AppTheme from '../components/layouts/AppTheme'
import AdminTheme from '../components/layouts/AdminTheme'
import React, { useState, useEffect, createContext } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { doGetSession } from '../utilities'


function MyApp({ Component, pageProps }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userType, setUserType] = useState(null)

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
            doGetSession().then((session) => {
                if (session && (session.isLoggedIn === true || session.isLoggedIn === 'true')) {
                    setUserType(session?.user?.type)
                    // if(session.user?.type == 'admin' || session.user?.type == 'super_admin' || session.user?.type == 'superadmin'){
                    //     Layout = AdminTheme
                    // }else{
                    //     Layout = AppTheme
                    // }
                    setIsLoggedIn((session.isLoggedIn === true || session.isLoggedIn === "true"))
                    setUser(session.user)
                    setSession(session)
                    pageProps.session = session
                } else {
                    // Layout = PublicTheme
                    if (typeof window != 'undefined' && window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/signup') {
                        window.location.href = '/auth/login'
                    }
                }
            }).then(() => {
                // Layout = isLoggedIn ? ((user && user?.type == "admin") ? AdminTheme : AppTheme) : PublicTheme
                setLoading(false)
            })
        }
        return () => {
            mtd = false
        }
    }, [])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Script src="/js/bootstrap.bundle.min.js" />

            {loading ? <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h5 className='mb-0'>Loading...</h5>
            </div> : (isLoggedIn && isLoggedIn === true ? (
                userType === 'admin' ? <AdminTheme><Component {...pageProps} /></AdminTheme> : <AppTheme><Component {...pageProps} /></AppTheme>
            ) : (<PublicTheme children={<Component {...pageProps} />} />))}
        </>
    )
}

export default MyApp