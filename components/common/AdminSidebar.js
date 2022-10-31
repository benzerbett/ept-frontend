import Link from 'next/link'
import React from 'react'

function AdminSidebar({ router }) {
    return (
        <nav id="sidebarMenu" className="col-xs-12 col-md-3 col-lg-3 col-xl-2 d-md-block bg-violet-darkest text-light sidebar collapse" style={{ top: '1rem' }}>
            <div className="position-sticky pt-0 w-100 overflow-hidden mt-3">
                <ul className="list-unstyled ps-0">
                    <li className="mb-1 d-md-none d-flex align-items-start justify-content-end w-100 p-0">
                        <button className="navbar-toggler d-md-none collapsed text-right fs-3 p-0" style={{ marginRight: '2.1em' }} type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                            &times;
                        </button>
                    </li>
                    <li className="mb-1">
                        <Link href="/admin">
                            <a className={"btn btn-sm py-2 w-100 fs-6 d-flex btn-toggle align-items-center gap-2 rounded "+(router.asPath === '/admin' ? 'active' : '')}>
                                <i className='fa fa-dashboard text-muted' />
                                Overview
                            </a>
                        </Link>
                    </li>
                    <li className="mb-1">
                        <button className={"btn btn-sm py-2 w-100 fs-6 d-flex btn-toggle align-items-center gap-2 rounded " + (
                            router.asPath.includes('/admin/users') ? 'active' : 'collapsed'
                        )} data-bs-toggle="collapse" data-bs-target="#menu_users" aria-expanded={
                            router.asPath.includes('/admin/users') ? 'true' : 'false'
                        }>
                            <i className='fa fa-users text-muted' />
                            Users
                        </button>
                        <div className={"collapse " + (
                            router.asPath.includes('/admin/users') ? 'show' : ''
                        )} id="menu_users">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                                <li> <Link href="/admin/users"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/users' ? ' active' : '')}>All users</a></Link> </li>
                                <li> <Link href="/admin/users/new"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/users/new' ? ' active' : '')}>Add new user</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className={"btn btn-sm py-2 w-100 fs-6 d-flex btn-toggle align-items-center gap-2 rounded " + (
                            router.pathname.includes('/admin/programs') ? 'active' : 'collapsed'
                        )} data-bs-toggle="collapse" data-bs-target="#menu_pt_programs" aria-expanded={
                            router.pathname.includes('/admin/programs') ? 'true' : 'false'
                        }>
                            <i className='fa fa-folder text-muted' />
                            Programs
                        </button>
                        <div className={"collapse " + (
                            router.pathname.includes('/admin/programs') ? 'show' : ''
                        )} id="menu_pt_programs">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                                <li> <Link href="/admin/programs"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/programs' ? ' active' : '')} aria-current="page">All programs</a></Link> </li>
                                <li> <Link href="/admin/programs/new"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/programs/new' ? ' active' : '')} aria-current="page">Add new program</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className={"btn btn-sm py-2 w-100 fs-6 d-flex btn-toggle align-items-center gap-2 rounded " + (
                            router.pathname.includes('/admin/dictionary') ? 'active' : 'collapsed'
                        )} data-bs-toggle="collapse" data-bs-target="#menu_dict" aria-expanded={
                            router.pathname.includes('/admin/dictionary') ? 'true' : 'false'
                        }>
                            <i className='fa fa-file-text text-muted' />
                            Dictionary
                        </button>
                        <div className={"collapse " + (
                            router.pathname.includes('/admin/dictionary') ? 'show' : ''
                        )} id="menu_dict">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                                <li> <Link href="/admin/dictionary"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/dictionary' ? ' active' : '')} aria-current="page">Dictionary</a></Link> </li>
                                <li> <Link href="/admin/dictionary/new"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/dictionary/new' ? ' active' : '')} aria-current="page">Add new entry</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className={"btn btn-sm py-2 w-100 fs-6 d-flex btn-toggle align-items-center gap-2 rounded " + (
                            (router.pathname.includes('/admin/roles') || router.pathname.includes('/admin/permissions')) ? 'active' : 'collapsed'
                        )} data-bs-toggle="collapse" data-bs-target="#menu_access_mgt" aria-expanded={
                            (router.pathname.includes('/admin/roles') || router.pathname.includes('/admin/permissions')) ? 'true' : 'false'
                        }>
                            <i className='fa fa-lock text-muted' />
                            Access control
                        </button>
                        <div className={"collapse " + (
                            (router.pathname.includes('/admin/roles') || router.pathname.includes('/admin/permissions')) ? 'show' : ''
                        )} id="menu_access_mgt">
                            <ul className="btn-toggle-nav list-unstyled fw-normal pb-2 small">
                                <li> <Link href="/admin/permissions"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/permissions' ? ' active' : '')} aria-current="page">Permissions</a></Link> </li>
                                <li> <Link href="/admin/permissions/new"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/permissions/new' ? ' active' : '')} aria-current="page">Add new permission</a></Link> </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li> <Link href="/admin/roles"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/roles' ? ' active' : '')} aria-current="page">Roles</a></Link> </li>
                                <li> <Link href="/admin/roles/new"><a className={"dropdown-item py-1 fs-6 " + (router.pathname == '/admin/roles/new' ? ' active' : '')} aria-current="page">Add new role</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </nav >
    )
}

export default AdminSidebar