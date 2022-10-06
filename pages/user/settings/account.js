import Head from 'next/head'
import React from 'react'
import { doGetSession } from '../../../utilities'

function AccountSettings() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const [allPrograms, setAllPrograms] = React.useState([])

    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            doGetSession().then(session => {
                if (session) {
                    setUser(session.user)
                    setIsLoggedIn(true)
                    setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
                } else {
                    router.push('/auth/login', undefined, { unstable_skipClientCache: true })
                }
            })
        }
        return () => {
            mtd = false
        }
    }, [])

    return (
        <>
            <Head>
                <title>EPT | Account Settings</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <h3>Account Settings</h3>
                <pre>
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </>
    )
}

export default AccountSettings