import Link from 'next/link'
import React from 'react'

function AppNavbar() {
    return (
        <nav style={{background: '#acd', padding: '1rem'}}>
            <ul style={{listStyle: 'none', display: 'flex', justifyContent: 'flex-start', gap: '9px'}}>
                <li>
                    Auth: 
                </li>
                <li>
                    <Link href="/auth/login">Log in</Link>
                </li>
                <li>
                    <Link href="/auth/signup">Sign up</Link>
                </li>
                <li>
                    <Link href="/auth/password-reset">Password reset</Link>
                </li>
            </ul>
            <ul style={{listStyle: 'none', display: 'flex', justifyContent: 'flex-start', gap: '9px'}}>
                <li>
                    Admin: 
                </li>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/admin/users">Users</Link>
                </li>
                <li>
                    <Link href="/admin/access/permissions">Permissions</Link>
                </li>
                <li>
                    <Link href="/admin/access/roles">Roles</Link>
                </li>
                <li>
                    <Link href="/admin/dictionary">Dictionary</Link>
                </li>
                <li>
                    <Link href="/admin/forms">Forms</Link>
                </li>
                <li>
                    <Link href="/admin/schemes">Schemes</Link>
                </li>
            </ul>
            <ul style={{listStyle: 'none', display: 'flex', justifyContent: 'flex-start', gap: '9px'}}>
                <li>
                    User: 
                </li>
                <li>
                    <Link href="/user/evaluations">Evaluations</Link>
                </li>
                <li>
                    <Link href="/user/reports">Reports</Link>
                </li>
                <li>
                    <Link href="/user/surveys">Surveys</Link>
                </li>
                <li>
                    <Link href="/user/settings">Settings</Link>
                </li>
            </ul>
        </nav>
    )
}

export default AppNavbar