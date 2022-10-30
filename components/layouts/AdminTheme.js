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
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
                <meta charset="utf8" />
            </Head>
            <div className='d-flex' style={{ minHeight: '100vh', flexDirection: 'column' }}>
                {/* ----<Header----- */}
                <AdminNavbar />
                {/* ----Header/>----- */}

                <div className="container-fluid flex-grow-1">
                    <div className="row">
                        <AdminSidebar router={router} />
                        {/* ----<Main---- */}
                        <main className="col-md-9 ms-sm-auto col-lg-9 col-xl-10 p-md-3">
                            <div className='row'>
                                <div className='col-md-12'>
                                    {/* breadcrumbs */}
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                                            {router.asPath.split('/').filter(m=>m!=='admin').map((item, index) => {
                                                if (item !== '') {
                                                    return (
                                                        <li key={index} className="breadcrumb-item active"
                                                        style={{ textTransform: 'capitalize', fontSize: '0.89em'}} aria-current="page">{item}</li>
                                                    )
                                                }
                                            })}
                                        </ol>
                                    </nav>
                                </div>
                                <div className='col-md-12'>
                                    {children ? children : null}
                                </div>
                            </div>
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