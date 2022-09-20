import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { simulateGetUser, simulateLogout, simulateGetSession } from '../../utilities'

function AppNavbar() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const [allPrograms, setAllPrograms] = React.useState([])
    const [activeProgram, setActiveProgram] = React.useState(null)
    const router = useRouter()

    const getProgramConfig = (id) => {
        fetch(`/api/configurations/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.code) {
                    setActiveProgram(data?.code)
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('activeProgramCode', data?.code)
                    }
                    // window.location.href = '/user/surveys'
                    router.push('/user/surveys', undefined, { unstable_skipClientCache: true })
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
            const session = simulateGetSession()
            if (session) {
                setUser(session.user)
                setIsLoggedIn(true)
                setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
                if (session.activeProgramCode) {
                    getProgramConfig(session.activeProgramCode)
                } else {
                    if (router.pathname !== '/user') {
                        router.push('/user', undefined, { unstable_skipClientCache: true })
                    }
                }
            } else {
                router.push('/auth/login', undefined, { unstable_skipClientCache: true })
            }
            getPrograms()
        }
        return () => {
            mtd = false
        }
    }, [])
    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-purple">
            <div className="container">
                {/* <Link href={homeUrl}>
                    <a className="navbar-brand">Oncology EPT</a>
                </Link> */}
                {allPrograms && allPrograms.length > 0 ? <div className="btn-group fw-bold">
                    <button className="btn bg-purple-light btn-sm text-white btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {allPrograms.find(ap => ap.code == activeProgram)?.name || "Select a Program"}
                    </button>
                    <ul className="dropdown-menu">
                        {allPrograms.map((ap, x) => <li key={ap.code}><a className="dropdown-item" onClick={(ev) => {
                            ev.preventDefault()
                            getProgramConfig(ap.code)
                        }}>{ap.name}</a></li>)}
                    </ul>
                </div> : <h6 className="text-white mb-0">EPT | Loading...</h6>}
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
                    {(isLoggedIn && user) ? <div className="btn-group">
                        <button className="btn bg-purple-dark text-white btn-sm dropdown-toggle outline-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {user.name}
                        </button>
                        <ul className="dropdown-menu text-center">
                            <li>
                                <Link href="/user/settings/account">
                                    <a className="nav-link">My Account</a>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <Link href="/user/settings">
                                    <a className="nav-link">Settings</a>
                                </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li className='d-flex justify-content-center'>
                                <button className="btn btn-link nav-link text-center" onClick={ev => { simulateLogout(router) }}>Logout</button>
                            </li>
                        </ul>
                    </div> : <div className="text-end d-flex">
                        <Link href="/auth/login"><a style={{ whiteSpace: 'nowrap' }} className="btn btn-outline-light me-2">Login</a></Link>
                        <Link href="/auth/signup"><a style={{ whiteSpace: 'nowrap' }} className="btn btn-light">Sign-up</a></Link>
                    </div>}
                </div>
            </div>
        </nav>

    )
}

export default AppNavbar