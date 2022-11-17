import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import { simulateGetUser, doLogout, doGetSession, getPrograms, getProgramConfig, getActiveSession } from '../../utilities'

function User() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const [allPrograms, setAllPrograms] = React.useState([])
    const [activeProgram, setActiveProgram] = React.useState(null)
    const [activeProgramCode, setActiveProgramCode] = React.useState(null)
    const router = useRouter()

    const getProgConf = (id, isItInit) => {
        setLoading(true)
        if (id) getActiveSession(id)
            .then((activeP) => {
                if (activeP) {
                    setActiveProgramCode(activeP)
                    getProgramConfig(activeP).then((data) => {
                        setActiveProgram(data?.data)
                    })
                    if (!isItInit) {
                        console.log('not initial poll. redirect accordingly')
                        // router.reload()
                        // if (router.pathname !== '/user') {
                        //     router.push('/user/surveys')
                        // }
                    }
                }
                setLoading(false)
            })
    }

    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            setLoading(true)
            doGetSession().then((session) => {
                if (session) {
                    setUser(session.user)
                    setIsLoggedIn(true)
                    setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
                    if (session.activeProgramCode) {
                        getProgConf(session.activeProgramCode, true)
                        // // check if an active program is set in session storage
                        // if (router.pathname !== '/user') {
                        //     router.push('/user/surveys', undefined, { unstable_skipClientCache: true })
                        // }
                    }
                    setLoading(false)
                } else {
                    console.log('no session')
                    router.push('/auth/login', undefined, { unstable_skipClientCache: true })
                    setLoading(false)
                }
            })
            getPrograms().then((data) => {
                if (data.length > 0) {
                    setAllPrograms(data)
                    if (data.length === 1) {
                        getProgConf(data[0]?.uuid)
                    }
                }
                setLoading(false)
            })
        }
        return () => {
            mtd = false
        }
    }, [])


    if (loading) return <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </div>

    return (
        <>
            <Head>
                <title>EPT | User</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container my-5">
                <div className="row justify-content-md-center">
                    {(activeProgramCode && (activeProgram && activeProgram.rounds)) ? <div className='col-md-12'>
                        <h2>{activeProgram.name} Rounds</h2>
                        {/* list active rounds */}
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Round</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Period (Start - End)</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeProgram.rounds.map((r, i) => {
                                    return <tr key={i}>
                                        <th scope="row">{r.name}</th>
                                        <td>{r.description}</td>
                                        <td className='text-capitalize'>{(r.active == true || r.active == 1) ? <span className='badge bg-success'>Active</span> : (r?.status || "-")}</td>
                                        <td>{new Date(r.start_date).toDateString()} - {new Date(r.end_date).toDateString()}</td>
                                        <td>
                                            <button className="btn btn-default btn-dark btn-sm" onClick={() => {
                                                router.push('/user/surveys', undefined, { unstable_skipClientCache: true })
                                            }}>Take Survey</button> &nbsp;
                                            <button className="btn btn-default btn-dark btn-sm" onClick={() => {
                                                router.push('/user/evaluations', undefined, { unstable_skipClientCache: true })
                                            }}>Enter results</button>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div> : <form className="col-sm-8 border border-primary p-5">
                        <h3 className='text-center'>Please pick a program</h3>
                        <hr />
                        <div className='row text-center'>
                            <div className='col-md-12 mt-3'>
                                {allPrograms ? (allPrograms.length > 0 ? <div className="btn-group fw-bold">
                                    <button className="btn btn-primary bg-purple-light btn-block text-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {allPrograms.find(ap => ap.uuid == activeProgramCode)?.name || "Select a Program"}
                                    </button>
                                    <ul className="dropdown-menu">
                                        {allPrograms.map((ap, x) => <li key={ap.uuid}><a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={(ev) => {
                                            ev.preventDefault()
                                            getProgConf(ap.uuid, false)
                                        }}>{ap.name}</a></li>)}
                                    </ul>
                                </div> : <div><small className="alert alert-warning py-2 fs-6 mb-0">No programs found</small></div>) : <h6 className="mb-0">Loading programs...</h6>}
                            </div>
                        </div>
                    </form>}
                </div>
            </div>
        </>
    )
}

export default User