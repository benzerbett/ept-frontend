import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import { simulateGetUser, doLogout, doGetSession, simulateActiveSession } from '../../utilities'

function User() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const [allPrograms, setAllPrograms] = React.useState([])
    const [activeProgram, setActiveProgram] = React.useState(null)
    const router = useRouter()

    const getProgramConfig = (id, isItInit) => {
        simulateActiveSession(id)
            .then((activeP) => {
                if (activeP) {
                    setActiveProgram(activeP)
                    if (!isItInit) {
                        router.reload()
                        if (router.pathname !== '/user') {
                            router.push('/user/surveys')
                        }
                    }
                }
            })
    }

    const getPrograms = () => {
        return fetch(`/api/configurations`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    setAllPrograms(data)
                    if (data.length === 1) {
                        getProgramConfig(data[0]?.code)
                    }
                }
            })
    }
    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            doGetSession().then((session) => {
                if (session) {
                    setUser(session.user)
                    setIsLoggedIn(true)
                    setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
                    if (session.activeProgramCode) {
                        getProgramConfig(session.activeProgramCode, true)
                    }
                    // check if an active program is set in session storage
                    // if (session.activeProgramCode) {
                    //     if (router.pathname !== '/user') {
                    //         router.push('/user/surveys', undefined, { unstable_skipClientCache: true })
                    //     }
                    // }
                }
            })
            getPrograms()
        }
        return () => {
            mtd = false
        }
    }, [])

    return (
        <>
            <Head>
                <title>EPT | User</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container my-5">
                <div className="row justify-content-md-center">
                    <form className="col-sm-8 border border-primary p-5">
                        <h3 className='text-center'>Please pick a program</h3>
                        <hr />
                        <div className='row text-center'>
                            <div className='col-md-12 mt-3'>
                                {allPrograms && allPrograms.length > 0 ? <div className="btn-group fw-bold">
                                    <button className="btn btn-primary bg-purple-light btn-block text-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {allPrograms.find(ap => ap.code == activeProgram)?.name || "Select a Program"}
                                    </button>
                                    <ul className="dropdown-menu">
                                        {allPrograms.map((ap, x) => <li key={ap.code}><a className="dropdown-item" onClick={(ev) => {
                                            ev.preventDefault()
                                            getProgramConfig(ap.code, false)
                                        }}>{ap.name}</a></li>)}
                                    </ul>
                                </div> : <h6 className="text-white mb-0">Loading programs...</h6>}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default User