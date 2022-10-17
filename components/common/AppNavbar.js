import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { simulateGetUser, doLogout, doGetSession, getPrograms, getProgramConfig, getActiveSession } from '../../utilities'

function AppNavbar() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const [allPrograms, setAllPrograms] = React.useState([])
    const [activeProgram, setActiveProgram] = React.useState(null)
    const router = useRouter()

    const getProgConf = (id, isItInit) => {
        console.log('getProgConf', id, isItInit)
        if(id) getActiveSession(id)
            .then((activeP) => {
                if (activeP) {
                    console.log('activeP', activeP)
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
    const fetchPrograms = () => {
        return getPrograms()
            .then((data) => {
                if (data.length > 0) {
                    setAllPrograms(data)
                }
            })
    }

    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            doGetSession().then(session=>{
                if (session) {
                    setUser(session.user)
                    setIsLoggedIn(true)
                    setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
                    if (session.activeProgramCode) {
                        getProgConf(session.activeProgramCode, true)
                    } else {
                        if (router.pathname !== '/user' && router.pathname !== '/user/settings/account') {
                            router.push('/user', undefined, { unstable_skipClientCache: true })
                        }
                    }
                } else {
                    router.push('/auth/login', undefined, { unstable_skipClientCache: true })
                }
            })
            fetchPrograms()
        }
        return () => {
            mtd = false
        }
    }, [])
    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-purple">
            <div className="container">
                {/* <Link href={homeUrl}>
                    <a className="navbar-brand">{activeProgram}</a>
                </Link> */}
                {allPrograms ? (allPrograms.length > 0 ? <div className="btn-group fw-bold">
                    <button className="btn bg-purple-light btn-sm text-white btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {allPrograms.find(ap => ap.uuid == activeProgram)?.name || "Select a Program"}
                    </button>
                    <ul className="dropdown-menu">
                        {allPrograms.map((ap, x) => <li key={ap.uuid}><a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={(ev) => {
                            ev.preventDefault()
                            getProgConf(ap.uuid, false)
                        }}>{ap.name}</a></li>)}
                    </ul>
                </div> : <h6 className="text-white mb-0">EPT | Guest</h6>) : <h6 className="text-white mb-0">EPT | Loading...</h6>}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbarToggler" aria-controls="appNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="appNavbarToggler">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-md-2">
                            <Link href={homeUrl}><a className={"nav-link " + (router.pathname === '/' ? ' active' : '')}>Home</a></Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle " + (router.pathname.includes('/user/surveys') ? ' active' : '')} href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Surveys
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                <li>
                                    <Link href="/user/surveys"><a className={"dropdown-item " + (router.pathname == '/user/surveys' ? ' active' : '')} aria-current="page">
                                        Surveys
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            2
                                            <span className="visually-hidden">new survey(s)</span>
                                        </span>
                                    </a></Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle " + (router.pathname.includes('/user/evaluations') ? ' active' : '')} href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Evaluations
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                <li>
                                    <Link href="/user/evaluations"><a className={"dropdown-item " + (router.pathname == '/user/evaluations' ? ' active' : '')} aria-current="page">
                                        Evaluations
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            1
                                            <span className="visually-hidden">new evaluation(s)</span>
                                        </span>
                                    </a></Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item mx-md-2">
                            <Link href="/user/reports"><a className={"nav-link " + (router.pathname === '/user/reports' ? ' active' : '')}>Reports</a></Link>
                        </li>
                        <li className="nav-item mx-md-2">
                            <Link href="/"><a className={"nav-link " + (router.pathname === '/user/settings' ? ' active' : '')}>Help Desk</a></Link>
                        </li>
                    </ul>
                    {(isLoggedIn && user) && <div className="btn-group">
                        <button className="btn bg-purple-dark text-white btn-sm dropdown-toggle outline-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {user.name}
                        </button>
                        <ul className="dropdown-menu text-center">
                            <li>
                                <Link href="/user/settings/account">
                                    <a className="nav-link w-100">My Account</a>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <Link href="/user/settings">
                                    <a className="nav-link w-100">Settings</a>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className='d-flex justify-content-center'>
                                <button className="btn btn-link nav-link text-center w-100" onClick={ev => { doLogout(router) }}>Logout</button>
                            </li>
                        </ul>
                    </div>}
                </div>
            </div>
        </nav>

    )
}

export default AppNavbar