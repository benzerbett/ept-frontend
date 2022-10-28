import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { doGetSession, doLogout } from '../../utilities'

function AdminNavbar() {
    const router = useRouter()
    const [user, setUser] = React.useState(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const [homeUrl, setHomeUrl] = React.useState('/')
    React.useEffect(() => {
        doGetSession().then(session => {
            if (session) {
                setUser(session.user)
                setIsLoggedIn(true)
                setHomeUrl(session.user.type === 'admin' ? '/admin' : '/user')
            }
        })
    }, [])
    return (
        <header className="navbar navbar-dark sticky-top bg-darkz bg-purple flex-md-nowrap p-0 shadow">
            <div className='w-100 d-flex align-items-center justify-content-between'>
                <a className="navbar-brand col-md-3 col-lg-2 me-0 py-3 px-3 bg-transparent border-none" href="/">EPT Administrator</a>
                <div className="px-3">
                    <ul className="navbar-nav me-auto mb-lg-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="adminAccDropDwn" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {/* <span>{user ? user.name : 'Account'}</span> */}
                                <span className='ml-1'>
                                    <i className='fa fa-user'></i> <span className='d-none d-md-inline-flex'>Account</span>
                                </span>
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="adminAccDropDwn" style={{position: 'absolute', right: 2, left: 'auto', marginTop: 5}}>
                                <li><Link href="/admin/settings/account"><a className="dropdown-item">Profile</a></Link></li>
                                <li><Link href="/admin/settings"><a className="dropdown-item">Settings</a></Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item" onClick={ev => { doLogout(router) }}>Sign out</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <button className="navbar-toggler position-absolute d-md-none collapsed" style={{marginRight: '2.1em', marginTop: '0.5rem'}} type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        </header>
    )
}

export default AdminNavbar