import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import AdminNavbar from '../common/AdminNavbar'
import AdminSidebar from '../common/AdminSidebar'
import AppFooter from '../common/AppFooter'

export default function AdminTheme({ children }) {
    const router = useRouter()
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="stylesheet" href="/css/dash.css" />
            </Head>
            <div className='d-flex' style={{ minHeight: '100vh', flexDirection: 'column' }}>
                {/* ----<Header----- */}
                <AdminNavbar/>
                {/* ----Header/>----- */}

                <div className="container-fluid flex-grow-1">
                    <div className="row">
                        <AdminSidebar router={router} />
                        {/* ----<Main---- */}
                        <main className="col-md-9 ms-sm-auto col-lg-9 col-xl-10 p-md-3">
                            {children ? children : null}
                        </main>
                        {/* ----Main/>---- */}
                    </div>
                </div>
                <div className="col-md-9 ms-sm-auto col-lg-10 flex-shrink-0">
                    <AppFooter />
                </div>
            </div>
        </>
    )
}