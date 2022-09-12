import Link from 'next/link'
import React from 'react'

function AdminSidebar({ router }) {
    return (
        <nav id="sidebarMenu" className="col-md-3 col-lg-3 col-xl-2 d-md-block bg-light sidebar collapse" >
            <div className="position-sticky pt-3">
                <ul className="list-unstyled ps-0">
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#menu_users" aria-expanded="true">
                            Users
                        </button>
                        <div className="collapse show" id="menu_users">
                            <ul className="btn-toggle-nav list-unstyledz fw-normal pb-1 small">
                                <li> <Link href="/admin/users"><a className={"dropdown-item " + (router.pathname == '/admin/users' ? ' active' : '')}>All users</a></Link> </li>
                                <li> <Link href="/admin/users/new"><a className={"dropdown-item " + (router.pathname == '/admin/users/new' ? ' active' : '')}>Add new user</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#menu_forms" aria-expanded="true">
                            Forms/Surveys
                        </button>
                        <div className="collapse show" id="menu_forms">
                            <ul className="btn-toggle-nav list-unstyledz fw-normal pb-1 small">
                                <li>
                                    <Link href="/admin/forms"><a className={"dropdown-item " + (router.pathname == '/admin/forms' ? ' active' : '')} aria-current="page">Forms</a></Link>
                                </li>
                                <li>
                                    <Link href="/admin/forms/new"><a className={"dropdown-item " + (router.pathname == '/admin/forms/new' ? ' active' : '')} aria-current="page">Add new form</a></Link>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#menu_pt_schemes" aria-expanded="false">
                            Schemes
                        </button>
                        <div className="collapse" id="menu_pt_schemes">
                            <ul className="btn-toggle-nav list-unstyledz fw-normal pb-1 small">
                                <li> <Link href="/admin/schemes"><a className={"dropdown-item " + (router.pathname == '/admin/schemes' ? ' active' : '')} aria-current="page">All schemes</a></Link> </li>
                                <li> <Link href="/admin/schemes/new"><a className={"dropdown-item " + (router.pathname == '/admin/schemes/new' ? ' active' : '')} aria-current="page">Add new scheme</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#menu_dict" aria-expanded="false">
                            Dictionary
                        </button>
                        <div className="collapse" id="menu_dict">
                            <ul className="btn-toggle-nav list-unstyledz fw-normal pb-1 small">
                                <li> <Link href="/admin/dictionary"><a className={"dropdown-item " + (router.pathname == '/admin/dictionary' ? ' active' : '')} aria-current="page">Dictionary</a></Link> </li>
                                <li> <Link href="/admin/dictionary/new"><a className={"dropdown-item " + (router.pathname == '/admin/dictionary/new' ? ' active' : '')} aria-current="page">Add new entry</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                    <li className="mb-1">
                        <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#menu_access_mgt" aria-expanded="false">
                            Access control
                        </button>
                        <div className="collapse" id="menu_access_mgt">
                            <ul className="btn-toggle-nav list-unstyledz fw-normal pb-1 small">
                                <li> <Link href="/admin/permissions"><a className={"dropdown-item " + (router.pathname == '/admin/permissions' ? ' active' : '')} aria-current="page">Permissions</a></Link> </li>
                                <li> <Link href="/admin/permissions/new"><a className={"dropdown-item " + (router.pathname == '/admin/permissions/new' ? ' active' : '')} aria-current="page">Add new permission</a></Link> </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li> <Link href="/admin/roles"><a className={"dropdown-item " + (router.pathname == '/admin/roles' ? ' active' : '')} aria-current="page">Roles</a></Link> </li>
                                <li> <Link href="/admin/roles/new"><a className={"dropdown-item " + (router.pathname == '/admin/roles/new' ? ' active' : '')} aria-current="page">Add new role</a></Link> </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </nav >
    )
}

export default AdminSidebar