import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { doGetSession } from '../../utilities'

function PublicNavbar() {
    const router = useRouter()
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn,] = React.useState(false)
    // React.useEffect(() => {
    //     doGetSession().then((session) => {
    //         if (session) {
    //             setUser(session.user)
    //             setIsLoggedIn(true)
    //         }
    //     })
    // }, [])

    React.useEffect(() => {
        let mtd = true
        if (mtd) {
            // TODO: move all these session stuff to a context or to _app.js
            // doGetSession().then(session => {
            //     if (session) {
            //         setUser(session.user)
            //         setIsLoggedIn(true)
            //         if (session.user.type === 'admin') {
            //             router.push('/admin', undefined, { unstable_skipClientCache: true })
            //         } else if (session.user.type === 'user') {
            //             router.push('/user', undefined, { unstable_skipClientCache: true })
            //         }
            //     } else {
            //         if (!router.pathname.includes('/auth')) {
            //             router.push('/auth/login', undefined, { unstable_skipClientCache: true })
            //         }
            //     }
            // })
        }
        return () => {
            mtd = false
        }
    }, [])
    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-light">
            <div className="container">
                <Link href="/">
                    <a className="navbar-brand">EPT</a>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbarToggler" aria-controls="appNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="appNavbarToggler">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-md-2">
                            <Link href="/"><a className={"nav-link " + (router.pathname === '/' ? ' active' : '')}>Home</a></Link>
                        </li>
                    </ul>
                    {(isLoggedIn && user) ? <div className="text-end d-flex">
                        <div className="d-flex flex-wrap align-items-center">
                            <small className="text-light me-2">{user.name}</small>
                            <button className="btn btn-sm btn-outline-light" onClick={ev => { doLogout(router) }}>Logout</button>
                        </div>
                    </div> : <div className="text-end d-flex">
                        <Link href="/auth/login"><a style={{ whiteSpace: 'nowrap' }} className="btn btn-outline-primary px-4 me-2">Login</a></Link>
                        <Link href="/auth/signup"><a style={{ whiteSpace: 'nowrap' }} className="btn btn-primary px-4">Sign-up</a></Link>
                    </div>}
                </div>
            </div>
        </nav>
    )
}

export default PublicNavbar