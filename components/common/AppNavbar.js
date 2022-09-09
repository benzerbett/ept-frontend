import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

function AppNavbar() {

    const router = useRouter()
    return (

        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
            <div className="container">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#appNavbarToggler" aria-controls="appNavbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="appNavbarToggler">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item mx-md-2">
                            <Link href="/"><a className={"nav-link " + (router.pathname === '/' ? ' active' : '')}>Home</a></Link>
                        </li>
                        <li className="nav-item mx-md-2 dropdown d-flex">
                            <div className="btn-group">
                                <Link href="/admin/users"><a className={"nav-link " + (router.pathname == '/admin/users' ? ' active' : '')} aria-current="page">Users</a></Link>
                                <button type="button" className="btn btn-xs btn-transparent text-white dropdown-toggle dropdown-toggle-split p-0 my-0 btn-outline-dark" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/admin/users"><a className={"dropdown-item " + (router.pathname == '/admin/users' ? ' active' : '')} aria-current="page">All users</a></Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link href="/admin/users/new"><a className={"dropdown-item " + (router.pathname == '/admin/users/new' ? ' active' : '')} aria-current="page">Add new user</a></Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item mx-md-2 dropdown d-flex">
                            <div className="btn-group">
                                <Link href="/admin/schemes"><a className={"nav-link " + (router.pathname == '/admin/schemes' ? ' active' : '')} aria-current="page">Schemes</a></Link>
                                <button type="button" className="btn btn-xs btn-transparent text-white dropdown-toggle dropdown-toggle-split p-0 my-0 btn-outline-dark" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/admin/schemes"><a className={"dropdown-item " + (router.pathname == '/admin/schemes' ? ' active' : '')} aria-current="page">All schemes</a></Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link href="/admin/schemes/new"><a className={"dropdown-item " + (router.pathname == '/admin/schemes/new' ? ' active' : '')} aria-current="page">Add new scheme</a></Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item mx-md-2 dropdown d-flex">
                            <div className="btn-group">
                                <Link href="/admin/dictionary"><a className={"nav-link " + (router.pathname == '/admin/dictionary' ? ' active' : '')} aria-current="page">Dictionary</a></Link>
                                <button type="button" className="btn btn-xs btn-transparent text-white dropdown-toggle dropdown-toggle-split p-0 my-0 btn-outline-dark" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/admin/dictionary"><a className={"dropdown-item " + (router.pathname == '/admin/dictionary' ? ' active' : '')} aria-current="page">Dictionary</a></Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link href="/admin/dictionary/new"><a className={"dropdown-item " + (router.pathname == '/admin/dictionary/new' ? ' active' : '')} aria-current="page">Add new entry</a></Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item mx-md-2 dropdown d-flex">
                            <div className="btn-group">
                                <a className={"nav-link " + ( router.pathname.includes('/permissions') || router.pathname.includes('/roles') ? ' active' : '' )} aria-current="page">Access control</a>
                                <button type="button" className="btn btn-xs btn-transparent text-white dropdown-toggle dropdown-toggle-split p-0 my-0 btn-outline-dark" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/admin/permissions"><a className={"dropdown-item " + (router.pathname == '/admin/permissions' ? ' active' : '')} aria-current="page">Permissions</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/permissions/new"><a className={"dropdown-item " + (router.pathname == '/admin/permissions/new' ? ' active' : '')} aria-current="page">Add new permission</a></Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link href="/admin/roles"><a className={"dropdown-item " + (router.pathname == '/admin/roles' ? ' active' : '')} aria-current="page">Roles</a></Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/roles/new"><a className={"dropdown-item " + (router.pathname == '/admin/roles/new' ? ' active' : '')} aria-current="page">Add new role</a></Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item mx-md-2 dropdown d-flex">
                            <div className="btn-group">
                                <Link href="/admin/forms"><a className={"nav-link " + (router.pathname == '/admin/forms' ? ' active' : '')} aria-current="page">Forms</a></Link>
                                <button type="button" className="btn btn-xs btn-transparent text-white dropdown-toggle dropdown-toggle-split p-0 my-0 btn-outline-dark" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropdown</span>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link href="/admin/forms"><a className={"dropdown-item " + (router.pathname == '/admin/forms' ? ' active' : '')} aria-current="page">Forms</a></Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link href="/admin/forms/new"><a className={"dropdown-item " + (router.pathname == '/admin/forms/new' ? ' active' : '')} aria-current="page">Add new form</a></Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <div className="text-end">
                        <Link href="/auth/login"><a className="btn btn-outline-light me-2">Login</a></Link>
                        <Link href="/auth/signup"><a className="btn btn-primary">Sign-up</a></Link>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default AppNavbar