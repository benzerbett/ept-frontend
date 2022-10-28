import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import ProgramsNavbar from '../../../../../../components/common/ProgramsNavbar'

function ViewRound() {
    const router = useRouter()
    const { prog, round } = router.query
    return (
        <>
            <Head>
                <title>EPT | View Round</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <ProgramsNavbar router={router} />
                <div className='row mt-5'>
                    <div className='col-md-12'>
                        ViewRound Program:{prog}, Round:{round}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewRound