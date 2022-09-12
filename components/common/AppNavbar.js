import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { simulateGetUser, simulateLogout, simulateGetSession } from '../../utilities'

function AppNavbar() {
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    const router = useRouter()
    React.useEffect(() => {
        const session = simulateGetSession()
        if (session) {
            setUser(session.user)
            setIsLoggedIn(true)
            setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
        }
    }, [])
    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
            <div className="container">
                <Link href={homeUrl}>
                    <a className="navbar-brand">EPT</a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbarToggler" aria-controls="appNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="appNavbarToggler">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-md-2">
                            <Link href={homeUrl}><a className={"nav-link " + (router.pathname === '/' ? ' active' : '')}>Home</a></Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle " + (router.pathname.includes('/admin/forms') ? ' active' : '')} href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Forms &amp; Surveys
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                <li>
                                    <Link href="/admin/forms"><a className={"dropdown-item " + (router.pathname == '/admin/forms' ? ' active' : '')} aria-current="page">
                                        Forms
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            2
                                            <span className="visually-hidden">new survey(s)</span>
                                        </span>
                                    </a></Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle " + (router.pathname.includes('/admin/evaluations') ? ' active' : '')} href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Evaluations (PT/QC)
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                <li>
                                    <Link href="/admin/forms"><a className={"dropdown-item " + (router.pathname == '/admin/forms' ? ' active' : '')} aria-current="page">
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
                            <Link href="/user/settings"><a className={"nav-link " + (router.pathname === '/user/settings' ? ' active' : '')}>Settings</a></Link>
                        </li>
                        <li className="nav-item mx-md-2">
                            <Link href="/user/settings/account"><a className={"nav-link " + (router.pathname === '/user/settings/account' ? ' active' : '')}>My account</a></Link>
                        </li>
                    </ul>
                    {(isLoggedIn && user) ? <div className="text-end d-flex">
                        <div className="d-flex flex-wrap align-items-center">
                            <Link href="/user/settings/account">
                                <a className="text-light me-2 text-decoration-none fs-6 fw-light">{user.name}</a>
                            </Link>
                            <button className="btn btn-sm btn-outline-light" onClick={simulateLogout}>Logout</button>
                        </div>
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