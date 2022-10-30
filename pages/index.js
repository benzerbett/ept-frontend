import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { doGetSession } from '../utilities';

function Index() {
    const router = useRouter()
    const [session, setSession] = React.useState(null)
    
    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            doGetSession().then((sess) => {
                // console.log(session)
                setSession(sess)
                if (sess && sess.isLoggedIn) {
                    if (sess.user.type === 'admin') {
                        router.push('/admin/', undefined, { unstable_skipClientCache: true })
                    } else if (sess.user.type === 'user') {
                        router.push('/user/', undefined, { unstable_skipClientCache: true })
                    }
                } else {
                    router.push('/auth/login', undefined, { unstable_skipClientCache: true })
                }
            })
        }
        return () => {
            mtd = false
        }
    }, [session])

    return (<>

        <Head>
            <title>EPT | Loading...</title>
            <meta name="description" content="EPT" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h5 className='mb-0'>Loading...</h5>
        </main>
    </>
    )
}

export default Index