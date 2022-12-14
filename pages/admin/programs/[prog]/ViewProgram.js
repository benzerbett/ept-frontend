import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export function ViewProgram() {
    const router = useRouter();
    const { prog } = router.query;
    return (
        <>
            <Head>
                <title>EPT | View Program</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                {/* subnav */}
                <div className="row mb-5">
                    <div className="col-md-12 position-relative overflow-x-hidden d-flex p-0">
                        <div className="row w-md-100 position-absolute start-0 end-0">
                            <div className="position-relative w-100 overflow-x-hidden d-flex p-0">
                                <nav className="d-flex flex-nowrap nav nav-secondary rounded text-nowrap w-100 px-2" aria-label="Secondary navigation" style={{ overflowX: 'auto', backgroundColor: '#eeeeef' }}>
                                    <Link href={`/admin/programs/${prog}`}>
                                        <a className={"text-nowrap nav-link " + (
                                            router.asPath === `/admin/programs/${prog}` ? 'active' : ''
                                        )} aria-current="page">
                                            [{prog}]
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/schemes`}>
                                        <a className={"text-nowrap nav-link " + (
                                            router.asPath.includes(`/admin/programs/${prog}/schemes`) ? 'active' : ''
                                        )}>
                                            Schemes
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/forms`}>
                                        <a className={"text-nowrap nav-link " + (
                                            router.asPath.includes(`/admin/programs/${prog}/forms`) ? 'active' : ''
                                        )}>
                                            Forms
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/rounds`}>
                                        <a className={"text-nowrap nav-link " + (
                                            router.asPath.includes(`/admin/programs/${prog}/rounds`) ? 'active' : ''
                                        )}>
                                            Rounds
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/reports`}>
                                        <a className={"text-nowrap nav-link " + (
                                            router.asPath.includes(`/admin/programs/${prog}/reports`) ? 'active' : ''
                                        )}>
                                            Reports
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/edit`}>
                                        <a className={"text-nowrap nav-link " + (
                                            router.asPath.includes(`/admin/programs/${prog}/edit`) ? 'active' : ''
                                        )}>
                                            Settings/Edit
                                        </a>
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
                {/* subnav */}
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        ViewProgram {prog}
                    </div>
                </div>
            </div>
        </>
    );
}
