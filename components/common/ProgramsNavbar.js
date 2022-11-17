import Link from 'next/link'
import React from 'react'

function ProgramsNavbar({ router, program, subtitle }) {
    const { prog } = router.query
    return (
        <>
            {/* subnav */}
            <div className="p-0 w-auto max-w-100 flex-grow-1 d-flex flex-wrap mb-2 mb-lg-0">
                {/* <div className="row"> */}
                    <div className="flex-grow-1 flex-md-grow-0 col-lg-3 mt-2 text-nowrap d-flex flex-row flex-lg-column align-items-center justify-content-between">
                        {subtitle ? <h6 className='mb-lg-0 text-center text-lg-left'>{program?.name || 'Program ' + prog}</h6> : <h4 className='mb-lg-0 text-center text-lg-left'>{program?.name || 'Program ' + prog}</h4>}
                        {subtitle && <h4 className='mb-lg-0 text-center text-lg-left'>{subtitle}</h4>}
                    </div>
                    <div className="col-lg-9 max-w-100 position-relative overflow-x-hidden d-flex p-0">
                        <div className="row w-lg-100 position-lg-absolute start-0 end-0">
                            <div className="position-relative w-100 overflow-x-hidden d-flex p-0">
                                <nav className="d-flex flex-xl-nowrap align-items-center nav nav-secondary rounded text-nowrap w-100 px-2" aria-label="Secondary navigation" style={{ overflowX: 'auto', backgroundColor: '#eeeeef' }}>
                                    <Link href={`/admin/programs/${prog}`}>
                                        <a className={"text-nowrap nav-link d-flex align-items-center justify-content-center " + (
                                            router.asPath === `/admin/programs/${prog}` ? 'active' : ''
                                        )} aria-current="page">
                                            Details
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/schemas`}>
                                        <a className={"text-nowrap nav-link d-flex align-items-center justify-content-center " + (
                                            router.asPath.includes(`/admin/programs/${prog}/schemas`) ? 'active' : ''
                                        )}>
                                            Schemas
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/forms`}>
                                        <a className={"text-nowrap nav-link d-flex align-items-center justify-content-center " + (
                                            router.asPath.includes(`/admin/programs/${prog}/forms`) ? 'active' : ''
                                        )}>
                                            Forms
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/rounds`}>
                                        <a className={"text-nowrap nav-link d-flex align-items-center justify-content-center " + (
                                            router.asPath.includes(`/admin/programs/${prog}/rounds`) ? 'active' : ''
                                        )}>
                                            Rounds
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/reports`}>
                                        <a className={"text-nowrap nav-link d-flex align-items-center justify-content-center " + (
                                            router.asPath.includes(`/admin/programs/${prog}/reports`) ? 'active' : ''
                                        )}>
                                            Reports
                                        </a>
                                    </Link>
                                    <Link href={`/admin/programs/${prog}/edit`}>
                                        <a className={"text-nowrap nav-link d-flex align-items-center justify-content-center " + (
                                            router.asPath.includes(`/admin/programs/${prog}/edit`) ? 'active' : ''
                                        )}>
                                            Edit Program
                                        </a>
                                    </Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
            {/* subnav */}
        </>
    )
}

export default ProgramsNavbar