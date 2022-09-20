import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { simulateLogout, simulateGetSession } from '../../utilities'

function AdminNavbar() {
    const router = useRouter()
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    React.useEffect(() => {
        const session = simulateGetSession()
        if (session) {
            setUser(session.user)
            setIsLoggedIn(true)
            setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
        }
    }, [])
    return (
        <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="/">EPT Administrator</a>
            <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className='w-100'>
                {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
            </div>
            <div className="navbar-nav">
                <div className="nav-item text-nowrap">
                    <button className="nav-link text-dark px-3" onClick={ev=>{simulateLogout(router)}}>Sign out</button>
                </div>
            </div>
        </header>
    )
}

export default AdminNavbar